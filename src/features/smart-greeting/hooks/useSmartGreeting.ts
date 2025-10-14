"use client";

import { useState, useEffect, useCallback } from "react";

interface TimeData {
  timestamp: string;
  localTime: string;
  hour: number;
  timeOfDay: string;
  dayOfWeek: string;
  date: string;
}

interface LocationData {
  country: string;
  region: string;
  city: string;
  timezone: string;
  lat: number;
  lon: number;
  coordinates: string;
}

interface WeatherData {
  temperature: number | null;
  description: string;
  icon: string | null;
  humidity: number | null;
  windSpeed: number | null;
  condition?: string;
}

interface SmartGreetingData {
  time: TimeData;
  location: LocationData;
  weather: WeatherData;
}

interface SmartGreetingResponse {
  success: boolean;
  greeting: string;
  timestamp: string;
  data?: SmartGreetingData;
  error?: string;
}

interface UseSmartGreetingReturn {
  greeting: SmartGreetingResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSmartGreeting = (
  autoFetch: boolean = true
): UseSmartGreetingReturn => {
  const [greeting, setGreeting] = useState<SmartGreetingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGreeting = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${backendUrl}/api/greeting/smart-greeting`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SmartGreetingResponse = await response.json();
      setGreeting(data);

      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch greeting";
      setError(errorMessage);

      // Set fallback greeting
      setGreeting({
        success: false,
        greeting: "Hello! Welcome! How can I help you today? 😊",
        timestamp: new Date().toISOString(),
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchGreeting();
    }
  }, [autoFetch, fetchGreeting]);

  return {
    greeting,
    isLoading,
    error,
    refetch: fetchGreeting,
  };
};

export default useSmartGreeting;
