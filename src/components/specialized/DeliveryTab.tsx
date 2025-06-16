import React, { useState } from 'react';
import { Package, Truck, Clock, MapPin, Navigation, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { CurbsideSpace } from '../../types';
import SpaceCard from '../SpaceCard';
import GoogleMapComponent from '../maps/GoogleMapComponent';

interface DeliveryTabProps {
  spaces: CurbsideSpace[];
}

const DeliveryTab: React.FC<DeliveryTabProps> = ({ spaces }) => {
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [deliveryType, setDeliveryType] = useState<'all' | 'last_mile' | 'commercial' | 'food'>('all');
  const [timeSlot, setTimeSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  const deliverySpaces = spaces.filter(space => 
    space.type === 'last_mile_delivery' || space.type === 'loading'
  );

  const filteredSpaces = deliverySpaces.filter(space => {
    // Add filtering logic based on delivery type and time slot
    return true;
  });

  const stats = {
    totalZones: deliverySpaces.length,
    activeDeliveries: deliverySpaces.filter(s => s.status === 'occupied').length,
    avgDeliveryTime: 12.5,
    efficiency: 87,
  };

  const deliveryProviders = [
    {
      name: 'Amazon Logistics',
      vehicles: 15,
      deliveries: 142,
      avgTime: 8.5,
      efficiency: 92,
      status: 'active',
      currentZones: ['Zone A', 'Zone C', 'Zone F']
    },
    {
      name: 'UPS',
      vehicles: 12,
      deliveries: 98,
      avgTime: 11.2,
      efficiency: 89,
      status: 'active',
      currentZones: ['Zone B', 'Zone D']
    },
    {
      name: 'FedEx',
      vehicles: 8,
      deliveries: 76,
      avgTime: 9.8,
      efficiency: 91,
      status: 'active',
      currentZones: ['Zone E', 'Zone G']
    },
    {
      name: 'DHL',
      vehicles: 6,
      deliveries: 54,
      avgTime: 13.1,
      efficiency: 85,
      status: 'active',
      currentZones: ['Zone H']
    },
  ];

  const timeSlots = [
    {
      time: '6:00 - 9:00 AM',
      type: 'Early Morning',
      utilization: 45,
      avgWait: 3.2,
      zones: 8,
      activeDeliveries: 12
    },
    {
      time: '9:00 - 12:00 PM',
      type: 'Morning Peak',
      utilization: 85,
      avgWait: 8.5,
      zones: 12,
      activeDeliveries: 28
    },
    {
      time: '12:00 - 3:00 PM',
      type: 'Afternoon',
      utilization: 92,
      avgWait: 12.1,
      zones: 15,
      activeDeliveries: 35
    },
    {
      time: '3:00 - 6:00 PM',
      type: 'Evening Peak',
      utilization: 78,
      avgWait: 6.8,
      zones: 11,
      activeDeliveries: 22
    },
    {
      time: '6:00 - 9:00 PM',
      type: 'Evening',
      utilization: 35,
      avgWait: 2.1,
      zones: 6,
      activeDeliveries: 8
    },
  ];

  const deliveryTypes = [
    {
      type: 'Last-Mile Delivery',
      description: 'Final delivery to customers',
      zones: 8,
      avgTime: 15,
      icon: Package,
      color: 'blue',
      activeNow: 24
    },
    {
      type: 'Commercial Loading',
      description: 'Business-to-business deliveries',
      zones: 4,
      avgTime: 25,
      icon: Truck,
      color: 'green',
      activeNow: 12
    },
    {
      type: 'Food Delivery',
      description: 'Restaurant and grocery deliveries',
      zones: 6,
      avgTime: 8,
      icon: Package,
      color: 'orange',
      activeNow: 18
    },
    {
      type: 'Express Delivery',
      description: 'Priority and same-day deliveries',
      zones: 3,
      avgTime: 5,
      icon: TrendingUp,
      color: 'purple',
      activeNow: 6
    },
  ];

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-100';
    if (utilization >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getTypeColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'green': return 'bg-green-50 border-green-200 text-green-900';
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Delivery Zone Management</h2>
            <p className="text-gray-600">Last-mile delivery and loading zone optimization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Delivery Types</option>
            <option value="last_mile">Last-Mile</option>
            <option value="commercial">Commercial</option>
            <option value="food">Food Delivery</option>
          </select>
          
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time Slots</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivery Zones</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalZones}</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeDeliveries}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            </div>
            <Truck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Delivery Time</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.avgDeliveryTime}m</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficiency</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.efficiency}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Delivery Zone Map</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium">Live Tracking</span>
            </div>
          </div>
          
          <div className="h-96">
            <GoogleMapComponent
              spaces={filteredSpaces}
              onSpaceSelect={setSelectedSpace}
              selectedSpace={selectedSpace}
              filterType="last_mile_delivery"
              showRouting={true}
            />
          </div>
        </div>

        {/* Space Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Zone Details</h3>
          {selectedSpace ? (
            <SpaceCard space={selectedSpace} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Select a delivery zone to view details</p>
              <p className="text-sm text-gray-400">
                {filteredSpaces.length} delivery zones available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Delivery Types */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Delivery Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deliveryTypes.map((type, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getTypeColor(type.color)}`}>
              <div className="flex items-center justify-between mb-2">
                <type.icon className="h-6 w-6" />
                <div className="text-right">
                  <span className="text-sm font-medium">{type.zones} zones</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">{type.activeNow} active</span>
                  </div>
                </div>
              </div>
              <h4 className="font-medium mb-1">{type.type}</h4>
              <p className="text-sm mb-2">{type.description}</p>
              <p className="text-sm font-medium">Avg. time: {type.avgTime} min</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Time Slot Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Time Slot Utilization</h3>
        <div className="space-y-4">
          {timeSlots.map((slot, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{slot.time}</h4>
                  <p className="text-sm text-gray-600">{slot.type}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600">{slot.activeDeliveries} active</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(slot.utilization)}`}>
                    {slot.utilization}% utilized
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Active zones:</span>
                  <p className="font-medium text-gray-900">{slot.zones}</p>
                </div>
                <div>
                  <span className="text-gray-500">Avg. wait:</span>
                  <p className="font-medium text-gray-900">{slot.avgWait} min</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${slot.utilization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Delivery Providers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Delivery Providers</h3>
        <div className="space-y-4">
          {deliveryProviders.map((provider, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{provider.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{provider.vehicles} vehicles active</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live tracking</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Active in: {provider.currentZones.join(', ')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">{provider.deliveries}</p>
                  <p className="text-gray-500">Deliveries</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{provider.avgTime} min</p>
                  <p className="text-gray-500">Avg. Time</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{provider.efficiency}%</p>
                  <p className="text-gray-500">Efficiency</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Delivery Zones List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Delivery Zones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpaces.map((space) => (
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
                    space.status === 'scheduled' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    space.status === 'available' ? 'text-green-600' :
                    space.status === 'occupied' ? 'text-red-600' :
                    space.status === 'scheduled' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {space.status}
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
              {space.features.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {space.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <MapPin className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Find Delivery Zone</p>
              <p className="text-sm text-blue-700">Locate nearest zone</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <Clock className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Schedule Delivery</p>
              <p className="text-sm text-green-700">Book time slot</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <Navigation className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Route Optimization</p>
              <p className="text-sm text-purple-700">Optimize delivery routes</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <div className="text-left">
              <p className="font-medium text-orange-900">Report Issue</p>
              <p className="text-sm text-orange-700">Delivery problems</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTab;