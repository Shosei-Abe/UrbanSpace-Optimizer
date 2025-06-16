export interface CurbsideSpace {
  id: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'parking' | 'loading' | 'pickup' | 'delivery' | 'trash_collection' | 'school_dropoff' | 'cycling' | 'last_mile_delivery';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'scheduled';
  price: number;
  maxDuration: number; // in minutes
  features: string[];
  currentBooking?: Booking;
  lastUpdated: Date;
  timeRestrictions?: TimeRestriction[];
  capacity?: number; // for cycling spaces or multiple vehicle spots
  vehicleTypes?: string[]; // allowed vehicle types
  priority?: 'low' | 'medium' | 'high' | 'emergency';
}

export interface TimeRestriction {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  restrictionType: 'no_parking' | 'reserved_for' | 'priority_access';
  description: string;
}

export interface Booking {
  id: string;
  spaceId: string;
  userId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  cost: number;
  status: 'active' | 'completed' | 'cancelled' | 'scheduled';
  vehicleInfo: string;
  bookingType: 'regular' | 'recurring' | 'emergency' | 'scheduled_service';
  contactInfo?: string;
  specialRequirements?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'admin' | 'business' | 'school_staff' | 'waste_management' | 'delivery_service' | 'cyclist';
  phone: string;
  organization?: string;
  vehicleInfo?: string[];
}

export interface Analytics {
  totalSpaces: number;
  occupancyRate: number;
  revenue: number;
  avgUtilization: number;
  topLocations: Array<{ location: string; bookings: number }>;
  spaceTypeBreakdown: Array<{ type: string; count: number; utilization: number }>;
  peakHours: Array<{ hour: number; utilization: number }>;
  revenueByType: Array<{ type: string; revenue: number }>;
}

export interface ServiceSchedule {
  id: string;
  spaceId: string;
  serviceType: 'trash_collection' | 'street_cleaning' | 'maintenance';
  scheduledTime: Date;
  duration: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'one_time';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  provider: string;
  notes?: string;
}