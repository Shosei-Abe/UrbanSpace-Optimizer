import React, { useState } from 'react';
import { Bike, MapPin, Shield, Zap, Clock, Users, Wrench, Navigation, Battery } from 'lucide-react';
import { CurbsideSpace } from '../../types';
import SpaceCard from '../SpaceCard';
import GoogleMapComponent from '../maps/GoogleMapComponent';

interface CyclingTabProps {
  spaces: CurbsideSpace[];
}

const CyclingTab: React.FC<CyclingTabProps> = ({ spaces }) => {
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [bikeType, setBikeType] = useState<'all' | 'regular' | 'electric'>('all');
  const [facilityType, setFacilityType] = useState<'all' | 'parking' | 'charging' | 'repair'>('all');

  const cyclingSpaces = spaces.filter(space => space.type === 'cycling');

  const filteredSpaces = cyclingSpaces.filter(space => {
    // Add filtering logic based on bike type and facility type
    return true;
  });

  const stats = {
    total: cyclingSpaces.length,
    available: cyclingSpaces.filter(s => s.status === 'available').length,
    capacity: cyclingSpaces.reduce((sum, s) => sum + (s.capacity || 1), 0),
    chargingStations: cyclingSpaces.filter(s => s.features.includes('Charging Stations')).length,
  };

  const bikeShareStations = [
    {
      name: 'Metro Station Hub',
      location: 'Transit Plaza',
      available: 15,
      total: 20,
      type: 'Standard',
      status: 'active',
      realTimeData: {
        lastUpdated: new Date(),
        batteryLevels: [85, 92, 78, 88, 95],
        maintenanceNeeded: 2
      }
    },
    {
      name: 'University Campus',
      location: 'College Green',
      available: 8,
      total: 15,
      type: 'Electric',
      status: 'active',
      realTimeData: {
        lastUpdated: new Date(),
        batteryLevels: [45, 67, 89, 92, 78, 85, 91],
        maintenanceNeeded: 1
      }
    },
    {
      name: 'Downtown Central',
      location: 'Business District',
      available: 12,
      total: 18,
      type: 'Mixed',
      status: 'active',
      realTimeData: {
        lastUpdated: new Date(),
        batteryLevels: [88, 76, 92, 85, 79, 91, 87, 83, 90, 77, 85, 89],
        maintenanceNeeded: 0
      }
    },
  ];

  const cyclingRoutes = [
    {
      name: 'Waterfront Trail',
      distance: '5.2 km',
      difficulty: 'Easy',
      type: 'Recreational',
      features: ['Scenic Views', 'Protected Lane', 'Rest Areas'],
      realTimeConditions: {
        congestion: 'Low',
        weather: 'Clear',
        maintenance: 'Good'
      }
    },
    {
      name: 'University Connector',
      distance: '3.8 km',
      difficulty: 'Medium',
      type: 'Commuter',
      features: ['Bike Signals', 'Dedicated Lane', 'Bike Parking'],
      realTimeConditions: {
        congestion: 'Medium',
        weather: 'Clear',
        maintenance: 'Good'
      }
    },
    {
      name: 'Business District Loop',
      distance: '2.1 km',
      difficulty: 'Easy',
      type: 'Urban',
      features: ['Protected Intersection', 'Bike Share', 'Repair Stations'],
      realTimeConditions: {
        congestion: 'High',
        weather: 'Clear',
        maintenance: 'Fair'
      }
    },
  ];

  const safetyFeatures = [
    {
      title: 'Protected Bike Lanes',
      description: 'Physical barriers separating cyclists from traffic',
      icon: Shield,
      coverage: '85%'
    },
    {
      title: 'Bike Traffic Signals',
      description: 'Dedicated traffic lights for cyclists',
      icon: Navigation,
      coverage: '70%'
    },
    {
      title: 'Security Cameras',
      description: '24/7 monitoring of bike parking areas',
      icon: Shield,
      coverage: '95%'
    },
    {
      title: 'Emergency Call Boxes',
      description: 'Emergency assistance along major routes',
      icon: Shield,
      coverage: '60%'
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'text-blue-600 bg-blue-100';
      case 'Electric': return 'text-green-600 bg-green-100';
      case 'Mixed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCongestionColor = (congestion: string) => {
    switch (congestion) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bike className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cycling Infrastructure</h2>
            <p className="text-gray-600">Bike parking, routes, and cycling facilities</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={bikeType}
            onChange={(e) => setBikeType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Bike Types</option>
            <option value="regular">Regular Bikes</option>
            <option value="electric">Electric Bikes</option>
          </select>
          
          <select
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Facilities</option>
            <option value="parking">Bike Parking</option>
            <option value="charging">Charging Stations</option>
            <option value="repair">Repair Stations</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bike Facilities</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.total}</p>
            </div>
            <Bike className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Spots</p>
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
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.capacity}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Charging Stations</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.chargingStations}</p>
            </div>
            <Zap className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Cycling Map</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Live Updates</span>
            </div>
          </div>
          
          <div className="h-96">
            <GoogleMapComponent
              spaces={filteredSpaces}
              onSpaceSelect={setSelectedSpace}
              selectedSpace={selectedSpace}
              filterType="cycling"
              showRouting={true}
            />
          </div>
        </div>

        {/* Space Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Facility Details</h3>
          {selectedSpace ? (
            <SpaceCard space={selectedSpace} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Bike className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Select a cycling facility to view details</p>
              <p className="text-sm text-gray-400">
                {filteredSpaces.length} cycling facilities available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Bike Share Stations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Bike Share Stations</h3>
        <div className="space-y-4">
          {bikeShareStations.map((station, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bike className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">{station.name}</h4>
                  <p className="text-sm text-green-700">{station.location}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">
                      Updated: {station.realTimeData.lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(station.type)}`}>
                    {station.type}
                  </span>
                  {station.realTimeData.maintenanceNeeded > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      {station.realTimeData.maintenanceNeeded} need maintenance
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-900">
                    {station.available}/{station.total} available
                  </p>
                  <div className="w-16 bg-green-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(station.available / station.total) * 100}%` }}
                    ></div>
                  </div>
                  {station.type === 'Electric' || station.type === 'Mixed' && (
                    <p className="text-xs text-green-600 mt-1">
                      Avg. battery: {Math.round(station.realTimeData.batteryLevels.reduce((a, b) => a + b, 0) / station.realTimeData.batteryLevels.length)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Cycling Routes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Cycling Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cyclingRoutes.map((route, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{route.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                  {route.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{route.distance}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {route.type}
                </span>
              </div>
              
              {/* Real-time Conditions */}
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Current Conditions</h5>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <span className={`px-1 py-0.5 rounded text-xs ${getCongestionColor(route.realTimeConditions.congestion)}`}>
                      {route.realTimeConditions.congestion}
                    </span>
                    <p className="text-gray-500 mt-1">Traffic</p>
                  </div>
                  <div className="text-center">
                    <span className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      {route.realTimeConditions.weather}
                    </span>
                    <p className="text-gray-500 mt-1">Weather</p>
                  </div>
                  <div className="text-center">
                    <span className="px-1 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                      {route.realTimeConditions.maintenance}
                    </span>
                    <p className="text-gray-500 mt-1">Condition</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                {route.features.map((feature, featureIndex) => (
                  <span key={featureIndex} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs mr-1 mb-1">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Cycling Facilities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Cycling Facilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              onClick={() => setSelectedSpace(space)}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{space.location}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    space.status === 'available' ? 'bg-green-500 animate-pulse' :
                    space.status === 'occupied' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    space.status === 'available' ? 'text-green-600' :
                    space.status === 'occupied' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {space.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{space.address}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Capacity: {space.capacity || 1}</span>
                <span className="text-green-600 font-medium">
                  {space.price === 0 ? 'Free' : `$${space.price}/hour`}
                </span>
              </div>
              {space.features.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {space.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {space.features.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{space.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Updated: {space.lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycling Safety Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <feature.icon className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{feature.coverage}</span>
              </div>
              <h4 className="font-medium text-blue-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-blue-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <Bike className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Find Bike Parking</p>
              <p className="text-sm text-green-700">Locate nearest bike racks</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Battery className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">E-Bike Charging</p>
              <p className="text-sm text-blue-700">Find charging stations</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <Wrench className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Repair Stations</p>
              <p className="text-sm text-purple-700">Find bike repair tools</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CyclingTab;