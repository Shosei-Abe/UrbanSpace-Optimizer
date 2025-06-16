import React from 'react';
import { TrendingUp, DollarSign, MapPin, Clock, Users, AlertTriangle, Car, Truck, Bike, GraduationCap, Trash2, Package } from 'lucide-react';
import { Analytics } from '../types';

interface DashboardProps {
  analytics: Analytics;
}

const Dashboard: React.FC<DashboardProps> = ({ analytics }) => {
  const stats = [
    {
      title: 'Total Spaces',
      value: analytics.totalSpaces,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+3 this week',
    },
    {
      title: 'Occupancy Rate',
      value: `${analytics.occupancyRate}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5% from last week',
    },
    {
      title: 'Revenue',
      value: `$${analytics.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+12% this month',
    },
    {
      title: 'Avg Utilization',
      value: `${analytics.avgUtilization}%`,
      icon: Clock,
      color: 'bg-purple-500',
      change: '+3% this week',
    },
  ];

  const getSpaceTypeIcon = (type: string) => {
    switch (type) {
      case 'parking': return Car;
      case 'last_mile_delivery': return Package;
      case 'school_dropoff': return GraduationCap;
      case 'cycling': return Bike;
      case 'trash_collection': return Trash2;
      case 'loading': return Truck;
      case 'pickup': return Car;
      default: return MapPin;
    }
  };

  const getSpaceTypeColor = (type: string) => {
    switch (type) {
      case 'parking': return 'bg-blue-100 text-blue-800';
      case 'last_mile_delivery': return 'bg-orange-100 text-orange-800';
      case 'school_dropoff': return 'bg-yellow-100 text-yellow-800';
      case 'cycling': return 'bg-emerald-100 text-emerald-800';
      case 'trash_collection': return 'bg-gray-100 text-gray-800';
      case 'loading': return 'bg-purple-100 text-purple-800';
      case 'pickup': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSpaceTypeName = (type: string) => {
    switch (type) {
      case 'last_mile_delivery': return 'Last-Mile Delivery';
      case 'school_dropoff': return 'School Drop-off';
      case 'trash_collection': return 'Waste Collection';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Urban Space Management Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Space Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Space Type Distribution</h3>
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.spaceTypeBreakdown.map((spaceType, index) => {
              const IconComponent = getSpaceTypeIcon(spaceType.type);
              return (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getSpaceTypeColor(spaceType.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{formatSpaceTypeName(spaceType.type)}</span>
                      <p className="text-sm text-gray-500">{spaceType.count} spaces</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{spaceType.utilization}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${spaceType.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Peak Usage Hours</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {hour.hour}:00 - {hour.hour + 1}:00
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${hour.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{hour.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Locations and Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Locations</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{location.location}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{location.bookings} bookings</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(location.bookings / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Space Type</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.revenueByType.map((revenue, index) => {
              const IconComponent = getSpaceTypeIcon(revenue.type);
              return (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getSpaceTypeColor(revenue.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-900">{formatSpaceTypeName(revenue.type)}</span>
                  </div>
                  <span className="text-lg font-semibold text-emerald-600">
                    ${revenue.revenue.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts & Notifications</h3>
          <AlertTriangle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">School Zone High Traffic</p>
              <p className="text-sm text-yellow-700">Elementary School Main showing 95% occupancy during drop-off hours</p>
              <p className="text-xs text-yellow-600 mt-1">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Delivery Peak Hours</p>
              <p className="text-sm text-blue-700">Last-mile delivery spaces showing increased demand in Business District</p>
              <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Trash2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Waste Collection Completed</p>
              <p className="text-sm text-green-700">Residential Block 1 waste collection completed ahead of schedule</p>
              <p className="text-xs text-green-600 mt-1">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;