import React, { useEffect, useRef, useState } from 'react';
import { GoogleMapsService } from '../../lib/googleMapsIntegration';
import { searchNearbyParking, searchEVCharging, ParkopediaSpot } from '../../lib/parkopedia';
import { CurbsideSpace } from '../../types';
import { Navigation, Zap, Route, AlertTriangle, MapPin, Loader2, RefreshCw } from 'lucide-react';

interface EnhancedGoogleMapComponentProps {
  spaces: CurbsideSpace[];
  onSpaceSelect: (space: CurbsideSpace) => void;
  selectedSpace: CurbsideSpace | null;
  filterType?: string;
  showEVChargers?: boolean;
  showTrafficLayer?: boolean;
  showRouting?: boolean;
  showParkopediaData?: boolean;
  height?: string;
}

const EnhancedGoogleMapComponent: React.FC<EnhancedGoogleMapComponentProps> = ({
  spaces,
  onSpaceSelect,
  selectedSpace,
  filterType = 'all',
  showEVChargers = false,
  showTrafficLayer = false,
  showRouting = false,
  showParkopediaData = true,
  height = '400px',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapService, setMapService] = useState<GoogleMapsService | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [parkopediaSpots, setParkopediaSpots] = useState<ParkopediaSpot[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    initializeMap();
    return () => {
      if (mapService) {
        mapService.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (mapService && userLocation && showParkopediaData) {
      loadParkopediaData();
    }
  }, [mapService, userLocation, showParkopediaData, showEVChargers]);

  useEffect(() => {
    if (mapService) {
      mapService.showTrafficLayer(showTrafficLayer);
    }
  }, [mapService, showTrafficLayer]);

  const initializeMap = async () => {
    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      setMapError('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      setLoading(false);
      return;
    }

    if (!mapRef.current) return;

    try {
      const service = new GoogleMapsService({
        apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry'],
      });

      const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // NYC
      const map = await service.initialize(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      setMapService(service);

      // Get user location
      try {
        const location = await service.getUserLocation();
        setUserLocation(location);
        map.setCenter(location);
        
        // Add user location marker
        new google.maps.Marker({
          position: location,
          map,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
          },
        });
      } catch (error) {
        console.log('Could not get user location, using default');
        setUserLocation(defaultCenter);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to load Google Maps. Please check your API key and internet connection.');
      setLoading(false);
    }
  };

  const loadParkopediaData = async () => {
    if (!mapService || !userLocation) return;

    try {
      mapService.clearMarkers();

      if (showEVChargers) {
        await mapService.addEVChargingMarkers(userLocation, 2000);
        const evSpots = await searchEVCharging(userLocation.lat, userLocation.lng, 2000);
        setParkopediaSpots(evSpots);
      } else {
        await mapService.addParkopediaMarkers(userLocation, 1000);
        const parkingSpots = await searchNearbyParking(userLocation.lat, userLocation.lng, {
          radius: 1000,
          includeEV: filterType === 'parking-ev',
        });
        setParkopediaSpots(parkingSpots);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading Parkopedia data:', error);
    }
  };

  const handleGetDirections = async () => {
    if (!mapService || !userLocation || !selectedSpace) return;

    try {
      await mapService.calculateRoute(
        userLocation,
        selectedSpace.coordinates,
        google.maps.TravelMode.DRIVING,
        true
      );
    } catch (error) {
      console.error('Error calculating directions:', error);
    }
  };

  const handleRefreshData = () => {
    if (mapService && userLocation) {
      loadParkopediaData();
    }
  };

  if (mapError) {
    return (
      <div className="relative flex items-center justify-center bg-gray-50 rounded-lg" style={{ height }}>
        <div className="text-center p-8 max-w-md">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Maps Not Available</h3>
          <p className="text-gray-600 mb-4">{mapError}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-blue-900 mb-2">To enable Google Maps:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Get an API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>2. Enable the Maps JavaScript API</li>
              <li>3. Add <code className="bg-blue-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=your_api_key</code> to your .env file</li>
              <li>4. Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Loading map...</span>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        {selectedSpace && userLocation && (
          <button
            onClick={handleGetDirections}
            className="flex items-center space-x-2 bg-white shadow-lg rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Navigation className="h-4 w-4" />
            <span>Get Directions</span>
          </button>
        )}

        {showParkopediaData && (
          <button
            onClick={handleRefreshData}
            className="flex items-center space-x-2 bg-white shadow-lg rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        )}
        
        {showEVChargers && (
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="text-green-800 font-medium">EV Chargers</span>
          </div>
        )}
        
        {showTrafficLayer && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-red-800 font-medium">Live Traffic</span>
          </div>
        )}
        
        {showRouting && (
          <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
            <Route className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 font-medium">Smart Routing</span>
          </div>
        )}
      </div>

      {/* Data Info */}
      {showParkopediaData && parkopediaSpots.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">Real-time Data</h4>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Parkopedia spots: {parkopediaSpots.length}</div>
            <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
            {showEVChargers && (
              <div>EV charging stations shown</div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Map Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Limited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Full</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
            <span>Your Location</span>
          </div>
          {showEVChargers && (
            <div className="flex items-center space-x-2 col-span-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Zap className="h-3 w-3 text-green-600" />
              <span>EV Charging</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedGoogleMapComponent;