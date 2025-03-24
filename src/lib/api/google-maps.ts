import { Loader } from '@googlemaps/js-api-loader';

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export type Location = {
  lat: number;
  lng: number;
  address?: string;
};

export class LocationService {
  private loader: Loader;
  private geocoder: google.maps.Geocoder | null = null;

  constructor() {
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });
  }

  async init(): Promise<void> {
    await this.loader.load();
    this.geocoder = new google.maps.Geocoder();
  }

  async getCurrentLocation(): Promise<Location> {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          try {
            // Reverse geocode to get address
            const address = await this.reverseGeocode(location);
            resolve({ ...location, address });
          } catch (error) {
            // If reverse geocoding fails, still return the coordinates
            resolve(location);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async reverseGeocode(location: Location): Promise<string> {
    if (!this.geocoder) {
      await this.init();
    }

    if (!this.geocoder) {
      throw new Error('Geocoder failed to initialize');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error(`Geocoder failed: ${status}`));
        }
      });
    });
  }

  async searchNearbyPlaces(
    location: Location,
    radius: number = 1500,
    type: string = 'restaurant'
  ): Promise<google.maps.places.PlaceResult[]> {
    await this.loader.load();

    return new Promise((resolve, reject) => {
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      service.nearbySearch(
        {
          location,
          radius,
          type,
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        }
      );
    });
  }
}

export const locationService = new LocationService();
