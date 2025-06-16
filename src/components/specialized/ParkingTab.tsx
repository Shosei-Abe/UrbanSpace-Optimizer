import React, { useState, useEffect } from 'react';
import { Car, Search, Filter, MapPin, Clock, DollarSign, Navigation, Loader2 } from 'lucide-react';
import { CurbsideSpace } from '../../types';
import GoogleMapComponent from '../maps/GoogleMapComponent';
import SpaceCard from '../SpaceCard';
import ParkingDataInfo from '../ParkingDataInfo';

interface ParkingTabProps {
  spaces: CurbsideSpace[];
}

const ParkingTab: React.FC<ParkingTabProps> = ({ spaces }) => {
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'long'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(true);

  const parkingSpaces = spaces.filter(space => space.type === 'parking');

  const filteredSpaces = parkingSpaces.filter(space => {
    const matchesSearch = space.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && space.price === 0) ||
                        (priceFilter === 'paid' && space.price > 0);
    const matchesDuration = durationFilter === 'all' ||
                           (durationFilter === 'short' && space.maxDuration <= 120) ||
                           (durationFilter === 'long' && space.maxDuration > 120);
    
    return matchesSearch && matchesPrice && matchesDuration;
  });

  const stats = {
    total: parkingSpaces.length,
    available: parkingSpaces.filter(s => s.status === 'available').length,
    withEV: parkingSpaces.filter(s => s.features.includes('EV Charging')).length,
    avgPrice: parkingSpaces.reduce((sum, s) => sum + s.price, 0) / parkingSpaces.length,
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported');
      const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
      setUserLocation(defaultLocation);
      setCurrentCity('New York (Default)');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);

        // Get city name from coordinates
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lng}&localityLanguage=en`
          );
          const data = await response.json();
          const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
          setCurrentCity(city);
        } catch (error) {
          console.error('Error getting city name:', error);
          setCurrentCity('Current Location');
        }

        setLocationLoading(false);
      },
      (error) => {
        console.log('Geolocation permission denied or failed:', error);
        // Fallback to default location
        const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
        setUserLocation(defaultLocation);
        setCurrentCity('New York (Default)');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  if (locationLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Parking Spaces</h2>
              <p className="text-gray-600">Find and book parking spaces across the city</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Your Location</h3>
            <p className="text-gray-600">Please allow location access to show nearby parking</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Car className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Parking Spaces</h2>
            <p className="text-gray-600">Find and book parking spaces in {currentCity}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search parking locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Durations</option>
            <option value="short">Short-term (≤2h)</option>
            <option value="long">Long-term (&gt;2h)</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spaces</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Now</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.available}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With EV Charging</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.withEV}</p>
            </div>
            <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">${stats.avgPrice.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Parking Map</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live Updates</span>
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Navigation className="h-4 w-4" />
                <span>Navigate</span>
              </button>
            </div>
          </div>
          
          <div className="h-96">
            <GoogleMapComponent
              spaces={filteredSpaces}
              onSpaceSelect={setSelectedSpace}
              selectedSpace={selectedSpace}
              filterType="parking"
              showRouting={true}
            />
          </div>
        </div>

        {/* Space Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Space Details</h3>
          {selectedSpace ? (
            <SpaceCard space={selectedSpace} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Select a parking space to view details</p>
              <p className="text-sm text-gray-400">
                {filteredSpaces.length} spaces available
              </p>
              {currentCity && (
                <p className="text-sm text-blue-600 mt-2">
                  Near {currentCity}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Parking Data Info */}
      <ParkingDataInfo />

      {/* Real-time Availability List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpaces.slice(0, 6).map((space) => (
            <div
              key={space.id}
              onClick={() => setSelectedSpace(space)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{space.location}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    space.status === 'available' ? 'bg-green-500 animate-pulse' :
                    space.status === 'occupied' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    space.status === 'available' ? 'text-green-600' :
                    space.status === 'occupied' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {space.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{space.address}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Max: {space.maxDuration} min</span>
                <span className="text-blue-600 font-medium">
                  {space.price === 0 ? 'Free' : `$${space.price}/hour`}
                </span>
              </div>
              {space.features.includes('EV Charging') && (
                <div className="mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    ⚡ EV Charging
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Car className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Find Nearest Parking</p>
              <p className="text-sm text-blue-700">Locate closest available space</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <div className="h-6 w-6 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-green-900">EV Charging Spots</p>
              <p className="text-sm text-green-700">Find electric vehicle charging</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <Clock className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Reserve in Advance</p>
              <p className="text-sm text-purple-700">Book for future dates</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingTab;