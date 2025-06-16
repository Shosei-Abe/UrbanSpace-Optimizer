// Enhanced Google Maps integration with Parkopedia data
import { Loader } from '@googlemaps/js-api-loader';
import { parkopediaAPI, ParkopediaSpot } from './parkopedia';

export interface GoogleMapsConfig {
  apiKey: string;
  libraries: string[];
  version: string;
}

export interface MapOptions {
  center: { lat: number; lng: number };
  zoom: number;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
}

export interface MarkerData {
  position: { lat: number; lng: number };
  title: string;
  type: 'parking' | 'ev_charging' | 'delivery' | 'school' | 'cycling' | 'waste';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  data?: any;
}

class GoogleMapsService {
  private loader: Loader;
  private map: google.maps.Map | null = null;
  private markers: google.maps.Marker[] = [];
  private infoWindows: google.maps.InfoWindow[] = [];
  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private trafficLayer: google.maps.TrafficLayer | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  constructor(config: GoogleMapsConfig) {
    this.loader = new Loader({
      apiKey: config.apiKey,
      version: config.version,
      libraries: config.libraries as any,
    });
  }

  async initialize(container: HTMLElement, options: MapOptions): Promise<google.maps.Map> {
    try {
      await this.loader.load();
      
      this.map = new google.maps.Map(container, {
        center: options.center,
        zoom: options.zoom,
        mapTypeId: options.mapTypeId || 'roadmap',
        styles: options.styles,
        disableDefaultUI: options.disableDefaultUI || false,
        zoomControl: options.zoomControl !== false,
        mapTypeControl: options.mapTypeControl !== false,
        streetViewControl: options.streetViewControl !== false,
        fullscreenControl: options.fullscreenControl !== false,
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4F46E5',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
      this.directionsRenderer.setMap(this.map);

      this.trafficLayer = new google.maps.TrafficLayer();
      this.placesService = new google.maps.places.PlacesService(this.map);

      return this.map;
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      throw error;
    }
  }

  async addParkopediaMarkers(center: { lat: number; lng: number }, radius: number = 1000): Promise<void> {
    if (!this.map) return;

    try {
      const parkingSpots = await parkopediaAPI.searchParkingSpots({
        latitude: center.lat,
        longitude: center.lng,
        radius,
      });

      parkingSpots.forEach(spot => {
        this.addParkingMarker(spot);
      });
    } catch (error) {
      console.error('Error adding Parkopedia markers:', error);
    }
  }

  async addEVChargingMarkers(center: { lat: number; lng: number }, radius: number = 2000): Promise<void> {
    if (!this.map) return;

    try {
      const chargingStations = await parkopediaAPI.getEVChargingStations({
        latitude: center.lat,
        longitude: center.lng,
        radius,
        includeEV: true,
      });

      chargingStations.forEach(station => {
        this.addEVChargingMarker(station);
      });
    } catch (error) {
      console.error('Error adding EV charging markers:', error);
    }
  }

  private addParkingMarker(spot: ParkopediaSpot): void {
    if (!this.map) return;

    const availabilityPercentage = (spot.availability.available / spot.availability.total) * 100;
    const markerColor = availabilityPercentage > 50 ? '#10B981' : 
                       availabilityPercentage > 20 ? '#F59E0B' : '#EF4444';

    const marker = new google.maps.Marker({
      position: { lat: spot.latitude, lng: spot.longitude },
      map: this.map,
      title: spot.name,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${markerColor}" stroke="#FFFFFF" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" font-size="16" fill="#FFFFFF">P</text>
            ${spot.evCharging ? '<circle cx="24" cy="8" r="4" fill="#3B82F6" stroke="#FFFFFF" stroke-width="1"/>' : ''}
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(32, 32),
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: this.createParkingInfoWindow(spot),
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
    this.infoWindows.push(infoWindow);
  }

  private addEVChargingMarker(station: ParkopediaSpot): void {
    if (!this.map || !station.evCharging) return;

    const marker = new google.maps.Marker({
      position: { lat: station.latitude, lng: station.longitude },
      map: this.map,
      title: station.name,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>
            <path d="M12 10h8v6l-2 2v4h-4v-4l-2-2V10z" fill="#FFFFFF"/>
            <path d="M14 18h4v2h-4v-2z" fill="#10B981"/>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(32, 32),
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: this.createEVChargingInfoWindow(station),
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
    this.infoWindows.push(infoWindow);
  }

  private createParkingInfoWindow(spot: ParkopediaSpot): string {
    const availabilityPercentage = (spot.availability.available / spot.availability.total) * 100;
    const statusColor = availabilityPercentage > 50 ? '#10B981' : 
                       availabilityPercentage > 20 ? '#F59E0B' : '#EF4444';

    return `
      <div style="max-width: 300px; padding: 12px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1F2937;">${spot.name}</h3>
        <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">${spot.address}</p>
        
        <div style="display: flex; gap: 8px; margin: 8px 0;">
          <span style="background: ${statusColor}20; color: ${statusColor}; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
            ${spot.availability.available}/${spot.availability.total} Available
          </span>
          ${spot.evCharging ? '<span style="background: #3B82F620; color: #3B82F6; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">⚡ EV Charging</span>' : ''}
        </div>
        
        <div style="margin: 8px 0;">
          <strong style="color: #374151;">Pricing:</strong>
          <div style="margin-top: 4px;">
            ${spot.pricing.rates.map(rate => 
              `<div style="font-size: 12px; color: #6B7280;">${rate.duration}: ${spot.pricing.currency} ${rate.price}</div>`
            ).join('')}
          </div>
        </div>
        
        ${spot.features.length > 0 ? `
          <div style="margin: 8px 0;">
            <strong style="color: #374151;">Features:</strong>
            <div style="margin-top: 4px;">
              ${spot.features.map(feature => 
                `<span style="background: #E5E7EB; color: #374151; padding: 2px 6px; border-radius: 8px; font-size: 11px; margin-right: 4px;">${feature}</span>`
              ).join('')}
            </div>
          </div>
        ` : ''}
        
        ${spot.evCharging ? `
          <div style="margin: 8px 0; padding: 8px; background: #3B82F610; border-radius: 8px;">
            <strong style="color: #3B82F6;">EV Charging:</strong>
            <div style="font-size: 12px; color: #1E40AF; margin-top: 4px;">
              <div>Speed: ${spot.evCharging.chargingSpeed}</div>
              <div>Connectors: ${spot.evCharging.connectorTypes.join(', ')}</div>
              <div>Networks: ${spot.evCharging.networks.join(', ')}</div>
            </div>
          </div>
        ` : ''}
        
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
          <button onclick="window.getDirections && window.getDirections(${spot.latitude}, ${spot.longitude})" 
                  style="background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
            Get Directions
          </button>
          <span style="font-size: 11px; color: #9CA3AF; margin-left: 8px;">
            Updated: ${new Date(spot.availability.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>
    `;
  }

  private createEVChargingInfoWindow(station: ParkopediaSpot): string {
    if (!station.evCharging) return '';

    return `
      <div style="max-width: 300px; padding: 12px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1F2937;">⚡ ${station.name}</h3>
        <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">${station.address}</p>
        
        <div style="margin: 8px 0; padding: 8px; background: #10B98110; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
            <div>
              <strong style="color: #059669;">Charging Speed:</strong>
              <div style="color: #047857;">${station.evCharging.chargingSpeed}</div>
            </div>
            <div>
              <strong style="color: #059669;">Available:</strong>
              <div style="color: #047857;">${station.availability.available}/${station.availability.total}</div>
            </div>
          </div>
        </div>
        
        <div style="margin: 8px 0;">
          <strong style="color: #374151;">Connector Types:</strong>
          <div style="margin-top: 4px;">
            ${station.evCharging.connectorTypes.map(type => 
              `<span style="background: #10B98120; color: #059669; padding: 2px 6px; border-radius: 8px; font-size: 11px; margin-right: 4px;">${type}</span>`
            ).join('')}
          </div>
        </div>
        
        <div style="margin: 8px 0;">
          <strong style="color: #374151;">Networks:</strong>
          <div style="margin-top: 4px;">
            ${station.evCharging.networks.map(network => 
              `<span style="background: #3B82F620; color: #3B82F6; padding: 2px 6px; border-radius: 8px; font-size: 11px; margin-right: 4px;">${network}</span>`
            ).join('')}
          </div>
        </div>
        
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
          <button onclick="window.getDirections && window.getDirections(${station.latitude}, ${station.longitude})" 
                  style="background: #10B981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
            Navigate to Charger
          </button>
          <span style="font-size: 11px; color: #9CA3AF; margin-left: 8px;">
            Updated: ${new Date(station.availability.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>
    `;
  }

  async calculateRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING,
    optimizeRoute: boolean = true
  ): Promise<google.maps.DirectionsResult | null> {
    if (!this.directionsService || !this.directionsRenderer) return null;

    try {
      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode,
        avoidTolls: false,
        avoidHighways: false,
        optimizeWaypoints: optimizeRoute,
      };

      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        this.directionsService!.route(request, (result, status) => {
          if (status === 'OK' && result) {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      this.directionsRenderer.setDirections(result);
      return result;
    } catch (error) {
      console.error('Error calculating route:', error);
      return null;
    }
  }

  showTrafficLayer(show: boolean = true): void {
    if (!this.trafficLayer || !this.map) return;
    this.trafficLayer.setMap(show ? this.map : null);
  }

  async findNearbyPlaces(
    location: { lat: number; lng: number },
    type: string,
    radius: number = 1000
  ): Promise<google.maps.places.PlaceResult[]> {
    if (!this.placesService) return [];

    try {
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius,
        type: type as any,
      };

      return new Promise((resolve, reject) => {
        this.placesService!.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Error finding nearby places:', error);
      return [];
    }
  }

  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.closeAllInfoWindows();
  }

  private closeAllInfoWindows(): void {
    this.infoWindows.forEach(infoWindow => infoWindow.close());
  }

  getUserLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  destroy(): void {
    this.clearMarkers();
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
    if (this.trafficLayer) {
      this.trafficLayer.setMap(null);
    }
  }
}

export { GoogleMapsService };

// Global function for getting directions (called from info windows)
declare global {
  interface Window {
    getDirections: (lat: number, lng: number) => void;
  }
}

window.getDirections = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, '_blank');
};