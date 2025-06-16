import React, { useState } from 'react';
import { Calendar, Clock, User, Car, CheckCircle, XCircle, AlertCircle, Truck, Bike, GraduationCap, Trash2, Package } from 'lucide-react';
import { Booking } from '../types';

interface BookingManagerProps {
  bookings: Booking[];
}

const BookingManager: React.FC<BookingManagerProps> = ({ bookings }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled' | 'scheduled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'regular' | 'recurring' | 'emergency' | 'scheduled_service'>('all');
  
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filter === 'all' || booking.status === filter;
    const typeMatch = typeFilter === 'all' || booking.bookingType === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBookingTypeColor = (type: string) => {
    switch (type) {
      case 'regular': return 'bg-gray-100 text-gray-800';
      case 'recurring': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'scheduled_service': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'regular': return <User className="h-4 w-4" />;
      case 'recurring': return <Calendar className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4" />;
      case 'scheduled_service': return <Clock className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.cost, 0);
  const activeBookings = bookings.filter(b => b.status === 'active').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const scheduledBookings = bookings.filter(b => b.status === 'scheduled').length;

  const formatBookingType = (type: string) => {
    switch (type) {
      case 'scheduled_service': return 'Scheduled Service';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="regular">Regular</option>
            <option value="recurring">Recurring</option>
            <option value="emergency">Emergency</option>
            <option value="scheduled_service">Scheduled Service</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{activeBookings}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{completedBookings}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{scheduledBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">${totalRevenue.toFixed(2)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No bookings found for the selected filters.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(booking.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{booking.userName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getBookingTypeColor(booking.bookingType)}`}>
                          {getBookingTypeIcon(booking.bookingType)}
                          <span>{formatBookingType(booking.bookingType)}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <Car className="h-4 w-4 mr-1" />
                        {booking.vehicleInfo}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.startTime.toLocaleString()} - {booking.endTime.toLocaleString()}
                      </p>
                      {booking.contactInfo && (
                        <p className="text-xs text-blue-600 mt-1">{booking.contactInfo}</p>
                      )}
                      {booking.specialRequirements && booking.specialRequirements.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {booking.specialRequirements.map((req, index) => (
                              <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.cost === 0 ? 'Free' : `$${booking.cost.toFixed(2)}`}
                    </p>
                    <p className="text-sm text-gray-600">{booking.duration} minutes</p>
                  </div>
                </div>
                
                {booking.status === 'active' && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <Clock className="h-4 w-4" />
                      <span>Ends in {Math.max(0, Math.floor((booking.endTime.getTime() - Date.now()) / (1000 * 60)))} minutes</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Extend
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                        End Early
                      </button>
                    </div>
                  </div>
                )}

                {booking.status === 'scheduled' && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-purple-700">
                      <Calendar className="h-4 w-4" />
                      <span>Starts in {Math.max(0, Math.floor((booking.startTime.getTime() - Date.now()) / (1000 * 60)))} minutes</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                        Modify
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManager;