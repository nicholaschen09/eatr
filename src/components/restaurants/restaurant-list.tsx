import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/lib/api/openai";

interface RestaurantListProps {
  restaurants: Restaurant[];
  loading: boolean;
  error: Error | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  selectedRestaurants?: Restaurant[];
}

export function RestaurantList({
  restaurants,
  loading,
  error,
  onSelectRestaurant,
  selectedRestaurants = []
}: RestaurantListProps) {
  const isSelected = (restaurant: Restaurant) => {
    return selectedRestaurants.some(r => r.id === restaurant.id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load restaurants: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No restaurants found nearby. Try expanding your search radius or refreshing your location.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => {
        const selected = isSelected(restaurant);

        return (
          <Card
            key={restaurant.id}
            className={`w-full hover:shadow-md transition-shadow ${selected ? 'border-primary bg-primary/5' : ''}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{restaurant.name}</CardTitle>
              <CardDescription>
                {restaurant.rating && (
                  <span className="flex items-center">
                    Rating: {restaurant.rating}{' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-yellow-500 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
                {restaurant.priceLevel && (
                  <span className="ml-2">
                    Price: {'$'.repeat(restaurant.priceLevel)}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {restaurant.vicinity || 'Address not available'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {restaurant.types?.slice(0, 3).map(type =>
                  type.replace(/_/g, ' ')
                ).join(', ')}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => onSelectRestaurant(restaurant)}
                variant={selected ? "default" : "outline"}
                size="sm"
              >
                {selected ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
