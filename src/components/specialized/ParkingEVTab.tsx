import React, { useState, useEffect } from 'react';
import { Zap, Search, MapPin, Clock, DollarSign, Navigation, Battery, Car, Gauge, Power, Plug, AlertCircle } from 'lucide-react';
import { CurbsideSpace } from '../../types';
import GoogleMapComponent from '../maps/GoogleMapComponent';
import SpaceCard from '../SpaceCard';
import EVDashboard from '../ev/EVDashboard';
import { getUserEVData, getNearbyEVChargers, EnodeUser, EnodeCharger } from '../../lib/enode';

interface ParkingEVTabProps {
  spaces: CurbsideSpace[];
}

const ParkingEVTab: React.FC<ParkingEVTabProps> = ({ spaces }) => {
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<EnodeCharger | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chargerType, setChargerType] = useState<'all' | 'fast' | 'standard'>('all');
  const [availability, setAvailability] = useState<'all' | 'available' | 'occupied'>('all');
  const [activeView, setActiveView] = useState<'parking' | 'dashboard'>('parking');
  const [evData, setEvData] = useState<EnodeUser | null>(null);
  const [nearbyEVChargers, setNearbyEVChargers] = useState<EnodeCharger[]>([]);
  const [loading, setLoading] = useState(false);

  const evParkingSpaces = spaces.filter(space => 
    space.type === 'parking' && space.features.includes('EV Charging')
  );

  const filteredSpaces = evParkingSpaces.filter(space => {
    const matchesSearch = space.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = availability === 'all' || space.status === availability;
    
    return matchesSearch && matchesAvailability;
  });

  const stats = {
    total: evParkingSpaces.length,
    available: evParkingSpaces.filter(s => s.status === 'available').length,
    fastChargers: evParkingSpaces.filter(s => s.features.includes('Fast Charging')).length,
    avgPrice: evParkingSpaces.reduce((sum, s) => sum + s.price, 0) / evParkingSpaces.length,
  };

  const chargingStations = [
    { name: 'Tesla Supercharger', type: 'DC Fast', power: '250kW', available: 8, total: 12, status: 'active' },
    { name: 'ChargePoint', type: 'Level 2', power: '7.2kW', available: 15, total: 20, status: 'active' },
    { name: 'Electrify America', type: 'DC Fast', power: '150kW', available: 4, total: 6, status: 'active' },
    { name: 'EVgo', type: 'DC Fast', power: '100kW', available: 6, total: 8, status: 'active' },
  ];

  useEffect(() => {
    loadEVData();
  }, []);

  const loadEVData = async () => {
    setLoading(true);
    try {
      const userData = await getUserEVData('demo-user-1');
      setEvData(userData);
      
      const chargers = await getNearbyEVChargers(40.7128, -74.0060, 5000);
      setNearbyEVChargers(chargers);
    } catch (error) {
      console.error('Error loading EV data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpaceSelect = (space: CurbsideSpace) => {
    setSelectedSpace(space);
    setSelectedCharger(null);
  };

  const handleChargerSelect = (charger: EnodeCharger) => {
    setSelectedCharger(charger);
    setSelectedSpace(null);
  };

  const getChargerStatusColor = (charger: EnodeCharger) => {
    if (!charger.status.isOnline) return 'text-gray-600 bg-gray-100';
    if (charger.status.isCharging) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getChargerStatusText = (charger: EnodeCharger) => {
    if (!charger.status.isOnline) return 'Offline';
    if (charger.status.isCharging) return 'Charging';
    return 'Available';
  };

  const renderChargerDetails = () => {
    if (!selectedCharger) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedCharger.displayName}</h3>
              <p className="text-sm text-gray-600">{selectedCharger.vendor} {selectedCharger.model}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getChargerStatusColor(selectedCharger)}`}>
            {getChargerStatusText(selectedCharger)}
          </span>
        </div>

        {/* Real-time Status */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-green-900 flex items-center space-x-2">
              <Power className="h-4 w-4" />
              <span>Real-time Status</span>
            </h4>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700 font-medium">Current Power:</span>
              <p className="text-green-900 text-lg font-bold">{selectedCharger.status.power} kW</p>
            </div>
            <div>
              <span className="text-green-700 font-medium">Energy Delivered:</span>
              <p className="text-green-900 text-lg font-bold">{selectedCharger.status.energy} kWh</p>
            </div>
            <div>
              <span className="text-green-700 font-medium">Connection:</span>
              <p className="text-green-900">{selectedCharger.status.isPluggedIn ? 'Connected' : 'Disconnected'}</p>
            </div>
            <div>
              <span className="text-green-700 font-medium">Last Updated:</span>
              <p className="text-green-900">{new Date(selectedCharger.status.lastUpdated).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Charger Capabilities */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <span>Charger Capabilities</span>
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Maximum Power</span>
              <span className="font-semibold text-gray-900">{selectedCharger.capabilities.maxPower} kW</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Smart Charging</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedCharger.capabilities.smartCharging ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedCharger.capabilities.smartCharging ? 'Supported' : 'Not Available'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Scheduling</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedCharger.capabilities.scheduling ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedCharger.capabilities.scheduling ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Connector Types */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Plug className="h-4 w-4" />
            <span>Connector Types</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedCharger.capabilities.connectorTypes.map((type, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Location Information */}
        {selectedCharger.location && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{selectedCharger.location.address || 'Address not available'}</p>
              <p className="text-sm text-gray-500 mt-1">
                Coordinates: {selectedCharger.location.latitude.toFixed(6)}, {selectedCharger.location.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* Charging Session Info */}
        {selectedCharger.status.isCharging && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
              <Battery className="h-4 w-4" />
              <span>Active Charging Session</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Session Duration:</span>
                <p className="text-blue-900">Ongoing</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Charging Rate:</span>
                <p className="text-blue-900">{selectedCharger.status.power} kW</p>
              </div>
            </div>
          </div>
        )}

        {/* User's Vehicle Info */}
        {evData && evData.vehicles.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Your Vehicles</span>
            </h4>
            <div className="space-y-3">
              {evData.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{vehicle.displayName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.isReachable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.isReachable ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  {vehicle.battery && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Battery:</span>
                        <p className="font-medium">{vehicle.battery.level}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Range:</span>
                        <p className="font-medium">{vehicle.battery.range} km</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className={`font-medium ${vehicle.battery.isCharging ? 'text-blue-600' : 'text-gray-900'}`}>
                          {vehicle.battery.isCharging ? 'Charging' : 'Ready'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Navigation className="h-4 w-4" />
            <span>Navigate to Charger</span>
          </button>
          
          {selectedCharger.status.isOnline && (
            <div className="grid grid-cols-2 gap-3">
              {!selectedCharger.status.isCharging ? (
                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Zap className="h-4 w-4" />
                  <span>Start Charging</span>
                </button>
              ) : (
                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <AlertCircle className="h-4 w-4" />
                  <span>Stop Charging</span>
                </button>
              )}
              <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">EV Parking & Charging</h2>
            <p className="text-gray-600">Electric vehicle parking with charging stations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('parking')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'parking'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Parking Map
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EV Dashboard
            </button>
          </div>

          {activeView === 'parking' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search EV charging locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={chargerType}
                onChange={(e) => setChargerType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Charger Types</option>
                <option value="fast">DC Fast Charging</option>
                <option value="standard">Level 2 Charging</option>
              </select>
              
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
            </>
          )}
        </div>
      </div>

      {activeView === 'dashboard' ? (
        <EVDashboard userId="demo-user-1" userLocation={{ lat: 40.7128, lng: -74.0060 }} />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">EV Parking Spots</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.total}</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Now</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.available}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600">Live</span>
                  </div>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fast Chargers</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.fastChargers}</p>
                </div>
                <Battery className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enode Chargers</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">{nearbyEVChargers.length}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-600">Live API</span>
                  </div>
                </div>
                <Power className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Real-time EV Charging Map</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Live Availability</span>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Navigation className="h-4 w-4" />
                    <span>Navigate to Charger</span>
                  </button>
                </div>
              </div>
              
              <div className="h-96">
                <GoogleMapComponent
                  spaces={filteredSpaces}
                  onSpaceSelect={handleSpaceSelect}
                  selectedSpace={selectedSpace}
                  filterType="parking-ev"
                  showEVChargers={true}
                  showRouting={true}
                />
              </div>
            </div>

            {/* Details Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCharger ? 'Charger Details' : selectedSpace ? 'Parking Details' : 'Select a Location'}
              </h3>
              
              {selectedCharger ? (
                renderChargerDetails()
              ) : selectedSpace ? (
                <SpaceCard space={selectedSpace} />
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Select a charging station to view details</p>
                  <p className="text-sm text-gray-400">
                    {filteredSpaces.length} EV charging spots available
                  </p>
                  <p className="text-sm text-gray-400">
                    {nearbyEVChargers.length} Enode chargers nearby
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Enode Chargers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Real-time Enode Chargers</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-600 font-medium">Live API Data</span>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-2 text-gray-600">Loading chargers...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyEVChargers.map((charger) => (
                  <div
                    key={charger.id}
                    onClick={() => handleChargerSelect(charger)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-emerald-300 ${
                      selectedCharger?.id === charger.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{charger.displayName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChargerStatusColor(charger)}`}>
                        {getChargerStatusText(charger)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{charger.vendor} {charger.model}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Max Power:</span>
                        <p className="font-medium">{charger.capabilities.maxPower} kW</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current:</span>
                        <p className="font-medium">{charger.status.power} kW</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Updated: {new Date(charger.status.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Charging Networks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Charging Networks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {chargingStations.map((station, index) => (
                <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-900">{station.name}</h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-700 mb-1">{station.type} • {station.power}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">
                      {station.available}/{station.total} available
                    </span>
                    <div className="w-16 bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(station.available / station.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParkingEVTab;