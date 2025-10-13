'use client';

import React, { useState, useEffect } from 'react';

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

const SmartGreeting: React.FC = () => {
  const [greetingData, setGreetingData] = useState<SmartGreetingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSmartGreeting();
  }, []);

  const fetchSmartGreeting = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/greeting/smart-greeting');
      const data: SmartGreetingResponse = await response.json();

      if (data.success) {
        setGreetingData(data);
      } else {
        setError(data.error || 'Failed to fetch greeting');
        // Still show fallback greeting
        setGreetingData(data);
      }
    } catch (err) {
      console.error('Error fetching smart greeting:', err);
      setError('Network error occurred');
      // Set fallback greeting
      setGreetingData({
        success: false,
        greeting: "Hello! Welcome! How can I help you today? 😊",
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning':
        return '🌅';
      case 'afternoon':
        return '☀️';
      case 'evening':
        return '🌆';
      case 'night':
        return '🌙';
      default:
        return '⏰';
    }
  };

  const getWeatherIcon = (iconCode: string | null) => {
    if (!iconCode) return '🌤️';

    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };

    return iconMap[iconCode] || '🌤️';
  };

  if (isLoading) {
    return (
      <div className="smart-greeting loading">
        <div className="greeting-content">
          <div className="loading-spinner">⏳</div>
          <p>Preparing your personalized greeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-greeting">
      <div className="greeting-content">
        <div className="greeting-text">
          <h2>{greetingData?.greeting || "Hello! Welcome! 😊"}</h2>
        </div>

        {greetingData?.data && (
          <div className="greeting-details">
            <div className="detail-item time-info">
              <span className="icon">{getTimeIcon(greetingData.data.time.timeOfDay)}</span>
              <span className="text">
                {greetingData.data.time.dayOfWeek}, {greetingData.data.time.date}
              </span>
            </div>

            {greetingData.data.location.city !== 'Unknown' && (
              <div className="detail-item location-info">
                <span className="icon">📍</span>
                <span className="text">
                  {greetingData.data.location.city}
                  {greetingData.data.location.region !== 'Unknown' &&
                   greetingData.data.location.region !== greetingData.data.location.city &&
                   `, ${greetingData.data.location.region}`}
                </span>
              </div>
            )}

            {greetingData.data.weather.temperature !== null && (
              <div className="detail-item weather-info">
                <span className="icon">{getWeatherIcon(greetingData.data.weather.icon)}</span>
                <span className="text">
                  {greetingData.data.weather.temperature}°C
                  {greetingData.data.weather.description !== 'Weather data unavailable' &&
                   `, ${greetingData.data.weather.description}`}
                </span>
              </div>
            )}
          </div>
        )}

        {error && !greetingData?.success && (
          <div className="error-notice">
            <small>⚠️ Some location/weather data couldn't be loaded, but you're still very welcome!</small>
          </div>
        )}
      </div>

      <style jsx>{`
        .smart-greeting {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .smart-greeting.loading {
          text-align: center;
          padding: 32px;
        }

        .loading-spinner {
          font-size: 24px;
          margin-bottom: 12px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .greeting-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .greeting-text h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .greeting-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .detail-item .icon {
          font-size: 1.1rem;
          min-width: 20px;
        }

        .detail-item .text {
          flex: 1;
        }

        .error-notice {
          margin-top: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .smart-greeting {
            padding: 20px;
            margin-bottom: 20px;
          }

          .greeting-text h2 {
            font-size: 1.3rem;
          }

          .detail-item {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartGreeting;