import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Filter, Search, Car, Truck, Bike, GraduationCap, Trash2, Package, Loader2, Maximize, Minimize } from 'lucide-react';
import { CurbsideSpace } from '../types';
import SpaceCard from './SpaceCard';
import GoogleMapComponent from './maps/GoogleMapComponent';

interface SpaceMapProps {
  spaces: CurbsideSpace[];
  onSpaceSelect: (space: CurbsideSpace) => void;
}

const SpaceMap: React.FC<SpaceMapProps> = ({ spaces, onSpaceSelect }) => {
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

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

  const filteredSpaces = spaces.filter(space => {
    const matchesType = filterType === 'all' || space.type === filterType;
    const matchesStatus = filterStatus === 'all' || space.status === filterStatus;
    const matchesSearch = space.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const spaceTypeOptions = [
    { value: 'all', label: 'All Types', icon: MapPin },
    { value: 'parking', label: 'Parking', icon: Car },
    { value: 'last_mile_delivery', label: 'Last-Mile Delivery', icon: Package },
    { value: 'school_dropoff', label: 'School Drop-off', icon: GraduationCap },
    { value: 'cycling', label: 'Cycling', icon: Bike },
    { value: 'trash_collection', label: 'Waste Collection', icon: Trash2 },
    { value: 'loading', label: 'Loading', icon: Truck },
    { value: 'pickup', label: 'Pickup', icon: Car },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  const getSpaceStats = () => {
    const total = filteredSpaces.length;
    const available = filteredSpaces.filter(s => s.status === 'available').length;
    const occupied = filteredSpaces.filter(s => s.status === 'occupied').length;
    const scheduled = filteredSpaces.filter(s => s.status === 'scheduled').length;
    
    return { total, available, occupied, scheduled };
  };

  const stats = getSpaceStats();

  const handleSpaceSelect = (space: CurbsideSpace) => {
    setSelectedSpace(space);
    onSpaceSelect(space);
  };

  const toggleMapExpand = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  if (locationLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Urban Space Management Map</h2>
        </div>
        
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Your Location</h3>
            <p className="text-gray-600">Please allow location access to show nearby spaces</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMapExpanded ? 'fixed inset-0 z-50 bg-black bg-opacity-90 p-6 overflow-auto' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900">Urban Space Management Map</h2>
          {currentCity && (
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">{currentCity}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {spaceTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={toggleMapExpand}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isMapExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            <span>{isMapExpanded ? 'Exit Fullscreen' : 'Expand Map'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats - Hide in expanded mode */}
      {!isMapExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spaces</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isMapExpanded ? '' : 'lg:grid-cols-3'} gap-6`}>
        {/* Map Area */}
        <div className={`${isMapExpanded ? '' : 'lg:col-span-2'} bg-white rounded-xl shadow-sm border border-gray-200 p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Map View</h3>
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </button>
          </div>
          
          <div className={isMapExpanded ? 'h-[calc(100vh-200px)]' : 'h-96'}>
            <GoogleMapComponent
              spaces={filteredSpaces}
              onSpaceSelect={handleSpaceSelect}
              selectedSpace={selectedSpace}
              filterType={filterType}
              showRouting={true}
            />
          </div>
        </div>

        {/* Space Details - Hide in expanded mode if no space is selected */}
        {(!isMapExpanded || (isMapExpanded && selectedSpace)) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Space Details</h3>
            {selectedSpace ? (
              <SpaceCard space={selectedSpace} />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Select a space on the map to view details</p>
                <p className="text-sm text-gray-400">
                  {filteredSpaces.length} spaces match your current filters
                </p>
                {currentCity && (
                  <p className="text-sm text-blue-600 mt-2">
                    Showing spaces near {currentCity}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Close button for expanded mode */}
      {isMapExpanded && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={toggleMapExpand}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Exit Fullscreen
          </button>
        </div>
      )}
    </div>
  );
};

export default SpaceMap;