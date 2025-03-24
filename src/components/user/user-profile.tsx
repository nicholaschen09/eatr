import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useUserData, UserData } from "@/hooks/use-user-data";
import { useRestaurants } from "@/hooks/use-restaurants";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  dietaryPreference: z.string().optional(),
});

export function UserProfile() {
  const { userData, saveUserData, addDietaryPreference, removeDietaryPreference, clearUserData } = useUserData();
  const { getUserOrderHistory, getUserFavorites } = useRestaurants();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDietaryDialogOpen, setIsDietaryDialogOpen] = useState(false);
  const [newPreference, setNewPreference] = useState('');

  const orderHistory = getUserOrderHistory();
  const favoriteItems = getUserFavorites();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      dietaryPreference: '',
    },
  });

  function handleProfileSubmit(values: z.infer<typeof profileSchema>) {
    saveUserData({
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
    });
    setIsProfileOpen(false);
  }

  function handleAddPreference() {
    if (newPreference.trim()) {
      addDietaryPreference(newPreference.trim());
      setNewPreference('');
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Manage your profile information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <div className="font-medium">Name:</div>
            <div>{userData.name || 'Not set'}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Email:</div>
            <div>{userData.email || 'Not set'}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Phone:</div>
            <div>{userData.phone || 'Not set'}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Address:</div>
            <div>{userData.address || 'Not set'}</div>
          </div>
          <div className="flex justify-between items-start">
            <div className="font-medium">Dietary Preferences:</div>
            <div className="text-right">
              {userData.dietaryPreferences.length > 0 ? (
                <div className="flex flex-wrap justify-end gap-1">
                  {userData.dietaryPreferences.map((pref) => (
                    <span
                      key={pref}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {pref}
                      <button
                        type="button"
                        onClick={() => removeDietaryPreference(pref)}
                        className="ml-1.5 h-3.5 w-3.5 rounded-full text-primary/40 hover:text-primary"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                'None'
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsDietaryDialogOpen(true)}>
            Add Dietary Preference
          </Button>
          <Button onClick={() => setIsProfileOpen(true)}>Edit Profile</Button>
        </CardFooter>
      </Card>

      {orderHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>Your recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderHistory.slice(0, 3).map((order, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{order.restaurantName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-muted-foreground">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {orderHistory.length > 3 && (
            <CardFooter>
              <Button variant="outline" className="w-full">View All Orders</Button>
            </CardFooter>
          )}
        </Card>
      )}

      {favoriteItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Favorites</CardTitle>
            <CardDescription>Items you've ordered the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {favoriteItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-4">
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => clearUserData()}>
                  Clear All Data
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Dietary Preference Dialog */}
      <Dialog open={isDietaryDialogOpen} onOpenChange={setIsDietaryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Dietary Preference</DialogTitle>
            <DialogDescription>
              Add your dietary preferences to get better recommendations
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <FormLabel htmlFor="preference">Preference</FormLabel>
              <Input
                id="preference"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                placeholder="e.g., Vegetarian, Gluten-free, No nuts"
              />
            </div>
            <Button onClick={handleAddPreference}>Add</Button>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Current Preferences:</h4>
            <div className="flex flex-wrap gap-1">
              {userData.dietaryPreferences.length > 0 ? (
                userData.dietaryPreferences.map((pref) => (
                  <span
                    key={pref}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {pref}
                    <button
                      type="button"
                      onClick={() => removeDietaryPreference(pref)}
                      className="ml-1.5 h-3.5 w-3.5 rounded-full text-primary/40 hover:text-primary"
                    >
                      ✕
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No preferences set</span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDietaryDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
