import { useState, useCallback } from 'react';
import { aiFoodService, Recommendation, Restaurant } from '@/lib/api/openai';

type AIRecommendationState = {
  loading: boolean;
  error: Error | null;
  recommendations: Recommendation[];
};

export function useAIRecommendations() {
  const [state, setState] = useState<AIRecommendationState>({
    loading: false,
    error: null,
    recommendations: [],
  });

  const getRecommendations = useCallback(async (
    restaurants: Restaurant[],
    preference: string,
    userHistory?: {
      previousOrders?: string[];
      favoriteRestaurants?: string[];
      dietaryPreferences?: string[];
    }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recommendations = await aiFoodService.getRecommendation({
        restaurants,
        preference,
        userHistory,
      });

      setState({
        loading: false,
        error: null,
        recommendations,
      });

      return recommendations;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to get recommendations'),
        recommendations: [],
      });
      return [];
    }
  }, []);

  return {
    ...state,
    getRecommendations,
  };
}
