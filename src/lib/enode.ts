// Enode API integration for EV charger and battery information
// Now uses Supabase Edge Function proxy for secure API access

export interface EnodeVehicle {
  id: string;
  userId: string;
  vendor: string;
  model: string;
  year: number;
  displayName: string;
  isReachable: boolean;
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
  };
  battery?: {
    level: number; // 0-100
    range: number; // in km
    isCharging: boolean;
    isPluggedIn: boolean;
    lastUpdated: string;
  };
  charging?: {
    isCharging: boolean;
    chargingRate: number; // kW
    timeToComplete?: number; // minutes
    targetLevel?: number; // 0-100
  };
}

export interface EnodeCharger {
  id: string;
  userId: string;
  vendor: string;
  model: string;
  displayName: string;
  isReachable: boolean;
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: {
    isOnline: boolean;
    isCharging: boolean;
    isPluggedIn: boolean;
    power: number; // kW
    energy: number; // kWh
    lastUpdated: string;
  };
  capabilities: {
    maxPower: number; // kW
    connectorTypes: string[];
    smartCharging: boolean;
    scheduling: boolean;
  };
}

export interface EnodeChargingSession {
  id: string;
  vehicleId: string;
  chargerId?: string;
  startTime: string;
  endTime?: string;
  energyDelivered: number; // kWh
  cost?: number;
  currency?: string;
  status: 'active' | 'completed' | 'interrupted';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface EnodeUser {
  id: string;
  email: string;
  vehicles: EnodeVehicle[];
  chargers: EnodeCharger[];
  preferences: {
    units: 'metric' | 'imperial';
    currency: string;
    timezone: string;
  };
}

class EnodeAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enode-proxy`;
  }

  private async makeProxyRequest(action: string, params: any = {}): Promise<any> {
    const headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, ...params }),
    });

    if (!response.ok) {
      throw new Error(`Enode proxy request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      if (result.useMockData) {
        throw new Error('API_UNAVAILABLE');
      }
      throw new Error(result.error || 'Unknown error');
    }

    return result.data;
  }

  async getUser(userId: string): Promise<EnodeUser> {
    try {
      const userData = await this.makeProxyRequest('getUser', { userId });
      return {
        id: userData.id,
        email: userData.email,
        vehicles: userData.vehicles.map((vehicle: any) => this.transformVehicleData(vehicle)),
        chargers: userData.chargers.map((charger: any) => this.transformChargerData(charger)),
        preferences: userData.preferences,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async getUserVehicles(userId: string): Promise<EnodeVehicle[]> {
    try {
      const vehicles = await this.makeProxyRequest('getUserVehicles', { userId });
      return vehicles.map((vehicle: any) => this.transformVehicleData(vehicle));
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      return [];
    }
  }

  async getUserChargers(userId: string): Promise<EnodeCharger[]> {
    try {
      const chargers = await this.makeProxyRequest('getUserChargers', { userId });
      return chargers.map((charger: any) => this.transformChargerData(charger));
    } catch (error) {
      console.error('Error fetching user chargers:', error);
      return [];
    }
  }

  async getVehicleBattery(vehicleId: string): Promise<EnodeVehicle['battery']> {
    try {
      return await this.makeProxyRequest('getVehicleBattery', { vehicleId });
    } catch (error) {
      console.error('Error fetching vehicle battery:', error);
      return undefined;
    }
  }

  async getChargerStatus(chargerId: string): Promise<EnodeCharger['status']> {
    try {
      return await this.makeProxyRequest('getChargerStatus', { chargerId });
    } catch (error) {
      console.error('Error fetching charger status:', error);
      throw error;
    }
  }

  async startCharging(chargerId: string): Promise<boolean> {
    try {
      return await this.makeProxyRequest('startCharging', { chargerId });
    } catch (error) {
      console.error('Error starting charging:', error);
      return false;
    }
  }

  async stopCharging(chargerId: string): Promise<boolean> {
    try {
      return await this.makeProxyRequest('stopCharging', { chargerId });
    } catch (error) {
      console.error('Error stopping charging:', error);
      return false;
    }
  }

  async setChargingTarget(chargerId: string, targetLevel: number): Promise<boolean> {
    try {
      return await this.makeProxyRequest('setChargingTarget', { chargerId, targetLevel });
    } catch (error) {
      console.error('Error setting charging target:', error);
      return false;
    }
  }

  async getChargingSessions(userId: string, limit: number = 10): Promise<EnodeChargingSession[]> {
    try {
      return await this.makeProxyRequest('getChargingSessions', { userId, limit });
    } catch (error) {
      console.error('Error fetching charging sessions:', error);
      return [];
    }
  }

  async findNearbyChargers(
    latitude: number,
    longitude: number,
    radius: number = 5000
  ): Promise<EnodeCharger[]> {
    try {
      const chargers = await this.makeProxyRequest('findNearbyChargers', { 
        latitude, 
        longitude, 
        radius 
      });
      return chargers.map((charger: any) => this.transformChargerData(charger));
    } catch (error) {
      console.error('Error finding nearby chargers:', error);
      throw error;
    }
  }

  private transformVehicleData(vehicle: any): EnodeVehicle {
    return {
      id: vehicle.id,
      userId: vehicle.userId,
      vendor: vehicle.vendor,
      model: vehicle.model,
      year: vehicle.year,
      displayName: vehicle.displayName,
      isReachable: vehicle.isReachable,
      lastSeen: vehicle.lastSeen,
      location: vehicle.location,
      battery: vehicle.battery,
      charging: vehicle.charging,
    };
  }

  private transformChargerData(charger: any): EnodeCharger {
    return {
      id: charger.id,
      userId: charger.userId,
      vendor: charger.vendor,
      model: charger.model,
      displayName: charger.displayName,
      isReachable: charger.isReachable,
      lastSeen: charger.lastSeen,
      location: charger.location,
      status: charger.status,
      capabilities: charger.capabilities,
    };
  }

  // Mock data for demo purposes when API is not available
  getMockUserData(): EnodeUser {
    return {
      id: 'demo-user-1',
      email: 'demo@smartcurb.com',
      vehicles: [
        {
          id: 'vehicle-1',
          userId: 'demo-user-1',
          vendor: 'Tesla',
          model: 'Model 3',
          year: 2023,
          displayName: 'My Tesla Model 3',
          isReachable: true,
          lastSeen: new Date().toISOString(),
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            lastUpdated: new Date().toISOString(),
          },
          battery: {
            level: 78,
            range: 312,
            isCharging: false,
            isPluggedIn: false,
            lastUpdated: new Date().toISOString(),
          },
          charging: {
            isCharging: false,
            chargingRate: 0,
          },
        },
        {
          id: 'vehicle-2',
          userId: 'demo-user-1',
          vendor: 'BMW',
          model: 'iX',
          year: 2024,
          displayName: 'BMW iX',
          isReachable: true,
          lastSeen: new Date().toISOString(),
          location: {
            latitude: 40.7580,
            longitude: -73.9855,
            lastUpdated: new Date().toISOString(),
          },
          battery: {
            level: 45,
            range: 180,
            isCharging: true,
            isPluggedIn: true,
            lastUpdated: new Date().toISOString(),
          },
          charging: {
            isCharging: true,
            chargingRate: 11.5,
            timeToComplete: 120,
            targetLevel: 80,
          },
        },
      ],
      chargers: [
        {
          id: 'charger-1',
          userId: 'demo-user-1',
          vendor: 'ChargePoint',
          model: 'Home Flex',
          displayName: 'Home Charger',
          isReachable: true,
          lastSeen: new Date().toISOString(),
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: '123 Main St, New York, NY',
          },
          status: {
            isOnline: true,
            isCharging: false,
            isPluggedIn: false,
            power: 0,
            energy: 0,
            lastUpdated: new Date().toISOString(),
          },
          capabilities: {
            maxPower: 11.5,
            connectorTypes: ['Type 2'],
            smartCharging: true,
            scheduling: true,
          },
        },
      ],
      preferences: {
        units: 'metric',
        currency: 'USD',
        timezone: 'America/New_York',
      },
    };
  }

  getMockNearbyChargers(latitude: number, longitude: number): EnodeCharger[] {
    return [
      {
        id: 'nearby-charger-1',
        userId: 'public',
        vendor: 'Tesla',
        model: 'Supercharger V3',
        displayName: 'Tesla Supercharger - Downtown',
        isReachable: true,
        lastSeen: new Date().toISOString(),
        location: {
          latitude: latitude + 0.001,
          longitude: longitude + 0.001,
          address: 'Downtown Plaza',
        },
        status: {
          isOnline: true,
          isCharging: false,
          isPluggedIn: false,
          power: 0,
          energy: 0,
          lastUpdated: new Date().toISOString(),
        },
        capabilities: {
          maxPower: 250,
          connectorTypes: ['Tesla', 'CCS'],
          smartCharging: true,
          scheduling: false,
        },
      },
      {
        id: 'nearby-charger-2',
        userId: 'public',
        vendor: 'Electrify America',
        model: 'Ultra Fast',
        displayName: 'Electrify America - Shopping Center',
        isReachable: true,
        lastSeen: new Date().toISOString(),
        location: {
          latitude: latitude - 0.002,
          longitude: longitude + 0.002,
          address: 'Shopping Center Parking',
        },
        status: {
          isOnline: true,
          isCharging: true,
          isPluggedIn: true,
          power: 150,
          energy: 45.2,
          lastUpdated: new Date().toISOString(),
        },
        capabilities: {
          maxPower: 350,
          connectorTypes: ['CCS', 'CHAdeMO'],
          smartCharging: true,
          scheduling: true,
        },
      },
    ];
  }
}

