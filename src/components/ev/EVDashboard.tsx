import React, { useState, useEffect } from 'react';
import { Battery, Zap, MapPin, Clock, Car, TrendingUp, AlertCircle, Play, Square, Target } from 'lucide-react';
import { getUserEVData, getNearbyEVChargers, controlCharging, EnodeUser, EnodeCharger } from '../../lib/enode';

interface EVDashboardProps {
  userId?: string;
  userLocation?: { lat: number; lng: number };
}

const EVDashboard: React.FC<EVDashboardProps> = ({ 
  userId = 'demo-user-1',
  userLocation = { lat: 40.7128, lng: -74.0060 }
}) => {
  const [userData, setUserData] = useState<EnodeUser | null>(null);
  const [nearbyChargers, setNearbyChargers] = useState<EnodeCharger[]>([]);
  const [loading, setLoading] = useState(true);
  const [chargingAction, setChargingAction] = useState<string | null>(null);

  useEffect(() => {
    loadEVData();
    loadNearbyChargers();
  }, [userId, userLocation]);

  const loadEVData = async () => {
    try {
      const data = await getUserEVData(userId);
      setUserData(data);
    } catch (error) {
      console.error('Error loading EV data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyChargers = async () => {
    try {
      const chargers = await getNearbyEVChargers(userLocation.lat, userLocation.lng, 5000);
      setNearbyChargers(chargers);
    } catch (error) {
      console.error('Error loading nearby chargers:', error);
    }
  };

  const handleChargingControl = async (chargerId: string, action: 'start' | 'stop', targetLevel?: number) => {
    setChargingAction(chargerId);
    try {
      const success = await controlCharging(chargerId, action, targetLevel);
      if (success) {
        // Refresh data after successful action
        await loadEVData();
        await loadNearbyChargers();
      }
    } catch (error) {
      console.error('Error controlling charging:', error);
    } finally {
      setChargingAction(null);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-600 bg-green-100';
    if (level > 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getChargerStatusColor = (charger: EnodeCharger) => {
    if (!charger.status.isOnline) return 'text-gray-600 bg-gray-100';
    if (charger.status.isCharging) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EV data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Unable to load EV data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">EV Dashboard</h2>
          <p className="text-gray-600">Monitor your electric vehicles and charging stations</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live Data</span>
        </div>
      </div>

      {/* Vehicle Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData.vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Car className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.displayName}</h3>
                  <p className="text-sm text-gray-600">{vehicle.vendor} {vehicle.model} ({vehicle.year})</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                vehicle.isReachable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {vehicle.isReachable ? 'Online' : 'Offline'}
              </div>
            </div>

            {vehicle.battery && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Battery Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatteryColor(vehicle.battery.level)}`}>
                    {vehicle.battery.level}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      vehicle.battery.level > 60 ? 'bg-green-500' :
                      vehicle.battery.level > 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${vehicle.battery.level}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Range:</span>
                    <p className="font-medium text-gray-900">{vehicle.battery.range} km</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className={`font-medium ${
                      vehicle.battery.isCharging ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {vehicle.battery.isCharging ? 'Charging' : 
                       vehicle.battery.isPluggedIn ? 'Plugged In' : 'Not Connected'}
                    </p>
                  </div>
                </div>

                {vehicle.charging?.isCharging && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Currently Charging</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-700">Rate:</span>
                        <p className="font-medium text-blue-900">{vehicle.charging.chargingRate} kW</p>
                      </div>
                      {vehicle.charging.timeToComplete && (
                        <div>
                          <span className="text-blue-700">Time left:</span>
                          <p className="font-medium text-blue-900">{vehicle.charging.timeToComplete} min</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {vehicle.location && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Last seen: {new Date(vehicle.location.lastUpdated).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Chargers */}
      {userData.chargers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Chargers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.chargers.map((charger) => (
              <div key={charger.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{charger.displayName}</h4>
                    <p className="text-sm text-gray-600">{charger.vendor} {charger.model}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChargerStatusColor(charger)}`}>
                    {!charger.status.isOnline ? 'Offline' :
                     charger.status.isCharging ? 'Charging' : 'Available'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Power:</span>
                    <span className="font-medium">{charger.status.power} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Power:</span>
                    <span className="font-medium">{charger.capabilities.maxPower} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Energy:</span>
                    <span className="font-medium">{charger.status.energy} kWh</span>
                  </div>
                </div>

                {charger.status.isOnline && (
                  <div className="mt-4 flex space-x-2">
                    {!charger.status.isCharging ? (
                      <button
                        onClick={() => handleChargingControl(charger.id, 'start', 80)}
                        disabled={chargingAction === charger.id}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChargingControl(charger.id, 'stop')}
                        disabled={chargingAction === charger.id}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <Square className="h-4 w-4" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Chargers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Public Chargers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyChargers.map((charger) => (
            <div key={charger.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{charger.displayName}</h4>
                  <p className="text-sm text-gray-600">{charger.vendor} {charger.model}</p>
                  {charger.location?.address && (
                    <p className="text-xs text-gray-500 mt-1">{charger.location.address}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChargerStatusColor(charger)}`}>
                  {!charger.status.isOnline ? 'Offline' :
                   charger.status.isCharging ? 'In Use' : 'Available'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Max Power:</span>
                  <span className="font-medium">{charger.capabilities.maxPower} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Connectors:</span>
                  <span className="font-medium">{charger.capabilities.connectorTypes.join(', ')}</span>
                </div>
                {charger.status.isCharging && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Power:</span>
                    <span className="font-medium text-blue-600">{charger.status.power} kW</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EV Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{userData.vehicles.length}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Battery</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {Math.round(userData.vehicles.reduce((sum, v) => sum + (v.battery?.level || 0), 0) / userData.vehicles.length)}%
              </p>
            </div>
            <Battery className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Charging Now</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {userData.vehicles.filter(v => v.battery?.isCharging).length}
              </p>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nearby Chargers</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{nearbyChargers.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EVDashboard;