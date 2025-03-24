import { useState, useEffect, useCallback } from 'react';

export type UserData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  dietaryPreferences: string[];
  favorites: string[];
  visitCount: number;
  lastVisit: string;
};

const defaultUserData: UserData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  dietaryPreferences: [],
  favorites: [],
  visitCount: 0,
  lastVisit: '',
};

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);

  // Update user analytics - visit count and last visit time
  const updateAnalytics = useCallback(() => {
    setUserData(prev => {
      const now = new Date().toISOString();
      const updated = {
        ...prev,
        visitCount: (prev.visitCount || 0) + 1,
        lastVisit: now,
      };

      // Save to localStorage
      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);

        // Update visit count and last visit
        updateAnalytics();
      }
    };

    loadUserData();
  }, [updateAnalytics]); // Add updateAnalytics as a dependency

  // Save user data
  const saveUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Add a dietary preference
  const addDietaryPreference = useCallback((preference: string) => {
    setUserData(prev => {
      if (prev.dietaryPreferences.includes(preference)) {
        return prev;
      }

      const updated = {
        ...prev,
        dietaryPreferences: [...prev.dietaryPreferences, preference],
      };

      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Remove a dietary preference
  const removeDietaryPreference = useCallback((preference: string) => {
    setUserData(prev => {
      const updated = {
        ...prev,
        dietaryPreferences: prev.dietaryPreferences.filter(p => p !== preference),
      };

      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Add a favorite restaurant or dish
  const addFavorite = useCallback((item: string) => {
    setUserData(prev => {
      if (prev.favorites.includes(item)) {
        return prev;
      }

      const updated = {
        ...prev,
        favorites: [...prev.favorites, item],
      };

      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Remove a favorite restaurant or dish
  const removeFavorite = useCallback((item: string) => {
    setUserData(prev => {
      const updated = {
        ...prev,
        favorites: prev.favorites.filter(f => f !== item),
      };

      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all user data
  const clearUserData = useCallback(() => {
    localStorage.removeItem('userData');
    setUserData(defaultUserData);
  }, []);

  return {
    userData,
    loading,
    saveUserData,
    addDietaryPreference,
    removeDietaryPreference,
    addFavorite,
    removeFavorite,
    clearUserData,
  };
}
