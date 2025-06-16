import React, { useState } from 'react';
import { GraduationCap, Clock, Users, Shield, AlertTriangle, Calendar, MapPin, Car, Bus, Phone } from 'lucide-react';
import { CurbsideSpace } from '../../types';
import SpaceCard from '../SpaceCard';
import GoogleMapComponent from '../maps/GoogleMapComponent';

interface SchoolDropoffTabProps {
  spaces: CurbsideSpace[];
}

const SchoolDropoffTab: React.FC<SchoolDropoffTabProps> = ({ spaces }) => {
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [schoolFilter, setSchoolFilter] = useState<'all' | 'elementary' | 'middle' | 'high'>('all');

  const schoolSpaces = spaces.filter(space => space.type === 'school_dropoff');

  const filteredSpaces = schoolSpaces.filter(space => {
    // Add filtering logic based on time and school type
    return true;
  });

  const stats = {
    total: schoolSpaces.length,
    active: schoolSpaces.filter(s => s.status === 'available' || s.status === 'occupied').length,
    capacity: schoolSpaces.reduce((sum, s) => sum + (s.capacity || 1), 0),
    avgWaitTime: 3.5,
  };

  const schedules = [
    {
      school: 'Elementary School Main',
      morningDrop: '7:30 - 8:30 AM',
      afternoonPickup: '2:30 - 3:30 PM',
      capacity: 8,
      currentOccupancy: 5,
      status: 'active',
      dropoffLines: [
        { line: 'Line A', spaces: 3, occupied: 2, type: 'Parent Drop-off' },
        { line: 'Line B', spaces: 3, occupied: 1, type: 'Bus Loading' },
        { line: 'Line C', spaces: 2, occupied: 2, type: 'Staff Parking' }
      ]
    },
    {
      school: 'High School North',
      morningDrop: '7:00 - 8:00 AM',
      afternoonPickup: '3:00 - 4:00 PM',
      capacity: 12,
      currentOccupancy: 8,
      status: 'active',
      dropoffLines: [
        { line: 'Main Entrance', spaces: 6, occupied: 4, type: 'Student Drop-off' },
        { line: 'Bus Circle', spaces: 4, occupied: 3, type: 'Bus Loading' },
        { line: 'Side Entrance', spaces: 2, occupied: 1, type: 'Late Arrival' }
      ]
    },
    {
      school: 'Middle School Central',
      morningDrop: '8:00 - 8:45 AM',
      afternoonPickup: '3:15 - 4:00 PM',
      capacity: 10,
      currentOccupancy: 3,
      status: 'low',
      dropoffLines: [
        { line: 'Front Circle', spaces: 5, occupied: 2, type: 'Parent Drop-off' },
        { line: 'Bus Lane', spaces: 3, occupied: 1, type: 'Bus Loading' },
        { line: 'Emergency Lane', spaces: 2, occupied: 0, type: 'Emergency Only' }
      ]
    },
  ];

  const safetyFeatures = [
    {
      title: 'Crossing Guards',
      description: 'Trained personnel at all major intersections',
      icon: Shield,
      status: 'active'
    },
    {
      title: 'Speed Monitoring',
      description: 'Automated speed cameras in school zones',
      icon: AlertTriangle,
      status: 'active'
    },
    {
      title: 'Safe Walkways',
      description: 'Designated pedestrian paths to school entrances',
      icon: MapPin,
      status: 'active'
    },
    {
      title: 'Emergency Contact',
      description: '24/7 emergency response system',
      icon: Phone,
      status: 'active'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLineOccupancyColor = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Drop-off Management</h2>
            <p className="text-gray-600">Safe and efficient student transportation zones</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Times</option>
            <option value="morning">Morning Drop-off</option>
            <option value="afternoon">Afternoon Pickup</option>
          </select>
          
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Schools</option>
            <option value="elementary">Elementary</option>
            <option value="middle">Middle School</option>
            <option value="high">High School</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">School Zones</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Zones</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Avg. Wait Time</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.avgWaitTime}m</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">School Zone Map</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium">Live Updates</span>
            </div>
          </div>
          
          <div className="h-96">
            <GoogleMapComponent
              spaces={filteredSpaces}
              onSpaceSelect={setSelectedSpace}
              selectedSpace={selectedSpace}
              filterType="school_dropoff"
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
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Select a school zone to view details</p>
              <p className="text-sm text-gray-400">
                {filteredSpaces.length} school zones available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* School Drop-off Lines and Schedules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Drop-off Lines & Schedules</h3>
        <div className="space-y-6">
          {schedules.map((schedule, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{schedule.school}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Morning: {schedule.morningDrop}</span>
                      <span>Afternoon: {schedule.afternoonPickup}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {schedule.currentOccupancy}/{schedule.capacity} spaces
                    </p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(schedule.currentOccupancy / schedule.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status === 'active' ? 'Active' : schedule.status === 'low' ? 'Low Traffic' : 'High Traffic'}
                  </span>
                </div>
              </div>

              {/* Drop-off Lines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {schedule.dropoffLines.map((line, lineIndex) => (
                  <div key={lineIndex} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{line.line}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLineOccupancyColor(line.occupied, line.spaces)}`}>
                        {line.occupied}/{line.spaces}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{line.type}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (line.occupied / line.spaces) >= 0.9 ? 'bg-red-500' :
                          (line.occupied / line.spaces) >= 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(line.occupied / line.spaces) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Available: {line.spaces - line.occupied}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <feature.icon className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">{feature.title}</h4>
                <p className="text-sm text-green-700 mt-1">{feature.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Schedule Pickup</p>
              <p className="text-sm text-blue-700">Reserve a spot for pickup</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <Shield className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Safety Report</p>
              <p className="text-sm text-green-700">Report safety concerns</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <Phone className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Emergency Contact</p>
              <p className="text-sm text-purple-700">24/7 emergency line</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolDropoffTab;