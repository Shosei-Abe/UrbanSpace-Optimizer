/*
  # Enode API Proxy Edge Function

  This function securely proxies requests to the Enode API to:
  1. Avoid CORS issues when calling from the frontend
  2. Keep sensitive API credentials server-side
  3. Provide a unified interface for all Enode operations

  ## Endpoints:
  - POST /enode-proxy with { action: 'getUser', userId: string }
  - POST /enode-proxy with { action: 'getUserVehicles', userId: string }
  - POST /enode-proxy with { action: 'getUserChargers', userId: string }
  - POST /enode-proxy with { action: 'findNearbyChargers', latitude: number, longitude: number, radius?: number }
  - POST /enode-proxy with { action: 'getVehicleBattery', vehicleId: string }
  - POST /enode-proxy with { action: 'getChargerStatus', chargerId: string }
  - POST /enode-proxy with { action: 'startCharging', chargerId: string }
  - POST /enode-proxy with { action: 'stopCharging', chargerId: string }
  - POST /enode-proxy with { action: 'setChargingTarget', chargerId: string, targetLevel: number }
  - POST /enode-proxy with { action: 'getChargingSessions', userId: string, limit?: number }
*/

const ENODE_API_BASE = 'https://enode-api.sandbox.enode.io/v1';
const ENODE_CLIENT_ID = 'd3839949-5c64-45e7-9362-4cbdc13ba8d7';
const ENODE_CLIENT_SECRET = '20beb055fa78f6b2051e02d18499b60c7c1a0665';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface EnodeTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class EnodeAPIProxy {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${ENODE_API_BASE}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: ENODE_CLIENT_ID,
          client_secret: ENODE_CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data: EnodeTokenResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Enode access token:', error);
      throw error;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${ENODE_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Enode API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUser(userId: string) {
    const userData = await this.makeRequest(`/users/${userId}`);
    const vehicles = await this.getUserVehicles(userId);
    const chargers = await this.getUserChargers(userId);

    return {
      id: userData.id,
      email: userData.email,
      vehicles,
      chargers,
      preferences: userData.preferences || {
        units: 'metric',
        currency: 'USD',
        timezone: 'UTC',
      },
    };
  }

  async getUserVehicles(userId: string) {
    const response = await this.makeRequest(`/users/${userId}/vehicles`);
    return response.data;
  }

  async getUserChargers(userId: string) {
    const response = await this.makeRequest(`/users/${userId}/chargers`);
    return response.data;
  }

  async findNearbyChargers(latitude: number, longitude: number, radius: number = 5000) {
    const response = await this.makeRequest(
      `/chargers/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
    );
    return response.data;
  }

  async getVehicleBattery(vehicleId: string) {
    const response = await this.makeRequest(`/vehicles/${vehicleId}/battery`);
    return {
      level: response.level,
      range: response.range,
      isCharging: response.isCharging,
      isPluggedIn: response.isPluggedIn,
      lastUpdated: response.lastUpdated,
    };
  }

  async getChargerStatus(chargerId: string) {
    const response = await this.makeRequest(`/chargers/${chargerId}/status`);
    return {
      isOnline: response.isOnline,
      isCharging: response.isCharging,
      isPluggedIn: response.isPluggedIn,
      power: response.power,
      energy: response.energy,
      lastUpdated: response.lastUpdated,
    };
  }

  async startCharging(chargerId: string) {
    await this.makeRequest(`/chargers/${chargerId}/charging`, {
      method: 'POST',
      body: JSON.stringify({ action: 'start' }),
    });
    return true;
  }

  async stopCharging(chargerId: string) {
    await this.makeRequest(`/chargers/${chargerId}/charging`, {
      method: 'POST',
      body: JSON.stringify({ action: 'stop' }),
    });
    return true;
  }

  async setChargingTarget(chargerId: string, targetLevel: number) {
    await this.makeRequest(`/chargers/${chargerId}/charging/target`, {
      method: 'POST',
      body: JSON.stringify({ targetLevel }),
    });
    return true;
  }

  async getChargingSessions(userId: string, limit: number = 10) {
    const response = await this.makeRequest(`/users/${userId}/charging-sessions?limit=${limit}`);
    return response.data.map((session: any) => ({
      id: session.id,
      vehicleId: session.vehicleId,
      chargerId: session.chargerId,
      startTime: session.startTime,
      endTime: session.endTime,
      energyDelivered: session.energyDelivered,
      cost: session.cost,
      currency: session.currency,
      status: session.status,
      location: session.location,
    }));
  }
}

const enodeProxy = new EnodeAPIProxy();

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { action, ...params } = await req.json();

    let result;

    switch (action) {
      case 'getUser':
        result = await enodeProxy.getUser(params.userId);
        break;
      
      case 'getUserVehicles':
        result = await enodeProxy.getUserVehicles(params.userId);
        break;
      
      case 'getUserChargers':
        result = await enodeProxy.getUserChargers(params.userId);
        break;
      
      case 'findNearbyChargers':
        result = await enodeProxy.findNearbyChargers(
          params.latitude,
          params.longitude,
          params.radius
        );
        break;
      
      case 'getVehicleBattery':
        result = await enodeProxy.getVehicleBattery(params.vehicleId);
        break;
      
      case 'getChargerStatus':
        result = await enodeProxy.getChargerStatus(params.chargerId);
        break;
      
      case 'startCharging':
        result = await enodeProxy.startCharging(params.chargerId);
        break;
      
      case 'stopCharging':
        result = await enodeProxy.stopCharging(params.chargerId);
        break;
      
      case 'setChargingTarget':
        result = await enodeProxy.setChargingTarget(params.chargerId, params.targetLevel);
        break;
      
      case 'getChargingSessions':
        result = await enodeProxy.getChargingSessions(params.userId, params.limit);
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Enode proxy error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        useMockData: true
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});