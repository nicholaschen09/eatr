import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recommendation } from '@/lib/api/openai';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onOrderClick: (recommendation: Recommendation) => void;
}

export function RecommendationCard({ recommendation, onOrderClick }: RecommendationCardProps) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{recommendation.dishName}</CardTitle>
        <p className="text-sm text-muted-foreground">{recommendation.restaurantName}</p>
        {recommendation.estimatedPrice && (
          <p className="text-sm font-medium">{recommendation.estimatedPrice}</p>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-3">{recommendation.description}</p>
        <div className="mt-2">
          <h4 className="text-sm font-semibold mb-1">Why we recommend this:</h4>
          <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => onOrderClick(recommendation)}
        >
          Order This
        </Button>
      </CardFooter>
    </Card>
  );
}

interface RecommendationListProps {
  recommendations: Recommendation[];
  loading: boolean;
  error: Error | null;
  onOrderClick: (recommendation: Recommendation) => void;
}

export function RecommendationList({ recommendations, loading, error, onOrderClick }: RecommendationListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />

              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
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
          <p>Failed to load recommendations: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't find any recommendations that match your preferences. Try adjusting your search criteria or selecting different restaurants.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={`${recommendation.restaurantId}-${recommendation.dishName}`}
          recommendation={recommendation}
          onOrderClick={onOrderClick}
        />
      ))}
    </div>
  );
}
