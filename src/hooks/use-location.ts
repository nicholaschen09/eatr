import { useState, useEffect, useCallback } from 'react';
import { locationService, Location } from '@/lib/api/google-maps';

type LocationState = {
  loading: boolean;
  error: Error | null;
  location: Location | null;
  address: string | null;
};

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    loading: true,
    error: null,
    location: null,
    address: null,
  });

  const fetchLocation = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const location = await locationService.getCurrentLocation();
      setState({
        loading: false,
        error: null,
        location,
        address: location.address || null,
      });
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to get location'),
        location: null,
        address: null,
      });
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchLocation().catch(console.error);
  }, [fetchLocation]);

  const searchNearbyRestaurants = useCallback(
    async (radius?: number, type?: string) => {
      if (!state.location) {
        throw new Error('Location not available');
      }

      try {
        return await locationService.searchNearbyPlaces(state.location, radius, type);
      } catch (error) {
        console.error('Error searching nearby places:', error);
        throw error;
      }
    },
    [state.location]
  );

  return {
    ...state,
    fetchLocation,
    searchNearbyRestaurants,
  };
}
