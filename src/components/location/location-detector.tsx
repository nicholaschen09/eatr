import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "@/hooks/use-location";
import { Skeleton } from "@/components/ui/skeleton";

interface LocationDetectorProps {
  onLocationDetected?: () => void;
}

export function LocationDetector({ onLocationDetected }: LocationDetectorProps) {
  const { loading, error, location, address, fetchLocation } = useLocation();

  const handleRefreshLocation = async () => {
    await fetchLocation();
    if (onLocationDetected) {
      onLocationDetected();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Your Location</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshLocation}
          disabled={loading}
        >
          {loading ? "Detecting..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">
            <p>Error detecting location: {error.message}</p>
            <Button
              variant="default"
              size="sm"
              className="mt-2"
              onClick={handleRefreshLocation}
            >
              Try Again
            </Button>
          </div>
        ) : location ? (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {address ? address : 'Location detected'}
            </p>
            <p className="text-xs text-muted-foreground">
              Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        ) : (
          <div className="text-sm">
            <p>No location detected. Please allow location access.</p>
            <Button
              variant="default"
              size="sm"
              className="mt-2"
              onClick={handleRefreshLocation}
            >
              Detect Location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
