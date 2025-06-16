import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Car, Calendar, Phone, Truck, Bike, GraduationCap, Trash2, Package, AlertTriangle, Users } from 'lucide-react';
import { CurbsideSpace } from '../types';

interface SpaceCardProps {
  space: CurbsideSpace;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDuration, setBookingDuration] = useState(60);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'parking': return 'bg-blue-100 text-blue-800';
      case 'loading': return 'bg-purple-100 text-purple-800';
      case 'pickup': return 'bg-green-100 text-green-800';
      case 'delivery': return 'bg-orange-100 text-orange-800';
      case 'last_mile_delivery': return 'bg-orange-100 text-orange-800';
      case 'school_dropoff': return 'bg-yellow-100 text-yellow-800';
      case 'cycling': return 'bg-emerald-100 text-emerald-800';
      case 'trash_collection': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'parking': return <Car className="h-4 w-4" />;
      case 'loading': return <Truck className="h-4 w-4" />;
      case 'pickup': return <Car className="h-4 w-4" />;
      case 'delivery': return <Package className="h-4 w-4" />;
      case 'last_mile_delivery': return <Package className="h-4 w-4" />;
      case 'school_dropoff': return <GraduationCap className="h-4 w-4" />;
      case 'cycling': return <Bike className="h-4 w-4" />;
      case 'trash_collection': return <Trash2 className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'last_mile_delivery': return 'Last-Mile Delivery';
      case 'school_dropoff': return 'School Drop-off';
      case 'trash_collection': return 'Waste Collection';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const handleBooking = () => {
    const cost = space.price === 0 ? 0 : (bookingDuration / 60) * space.price;
    alert(`Booking confirmed for ${bookingDuration} minutes at $${cost.toFixed(2)}`);
    setShowBookingForm(false);
  };

  const isBookingAllowed = () => {
    return space.status === 'available' && space.type !== 'trash_collection';
  };

  const getAvailableDurations = () => {
    const maxDuration = space.maxDuration;
    const durations = [];
    
    if (maxDuration >= 15) durations.push({ value: 15, label: '15 minutes' });
    if (maxDuration >= 30) durations.push({ value: 30, label: '30 minutes' });
    if (maxDuration >= 60) durations.push({ value: 60, label: '1 hour' });
    if (maxDuration >= 120) durations.push({ value: 120, label: '2 hours' });
    if (maxDuration >= 240) durations.push({ value: 240, label: '4 hours' });
    if (maxDuration >= 480) durations.push({ value: 480, label: '8 hours' });
    
    return durations;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{space.location}</h3>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {space.address}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(space.status)}`}>
              {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getTypeColor(space.type)}`}>
              {getTypeIcon(space.type)}
              <span>{getTypeDisplayName(space.type)}</span>
            </span>
            {space.priority && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(space.priority)}`}>
                {space.priority.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>{space.price === 0 ? 'Free' : `$${space.price}/hour`}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{space.maxDuration} min max</span>
          </div>
          {space.capacity && space.capacity > 1 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Capacity: {space.capacity}</span>
            </div>
          )}
          {space.vehicleTypes && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Car className="h-4 w-4" />
              <span>{space.vehicleTypes.length} vehicle types</span>
            </div>
          )}
        </div>

        {space.features.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
            <div className="flex flex-wrap gap-2">
              {space.features.map((feature, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {space.vehicleTypes && space.vehicleTypes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Allowed Vehicles:</p>
            <div className="flex flex-wrap gap-2">
              {space.vehicleTypes.map((vehicleType, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                  {vehicleType.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {space.timeRestrictions && space.timeRestrictions.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Time Restrictions:</p>
            <div className="space-y-2">
              {space.timeRestrictions.map((restriction, index) => (
                <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-xs text-yellow-800 font-medium">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][restriction.dayOfWeek]}s: {restriction.startTime} - {restriction.endTime}
                  </p>
                  <p className="text-xs text-yellow-700">{restriction.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {space.currentBooking && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Current Booking</p>
            <p className="text-xs text-red-700">
              {space.currentBooking.userName} - {space.currentBooking.vehicleInfo}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Until {space.currentBooking.endTime.toLocaleTimeString()}
            </p>
            {space.currentBooking.contactInfo && (
              <p className="text-xs text-red-600 mt-1">{space.currentBooking.contactInfo}</p>
            )}
          </div>
        )}

        {space.status === 'scheduled' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Scheduled Service</p>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              This space is reserved for scheduled municipal services
            </p>
          </div>
        )}

        {isBookingAllowed() && (
          <div className="space-y-3">
            {!showBookingForm ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Book This Space
              </button>
            ) : (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Quick Booking</h4>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Duration
                  </label>
                  <select
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {getAvailableDurations().map((duration) => {
                      const cost = space.price === 0 ? 0 : (duration.value / 60) * space.price;
                      return (
                        <option key={duration.value} value={duration.value}>
                          {duration.label} - {cost === 0 ? 'Free' : `$${cost.toFixed(2)}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBooking}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        )}

        {space.type === 'trash_collection' && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Trash2 className="h-4 w-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-800">Municipal Service</p>
            </div>
            <p className="text-xs text-gray-600">
              This space is reserved for waste collection services. Contact city services for scheduling.
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {space.lastUpdated.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;