export const enodeAPI = new EnodeAPI();

// Helper functions for integration with existing components
export const getUserEVData = async (userId: string): Promise<EnodeUser> => {
  try {
    return await enodeAPI.getUser(userId);
  } catch (error) {
    if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
      console.warn('Enode API unavailable, using mock data');
      return enodeAPI.getMockUserData();
    }
    console.warn('Enode API error, using mock data:', error);
    return enodeAPI.getMockUserData();
  }
};

export const getNearbyEVChargers = async (
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<EnodeCharger[]> => {
  try {
    return await enodeAPI.findNearbyChargers(latitude, longitude, radius);
  } catch (error) {
    if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
      console.warn('Enode API unavailable, using mock data');
      return enodeAPI.getMockNearbyChargers(latitude, longitude);
    }
    console.warn('Enode API error, using mock data:', error);
    return enodeAPI.getMockNearbyChargers(latitude, longitude);
  }
};

export const getVehicleBatteryInfo = async (vehicleId: string): Promise<EnodeVehicle['battery']> => {
  try {
    return await enodeAPI.getVehicleBattery(vehicleId);
  } catch (error) {
    console.warn('Enode API unavailable for vehicle battery info:', error);
    return undefined;
  }
};

export const controlCharging = async (
  chargerId: string,
  action: 'start' | 'stop',
  targetLevel?: number
): Promise<boolean> => {
  try {
    if (action === 'start') {
      const success = await enodeAPI.startCharging(chargerId);
      if (success && targetLevel) {
        await enodeAPI.setChargingTarget(chargerId, targetLevel);
      }
      return success;
    } else {
      return await enodeAPI.stopCharging(chargerId);
    }
  } catch (error) {
    console.warn('Enode API unavailable for charging control:', error);
    return false;
  }
};