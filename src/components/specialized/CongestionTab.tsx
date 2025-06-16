import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Clock, MapPin, Navigation, BarChart3 } from 'lucide-react';
import { CurbsideSpace } from '../../types';
import GoogleMapComponent from '../maps/GoogleMapComponent';

interface CongestionTabProps {
  spaces: CurbsideSpace[];
}

const CongestionTab: React.FC<CongestionTabProps> = ({ spaces }) => {
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [timeFilter, setTimeFilter] = useState<'current' | 'peak' | 'off-peak'>('current');
  const [areaFilter, setAreaFilter] = useState<'all' | 'downtown' | 'residential' | 'commercial'>('all');

  const congestionData = [
    { area: 'Downtown Financial', level: 'High', percentage: 85, color: 'red' },
    { area: 'Shopping District', level: 'Medium', percentage: 65, color: 'yellow' },
    { area: 'Residential North', level: 'Low', percentage: 25, color: 'green' },
    { area: 'University Campus', level: 'High', percentage: 90, color: 'red' },
    { area: 'Medical Center', level: 'Medium', percentage: 55, color: 'yellow' },
  ];

  const trafficIncidents = [
    { location: 'Market St & 5th Ave', type: 'Construction', severity: 'High', eta: '2 hours' },
    { location: 'University Bridge', type: 'Accident', severity: 'Medium', eta: '45 minutes' },
    { location: 'Commerce Ave', type: 'Event Traffic', severity: 'Low', eta: '30 minutes' },
  ];

  const peakHours = [
    { time: '7:00-9:00 AM', congestion: 95, description: 'Morning Rush' },
    { time: '12:00-1:00 PM', congestion: 70, description: 'Lunch Hour' },
    { time: '5:00-7:00 PM', congestion: 90, description: 'Evening Rush' },
    { time: '8:00-10:00 PM', congestion: 45, description: 'Evening Activities' },
  ];

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Traffic & Congestion</h2>
            <p className="text-gray-600">Real-time traffic monitoring and congestion analysis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="current">Current Traffic</option>
            <option value="peak">Peak Hours</option>
            <option value="off-peak">Off-Peak Hours</option>
          </select>
          
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Areas</option>
            <option value="downtown">Downtown</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>

      {/* Traffic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Congestion</p>
              <p className="text-3xl font-bold text-red-600 mt-2">72%</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Speed</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">18 mph</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delay Time</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">+12 min</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Traffic Map</h3>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Navigation className="h-4 w-4" />
                <span>Avoid Traffic</span>
              </button>
            </div>
          </div>
          
          <div className="h-96">
            <GoogleMapComponent
              spaces={spaces}
              onSpaceSelect={setSelectedSpace}
              selectedSpace={selectedSpace}
              showTrafficLayer={true}
              showRouting={true}
            />
          </div>
        </div>

        {/* Congestion Levels */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Area Congestion Levels</h3>
          <div className="space-y-3">
            {congestionData.map((area, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{area.area}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCongestionColor(area.level)}`}>
                    {area.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{area.percentage}% congested</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        area.color === 'red' ? 'bg-red-500' : 
                        area.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${area.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Incidents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Traffic Incidents</h3>
        <div className="space-y-4">
          {trafficIncidents.map((incident, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{incident.location}</h4>
                  <p className="text-sm text-gray-600">{incident.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className="text-sm text-gray-600">ETA: {incident.eta}</span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {peakHours.map((hour, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-900">{hour.time}</h4>
                <BarChart3 className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-sm text-red-700 mb-2">{hour.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">{hour.congestion}% congested</span>
                <div className="w-16 bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${hour.congestion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Routing Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Routing Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Navigation className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Fastest Route</p>
              <p className="text-sm text-green-700">Avoid high-traffic areas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Time-Based Routing</p>
              <p className="text-sm text-blue-700">Optimize for departure time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <MapPin className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Alternative Routes</p>
              <p className="text-sm text-purple-700">Multiple path options</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongestionTab;