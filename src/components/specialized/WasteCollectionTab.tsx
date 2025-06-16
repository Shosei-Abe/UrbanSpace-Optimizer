import React, { useState } from 'react';
import { Trash2, Calendar, Clock, Truck, MapPin, AlertTriangle, CheckCircle, Users, Recycle } from 'lucide-react';
import { CurbsideSpace } from '../../types';
import GoogleMapComponent from '../maps/GoogleMapComponent';

interface WasteCollectionTabProps {
  spaces: CurbsideSpace[];
}

const WasteCollectionTab: React.FC<WasteCollectionTabProps> = ({ spaces }) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [wasteType, setWasteType] = useState<'all' | 'general' | 'recycling' | 'organic'>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);

  const wasteSpaces = spaces.filter(space => space.type === 'trash_collection');

  const collectionRoutes = [
    {
      id: 'route-1',
      name: 'Residential North',
      area: 'North District',
      status: 'in_progress',
      progress: 65,
      estimatedCompletion: '2:30 PM',
      wasteTypes: ['General', 'Recycling'],
      vehiclesAssigned: 2,
      completedStops: 18,
      totalStops: 28,
      currentLocation: { lat: 40.7749, lng: -73.9857 },
      nextStop: 'Oak Street Block'
    },
    {
      id: 'route-2',
      name: 'Business District',
      area: 'Downtown',
      status: 'scheduled',
      progress: 0,
      estimatedCompletion: '4:00 PM',
      wasteTypes: ['General', 'Recycling', 'Organic'],
      vehiclesAssigned: 3,
      completedStops: 0,
      totalStops: 22,
      currentLocation: { lat: 40.7128, lng: -74.0060 },
      nextStop: 'Starting Depot'
    },
    {
      id: 'route-3',
      name: 'Residential South',
      area: 'South District',
      status: 'completed',
      progress: 100,
      estimatedCompletion: 'Completed',
      wasteTypes: ['General', 'Recycling'],
      vehiclesAssigned: 2,
      completedStops: 35,
      totalStops: 35,
      currentLocation: { lat: 40.7398, lng: -73.9903 },
      nextStop: 'Route Complete'
    },
  ];

  const wasteStats = {
    totalCollected: 24.5, // tons
    recyclingRate: 68,
    routesActive: 2,
    vehiclesDeployed: 7,
    completionRate: 92,
  };

  const scheduleData = [
    {
      day: 'Monday',
      routes: ['Residential North', 'Business District'],
      wasteTypes: ['General', 'Recycling'],
      vehicles: 5,
      status: 'active'
    },
    {
      day: 'Tuesday',
      routes: ['Residential South', 'Industrial Zone'],
      wasteTypes: ['General', 'Recycling'],
      vehicles: 4,
      status: 'scheduled'
    },
    {
      day: 'Wednesday',
      routes: ['Downtown Core', 'University Area'],
      wasteTypes: ['General', 'Organic'],
      vehicles: 6,
      status: 'scheduled'
    },
    {
      day: 'Thursday',
      routes: ['Residential East', 'Shopping District'],
      wasteTypes: ['General', 'Recycling'],
      vehicles: 5,
      status: 'scheduled'
    },
    {
      day: 'Friday',
      routes: ['Residential West', 'Medical District'],
      wasteTypes: ['General', 'Recycling', 'Medical'],
      vehicles: 4,
      status: 'scheduled'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'General': return 'bg-gray-100 text-gray-800';
      case 'Recycling': return 'bg-green-100 text-green-800';
      case 'Organic': return 'bg-brown-100 text-brown-800';
      case 'Medical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trash2 className="h-8 w-8 text-gray-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Waste Collection Management</h2>
            <p className="text-gray-600">Municipal waste collection scheduling and tracking</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Routes</option>
            <option value="route-1">Residential North</option>
            <option value="route-2">Business District</option>
            <option value="route-3">Residential South</option>
          </select>
          
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Waste Types</option>
            <option value="general">General Waste</option>
            <option value="recycling">Recycling</option>
            <option value="organic">Organic Waste</option>
          </select>
          
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Waste Collected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{wasteStats.totalCollected}t</p>
            </div>
            <Trash2 className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recycling Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{wasteStats.recyclingRate}%</p>
            </div>
            <Recycle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{wasteStats.routesActive}</p>
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
              <p className="text-sm font-medium text-gray-600">Vehicles</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{wasteStats.vehiclesDeployed}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{wasteStats.completionRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Collection Map</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 font-medium">Live Tracking</span>
            </div>
          </div>
          
          <div className="h-96">
            <GoogleMapComponent
              spaces={wasteSpaces}
              onSpaceSelect={setSelectedSpace}
              selectedSpace={selectedSpace}
              filterType="trash_collection"
              showRouting={true}
            />
          </div>
        </div>

        {/* Collection Points */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Points</h3>
          <div className="space-y-3">
            {wasteSpaces.map((space) => (
              <div 
                key={space.id} 
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => setSelectedSpace(space)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{space.location}</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      space.status === 'scheduled' ? 'bg-yellow-500 animate-pulse' :
                      space.status === 'available' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      space.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      space.status === 'available' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {space.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{space.address}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Capacity: {space.capacity || 1} truck(s)</span>
                  <span className="text-gray-500">
                    Updated: {space.lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
                {space.features.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {space.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Collection Routes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Collection Routes</h3>
        <div className="space-y-4">
          {collectionRoutes.map((route) => (
            <div key={route.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{route.name}</h4>
                    <p className="text-sm text-gray-600">{route.area}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        route.status === 'in_progress' ? 'bg-blue-500 animate-pulse' :
                        route.status === 'completed' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className="text-xs text-gray-500">
                        Next: {route.nextStop}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                    {route.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    ETA: {route.estimatedCompletion}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Progress:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          route.status === 'completed' ? 'bg-green-600' :
                          route.status === 'in_progress' ? 'bg-blue-600' :
                          'bg-yellow-600'
                        }`}
                        style={{ width: `${route.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-700 font-medium">{route.progress}%</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-500">Stops:</span>
                  <p className="font-medium text-gray-900 mt-1">
                    {route.completedStops}/{route.totalStops}
                  </p>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-500">Vehicles:</span>
                  <p className="font-medium text-gray-900 mt-1">{route.vehiclesAssigned}</p>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-500">Waste Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {route.wasteTypes.map((type, index) => (
                      <span key={index} className={`px-2 py-1 rounded text-xs font-medium ${getWasteTypeColor(type)}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {route.status === 'in_progress' && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Vehicle currently at: {route.nextStop}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Collection Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {scheduleData.map((day, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{day.day}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    day.status === 'active' ? 'bg-green-500 animate-pulse' :
                    'bg-gray-400'
                  }`}></div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(day.status)}`}>
                    {day.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{day.vehicles} vehicles</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Routes: {day.routes.join(', ')}
              </div>
              <div className="flex flex-wrap gap-1">
                {day.wasteTypes.map((type, typeIndex) => (
                  <span key={typeIndex} className={`px-2 py-1 rounded text-xs font-medium ${getWasteTypeColor(type)}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Schedule Collection</p>
              <p className="text-sm text-blue-700">Plan new routes</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <Truck className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Track Vehicles</p>
              <p className="text-sm text-green-700">Real-time tracking</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div className="text-left">
              <p className="font-medium text-yellow-900">Report Issue</p>
              <p className="text-sm text-yellow-700">Collection problems</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <Recycle className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Recycling Stats</p>
              <p className="text-sm text-purple-700">View analytics</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteCollectionTab;