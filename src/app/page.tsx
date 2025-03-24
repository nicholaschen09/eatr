"use client";

import React, { useState } from 'react';
import { LocationDetector } from '@/components/location/location-detector';
import { PreferenceForm } from '@/components/preferences/preference-form';
import { RestaurantList } from '@/components/restaurants/restaurant-list';
import { RecommendationList } from '@/components/recommendations/ai-recommendation-card';
import { OrderForm } from '@/components/order/order-form';
import { OrderConfirmation } from '@/components/order/order-confirmation';
import { Restaurant, Recommendation } from '@/lib/api/openai';
import { Order } from '@/lib/api/restaurant';
import { useRestaurants } from '@/hooks/use-restaurants';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { useUserData } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();
  const { userData } = useUserData();
  const { restaurants, loading: restaurantsLoading, error: restaurantsError, fetchNearbyRestaurants } = useRestaurants();
  const { recommendations, loading: recommendationsLoading, error: recommendationsError, getRecommendations } = useAIRecommendations();

  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [userPreference, setUserPreference] = useState<string>('');
  const [activeStep, setActiveStep] = useState<'location' | 'restaurants' | 'preference' | 'recommendations'>('location');
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);

  // Handle location detection completion
  const handleLocationDetected = async () => {
    try {
      await fetchNearbyRestaurants();
      setActiveStep('restaurants');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find nearby restaurants. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle restaurant selection
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurants(prev => {
      // If already selected, remove it
      if (prev.some(r => r.id === restaurant.id)) {
        return prev.filter(r => r.id !== restaurant.id);
      }
      // Add it to selection
      return [...prev, restaurant];
    });
  };

  // Handle preference submission
  const handleSubmitPreference = async (preference: string) => {
    setUserPreference(preference);

    try {
      // Get user history for better recommendations
      const userHistory = {
        dietaryPreferences: userData.dietaryPreferences,
        favoriteRestaurants: userData.favorites,
        previousOrders: [], // This would come from order history
      };

      // Use either selected restaurants or all restaurants
      const restaurantsToUse = selectedRestaurants.length > 0 ? selectedRestaurants : restaurants;

      await getRecommendations(restaurantsToUse, preference, userHistory);
      setActiveStep('recommendations');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle recommendation selection
  const handleSelectRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsOrderFormOpen(true);
  };

  // Handle order submission
  const handleSubmitOrder = async (order: Omit<Order, 'status' | 'createdAt'>) => {
    setIsOrderSubmitting(true);

    try {
      // In a real app, this would call an API
      // For now, we're just simulating an order completion
      await new Promise(resolve => setTimeout(resolve, 1500));

      const completeOrder: Order = {
        ...order,
        status: 'confirmed',
        createdAt: new Date(),
      };

      setCompletedOrder(completeOrder);
      setIsOrderFormOpen(false);
      setIsOrderConfirmationOpen(true);
      setIsOrderSubmitting(false);

      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
    } catch (error) {
      setIsOrderSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Find Food Near You</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <LocationDetector onLocationDetected={handleLocationDetected} />
          </div>
          <div>
            <PreferenceForm
              onSubmit={handleSubmitPreference}
              isLoading={recommendationsLoading}
            />
          </div>
        </div>
      </section>

      {activeStep === 'restaurants' && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Nearby Restaurants</h2>
            {selectedRestaurants.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectedRestaurants.length} selected</span>
                <button
                  onClick={() => setSelectedRestaurants([])}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <RestaurantList
            restaurants={restaurants}
            loading={restaurantsLoading}
            error={restaurantsError}
            onSelectRestaurant={handleSelectRestaurant}
            selectedRestaurants={selectedRestaurants}
          />
        </section>
      )}

      {activeStep === 'recommendations' && (
        <section>
          <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
          <p className="mb-6 text-muted-foreground">
            Based on your preference: <span className="font-medium text-foreground">"{userPreference}"</span>
          </p>
          <RecommendationList
            recommendations={recommendations}
            loading={recommendationsLoading}
            error={recommendationsError}
            onOrderClick={handleSelectRecommendation}
          />
        </section>
      )}

      {/* Order Form Dialog */}
      <OrderForm
        recommendation={selectedRecommendation}
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSubmit={handleSubmitOrder}
        isSubmitting={isOrderSubmitting}
      />

      {/* Order Confirmation Dialog */}
      <OrderConfirmation
        order={completedOrder}
        isOpen={isOrderConfirmationOpen}
        onClose={() => setIsOrderConfirmationOpen(false)}
      />
    </div>
  );
}
