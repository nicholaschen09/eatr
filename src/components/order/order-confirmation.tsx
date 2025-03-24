import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from '@/lib/api/restaurant';

interface OrderConfirmationProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderConfirmation({ order, isOpen, onClose }: OrderConfirmationProps) {
  if (!order) return null;

  const formatDate = (date: Date) => {
    // Convert string date to Date object if needed
    const orderDate = date instanceof Date ? date : new Date(date);
    return orderDate.toLocaleString();
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPaymentMethod = (method: string) => {
    return method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order Confirmation</DialogTitle>
          <DialogDescription>
            Your order has been successfully placed!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {formatStatus(order.status)}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Time:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restaurant:</span>
                <span>{order.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>{formatPaymentMethod(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Address:</span>
                <span className="text-right">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-xs italic mt-1">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p>${item.price.toFixed(2)}</p>
                    <p className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2 font-bold">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="text-sm font-semibold mb-2">Estimated Delivery Time</h3>
            <p className="text-sm">Your order should arrive in 30-45 minutes.</p>
            <p className="text-xs text-muted-foreground mt-2">
              *Delivery time is an estimate and may vary based on restaurant preparation time and traffic conditions.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
