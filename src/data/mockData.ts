import { CurbsideSpace, Booking, Analytics, ServiceSchedule } from '../types';

export const mockSpaces: CurbsideSpace[] = [
  // Parking Spaces
  {
    id: '1',
    location: 'Downtown Financial District',
    address: '123 Market Street',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    type: 'parking',
    status: 'available',
    price: 3.50,
    maxDuration: 120,
    features: ['EV Charging', 'Covered', 'Meter Payment'],
    capacity: 1,
    vehicleTypes: ['car', 'motorcycle'],
    priority: 'medium',
    lastUpdated: new Date(),
  },
  {
    id: '2',
    location: 'Shopping District',
    address: '456 Commerce Ave',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    type: 'parking',
    status: 'occupied',
    price: 4.00,
    maxDuration: 180,
    features: ['Handicap Accessible', 'Short-term'],
    capacity: 1,
    vehicleTypes: ['car'],
    priority: 'high',
    currentBooking: {
      id: 'b1',
      spaceId: '2',
      userId: 'u1',
      userName: 'John Doe',
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      duration: 60,
      cost: 4.00,
      status: 'active',
      vehicleInfo: 'Honda Civic - ABC123',
      bookingType: 'regular',
    },
    lastUpdated: new Date(),
  },

  // Last-Mile Delivery
  {
    id: '3',
    location: 'Residential Complex A',
    address: '789 Apartment Way',
    coordinates: { lat: 40.7489, lng: -73.9680 },
    type: 'last_mile_delivery',
    status: 'available',
    price: 2.50,
    maxDuration: 30,
    features: ['Package Locker Access', 'Security Camera', 'Quick Loading'],
    capacity: 2,
    vehicleTypes: ['delivery_van', 'cargo_bike', 'drone'],
    priority: 'high',
    timeRestrictions: [
      {
        dayOfWeek: 1, // Monday
        startTime: '07:00',
        endTime: '19:00',
        restrictionType: 'reserved_for',
        description: 'Delivery vehicles only during business hours'
      }
    ],
    lastUpdated: new Date(),
  },
  {
    id: '4',
    location: 'Business District Hub',
    address: '321 Corporate Plaza',
    coordinates: { lat: 40.7831, lng: -73.9712 },
    type: 'last_mile_delivery',
    status: 'scheduled',
    price: 3.00,
    maxDuration: 45,
    features: ['Loading Dock', 'Freight Elevator Access', 'Climate Controlled'],
    capacity: 3,
    vehicleTypes: ['delivery_truck', 'cargo_van'],
    priority: 'medium',
    lastUpdated: new Date(),
  },

  // School Drop-offs
  {
    id: '5',
    location: 'Elementary School Main',
    address: '654 Education Street',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    type: 'school_dropoff',
    status: 'available',
    price: 0.00, // Free for school drop-offs
    maxDuration: 15,
    features: ['School Zone', 'Crossing Guard', 'Safe Walkway'],
    capacity: 8,
    vehicleTypes: ['car', 'school_bus'],
    priority: 'high',
    timeRestrictions: [
      {
        dayOfWeek: 1,
        startTime: '07:30',
        endTime: '08:30',
        restrictionType: 'reserved_for',
        description: 'School drop-off only during morning hours'
      },
      {
        dayOfWeek: 1,
        startTime: '14:30',
        endTime: '15:30',
        restrictionType: 'reserved_for',
        description: 'School pickup only during afternoon hours'
      }
    ],
    lastUpdated: new Date(),
  },
  {
    id: '6',
    location: 'High School North',
    address: '987 Academic Avenue',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    type: 'school_dropoff',
    status: 'occupied',
    price: 0.00,
    maxDuration: 20,
    features: ['Bus Lane', 'Student Pickup Area', 'Weather Shelter'],
    capacity: 12,
    vehicleTypes: ['car', 'school_bus', 'activity_bus'],
    priority: 'high',
    currentBooking: {
      id: 'b2',
      spaceId: '6',
      userId: 'u2',
      userName: 'Sarah Johnson',
      startTime: new Date(Date.now() - 10 * 60 * 1000),
      endTime: new Date(Date.now() + 5 * 60 * 1000),
      duration: 15,
      cost: 0.00,
      status: 'active',
      vehicleInfo: 'Toyota Camry - XYZ789',
      bookingType: 'regular',
      contactInfo: 'Parent pickup for Emma Johnson'
    },
    lastUpdated: new Date(),
  },

  // Cycling Infrastructure
  {
    id: '7',
    location: 'Metro Station Bike Hub',
    address: '147 Transit Plaza',
    coordinates: { lat: 40.7692, lng: -73.9442 },
    type: 'cycling',
    status: 'available',
    price: 1.00,
    maxDuration: 480, // 8 hours
    features: ['Bike Racks', 'Security Cameras', 'Weather Protection', 'Repair Station'],
    capacity: 50,
    vehicleTypes: ['bicycle', 'e_bike', 'e_scooter'],
    priority: 'medium',
    lastUpdated: new Date(),
  },
  {
    id: '8',
    location: 'University Campus Bike Park',
    address: '258 College Green',
    coordinates: { lat: 40.7749, lng: -73.9857 },
    type: 'cycling',
    status: 'available',
    price: 0.50,
    maxDuration: 720, // 12 hours
    features: ['Covered Parking', 'Charging Stations', 'Bike Share Integration'],
    capacity: 75,
    vehicleTypes: ['bicycle', 'e_bike'],
    priority: 'low',
    lastUpdated: new Date(),
  },

  // Trash Collection
  {
    id: '9',
    location: 'Residential Block 1',
    address: '369 Neighborhood Street',
    coordinates: { lat: 40.7398, lng: -73.9903 },
    type: 'trash_collection',
    status: 'scheduled',
    price: 0.00, // Municipal service
    maxDuration: 60,
    features: ['Waste Bins', 'Recycling Separation', 'Organic Waste'],
    capacity: 1,
    vehicleTypes: ['garbage_truck', 'recycling_truck'],
    priority: 'high',
    timeRestrictions: [
      {
        dayOfWeek: 2, // Tuesday
        startTime: '06:00',
        endTime: '14:00',
        restrictionType: 'reserved_for',
        description: 'Waste collection vehicles only'
      }
    ],
    lastUpdated: new Date(),
  },
  {
    id: '10',
    location: 'Commercial District Waste Hub',
    address: '741 Business Row',
    coordinates: { lat: 40.7527, lng: -73.9772 },
    type: 'trash_collection',
    status: 'available',
    price: 0.00,
    maxDuration: 90,
    features: ['Large Dumpsters', 'Compactor Access', 'Hazardous Waste Handling'],
    capacity: 2,
    vehicleTypes: ['garbage_truck', 'compactor_truck'],
    priority: 'medium',
    lastUpdated: new Date(),
  },

  // Mixed-Use Loading Zone
  {
    id: '11',
    location: 'Mixed-Use Development',
    address: '852 Urban Plaza',
    coordinates: { lat: 40.7656, lng: -73.9712 },
    type: 'loading',
    status: 'available',
    price: 5.00,
    maxDuration: 60,
    features: ['Loading Dock', '24/7 Access', 'Multiple Vehicle Types'],
    capacity: 3,
    vehicleTypes: ['delivery_truck', 'moving_van', 'service_vehicle'],
    priority: 'medium',
    lastUpdated: new Date(),
  },

  // Emergency Services
  {
    id: '12',
    location: 'Hospital Emergency Zone',
    address: '963 Medical Center Drive',
    coordinates: { lat: 40.7423, lng: -73.9871 },
    type: 'pickup',
    status: 'available',
    price: 0.00,
    maxDuration: 30,
    features: ['Emergency Access', 'Ambulance Bay', 'Patient Loading'],
    capacity: 4,
    vehicleTypes: ['ambulance', 'medical_transport', 'emergency_vehicle'],
    priority: 'emergency',
    lastUpdated: new Date(),
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    spaceId: '2',
    userId: 'u1',
    userName: 'John Doe',
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    endTime: new Date(Date.now() + 30 * 60 * 1000),
    duration: 60,
    cost: 4.00,
    status: 'active',
    vehicleInfo: 'Honda Civic - ABC123',
    bookingType: 'regular',
  },
  {
    id: 'b2',
    spaceId: '6',
    userId: 'u2',
    userName: 'Sarah Johnson',
    startTime: new Date(Date.now() - 10 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 60 * 1000),
    duration: 15,
    cost: 0.00,
    status: 'active',
    vehicleInfo: 'Toyota Camry - XYZ789',
    bookingType: 'regular',
    contactInfo: 'Parent pickup for Emma Johnson'
  },
  {
    id: 'b3',
    spaceId: '3',
    userId: 'u3',
    userName: 'QuickDeliver Inc.',
    startTime: new Date(Date.now() - 120 * 60 * 1000),
    endTime: new Date(Date.now() - 90 * 60 * 1000),
    duration: 30,
    cost: 2.50,
    status: 'completed',
    vehicleInfo: 'Delivery Van - DEL456',
    bookingType: 'regular',
    specialRequirements: ['Package delivery', 'Residential access']
  },
  {
    id: 'b4',
    spaceId: '7',
    userId: 'u4',
    userName: 'Mike Chen',
    startTime: new Date(Date.now() - 240 * 60 * 1000),
    endTime: new Date(Date.now() + 240 * 60 * 1000),
    duration: 480,
    cost: 1.00,
    status: 'active',
    vehicleInfo: 'Electric Bike - Personal',
    bookingType: 'regular',
  },
  {
    id: 'b5',
    spaceId: '9',
    userId: 'u5',
    userName: 'City Waste Management',
    startTime: new Date(Date.now() + 60 * 60 * 1000),
    endTime: new Date(Date.now() + 120 * 60 * 1000),
    duration: 60,
    cost: 0.00,
    status: 'scheduled',
    vehicleInfo: 'Garbage Truck - GW789',
    bookingType: 'scheduled_service',
  },
];

export const mockServiceSchedules: ServiceSchedule[] = [
  {
    id: 's1',
    spaceId: '9',
    serviceType: 'trash_collection',
    scheduledTime: new Date(Date.now() + 60 * 60 * 1000),
    duration: 60,
    frequency: 'weekly',
    status: 'scheduled',
    provider: 'City Waste Management',
    notes: 'Regular residential pickup - Tuesday route'
  },
  {
    id: 's2',
    spaceId: '10',
    serviceType: 'trash_collection',
    scheduledTime: new Date(Date.now() + 180 * 60 * 1000),
    duration: 90,
    frequency: 'weekly',
    status: 'scheduled',
    provider: 'Commercial Waste Solutions',
    notes: 'Business district collection - includes recycling'
  },
];

export const mockAnalytics: Analytics = {
  totalSpaces: 12,
  occupancyRate: 58,
  revenue: 2847.50,
  avgUtilization: 67,
  topLocations: [
    { location: 'Downtown Financial District', bookings: 45 },
    { location: 'Shopping District', bookings: 38 },
    { location: 'Elementary School Main', bookings: 32 },
    { location: 'Metro Station Bike Hub', bookings: 28 },
    { location: 'Residential Complex A', bookings: 25 },
  ],
  spaceTypeBreakdown: [
    { type: 'parking', count: 2, utilization: 75 },
    { type: 'last_mile_delivery', count: 2, utilization: 82 },
    { type: 'school_dropoff', count: 2, utilization: 95 },
    { type: 'cycling', count: 2, utilization: 45 },
    { type: 'trash_collection', count: 2, utilization: 60 },
    { type: 'loading', count: 1, utilization: 70 },
    { type: 'pickup', count: 1, utilization: 30 },
  ],
  peakHours: [
    { hour: 7, utilization: 85 },
    { hour: 8, utilization: 95 },
    { hour: 9, utilization: 70 },
    { hour: 12, utilization: 65 },
    { hour: 15, utilization: 90 },
    { hour: 17, utilization: 80 },
    { hour: 18, utilization: 75 },
  ],
  revenueByType: [
    { type: 'parking', revenue: 1250.00 },
    { type: 'last_mile_delivery', revenue: 890.50 },
    { type: 'loading', revenue: 450.00 },
    { type: 'cycling', revenue: 257.00 },
    { type: 'school_dropoff', revenue: 0.00 },
    { type: 'trash_collection', revenue: 0.00 },
    { type: 'pickup', revenue: 0.00 },
  ],
};