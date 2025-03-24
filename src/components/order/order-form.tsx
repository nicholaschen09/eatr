import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Recommendation } from '@/lib/api/openai';
import { Order, OrderItem } from '@/lib/api/restaurant';
import { useUserData } from '@/hooks/use-user-data';

const orderSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter a valid delivery address." }),
  paymentMethod: z.string().min(1, { message: "Please select a payment method." }),
});

interface OrderFormProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<Order, 'status' | 'createdAt'>) => void;
  isSubmitting: boolean;
}

export function OrderForm({
  recommendation,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: OrderFormProps) {
  const { userData } = useUserData();
  const [quantity, setQuantity] = useState(1);
  const price = 15.99; // Mock price if not provided in recommendation

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      paymentMethod: 'credit_card',
    },
  });

  function handleSubmit(values: z.infer<typeof orderSchema>) {
    if (!recommendation) return;

    const orderItem: OrderItem = {
      name: recommendation.dishName,
      quantity: quantity,
      price: parseFloat(recommendation.estimatedPrice?.replace(/[^0-9.]/g, '') || price.toString()),
    };

    const totalAmount = orderItem.price * orderItem.quantity;

    const order: Omit<Order, 'status' | 'createdAt'> = {
      restaurantId: recommendation.restaurantId,
      restaurantName: recommendation.restaurantName,
      items: [orderItem],
      deliveryAddress: values.address,
      userInfo: {
        name: values.name,
        phone: values.phone,
        email: values.email,
      },
      paymentMethod: values.paymentMethod,
      totalAmount: totalAmount,
    };

    onSubmit(order);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            {recommendation ? `Order ${recommendation.dishName} from ${recommendation.restaurantName}` : 'Order Details'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash">Cash on Delivery</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <FormLabel>Quantity:</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>

            {recommendation && (
              <div className="text-sm">
                <div className="flex justify-between font-medium">
                  <span>Item Price:</span>
                  <span>{recommendation.estimatedPrice || `$${price.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total:</span>
                  <span>
                    {recommendation.estimatedPrice
                      ? `$${(parseFloat(recommendation.estimatedPrice.replace(/[^0-9.]/g, '')) * quantity).toFixed(2)}`
                      : `$${(price * quantity).toFixed(2)}`}
                  </span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
