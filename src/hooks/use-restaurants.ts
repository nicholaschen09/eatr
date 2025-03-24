import { useState, useCallback } from 'react';
import { restaurantService } from '@/lib/api/restaurant';
import { Restaurant } from '@/lib/api/openai';
import { useLocation } from './use-location';

type RestaurantsState = {
  loading: boolean;
  error: Error | null;
  restaurants: Restaurant[];
};

export function useRestaurants() {
  const { location, searchNearbyRestaurants } = useLocation();
  const [state, setState] = useState<RestaurantsState>({
    loading: false,
    error: null,
    restaurants: [],
  });

  const fetchNearbyRestaurants = useCallback(async (radius: number = 1500) => {
    if (!location) {
      setState(prev => ({
        ...prev,
        error: new Error('Location not available'),
      }));
      return [];
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const placesResults = await searchNearbyRestaurants(radius);
      const restaurants = restaurantService.mapPlacesToRestaurants(placesResults);

      setState({
        loading: false,
        error: null,
        restaurants,
      });

      return restaurants;
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch restaurants'),
        restaurants: [],
      });
      return [];
    }
  }, [location, searchNearbyRestaurants]);

  const getRestaurantDetails = useCallback(async (restaurantId: string) => {
    try {
      return await restaurantService.getRestaurantDetails(restaurantId);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      throw error;
    }
  }, []);

  const getRestaurantMenu = useCallback(async (restaurantId: string) => {
    try {
      return await restaurantService.getRestaurantMenu(restaurantId);
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    fetchNearbyRestaurants,
    getRestaurantDetails,
    getRestaurantMenu,
    placeOrder: restaurantService.placeOrder.bind(restaurantService),
    getUserOrderHistory: restaurantService.getOrderHistory.bind(restaurantService),
    getUserFavorites: restaurantService.getUserFavorites.bind(restaurantService),
  };
}
