import axios from 'axios';
import { Restaurant } from './openai';
import { Location } from './google-maps';

// For now, we'll mock the API with functions that transform Google Places data
// In a real application, this would connect to a restaurant ordering API

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export type Order = {
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  deliveryAddress: string;
  userInfo: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  createdAt: Date;
};

export class RestaurantService {
  // Convert Google Places results to our Restaurant type
  mapPlacesToRestaurants(places: google.maps.places.PlaceResult[]): Restaurant[] {
    return places.map(place => ({
      id: place.place_id || `restaurant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: place.name || 'Unknown Restaurant',
      rating: place.rating,
      priceLevel: place.price_level,
      vicinity: place.vicinity,
      types: place.types,
      photos: place.photos?.map(photo => ({
        photo_reference: photo.photo_reference || '',
        width: photo.width,
        height: photo.height,
      })),
    }));
  }

  async getRestaurantDetails(restaurantId: string): Promise<Restaurant | null> {
    // In a real app, this would call an API
    // For now, we'll simulate a delay and return a mock response
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock restaurant details
    return {
      id: restaurantId,
      name: `Restaurant ${restaurantId.substring(0, 5)}`,
      rating: 4.5,
      priceLevel: 2,
      vicinity: '123 Main St',
      types: ['restaurant', 'food'],
    };
  }

  async getRestaurantMenu(restaurantId: string): Promise<MenuCategory[]> {
    // In a real app, this would call an API
    // For now, we'll simulate a delay and return a mock menu
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock menu data
    return [
      {
        category: 'Appetizers',
        items: [
          { id: 'app1', name: 'Spring Rolls', description: 'Fresh vegetables wrapped in rice paper', price: 8.99 },
          { id: 'app2', name: 'Mozzarella Sticks', description: 'Breaded and deep-fried mozzarella', price: 7.99 },
        ]
      },
      {
        category: 'Main Courses',
        items: [
          { id: 'main1', name: 'Chicken Parmesan', description: 'Breaded chicken with marinara and cheese', price: 15.99 },
          { id: 'main2', name: 'Vegetable Stir Fry', description: 'Fresh vegetables in a savory sauce', price: 13.99 },
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 'des1', name: 'Chocolate Cake', description: 'Rich chocolate cake with ganache', price: 6.99 },
          { id: 'des2', name: 'Cheesecake', description: 'New York style cheesecake', price: 7.99 },
        ]
      }
    ];
  }

  async placeOrder(order: Omit<Order, 'status' | 'createdAt'>): Promise<Order> {
    // In a real app, this would call an API to place the order
    // For now, we'll simulate a delay and return a mock response
    await new Promise(resolve => setTimeout(resolve, 1000));

    const completeOrder: Order = {
      ...order,
      status: 'confirmed',
      createdAt: new Date(),
    };

    // Store the order in localStorage for persistence
    this.saveOrderToHistory(completeOrder);

    return completeOrder;
  }

  // Method to store order in history (localStorage)
  private saveOrderToHistory(order: Order): void {
    // Get existing history
    const historyStr = localStorage.getItem('orderHistory');
    const history: Order[] = historyStr ? JSON.parse(historyStr) : [];

    // Add new order
    history.push(order);

    // Save back to localStorage
    localStorage.setItem('orderHistory', JSON.stringify(history));
  }

  // Get user's order history
  getOrderHistory(): Order[] {
    const historyStr = localStorage.getItem('orderHistory');
    return historyStr ? JSON.parse(historyStr) : [];
  }

  // Get popular dishes from order history
  getUserFavorites(): string[] {
    const history = this.getOrderHistory();

    // Flatten all items from orders
    const allItems = history.flatMap(order =>
      order.items.map(item => item.name)
    );

    // Count occurrences of each item
    const itemCounts = allItems.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count and return top items
    return Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }
}

export const restaurantService = new RestaurantService();
