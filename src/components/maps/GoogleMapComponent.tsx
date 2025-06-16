import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { CurbsideSpace } from '../../types';
import { searchNearbyParking, searchEVCharging, ParkopediaSpot, parkopediaAPI } from '../../lib/parkopedia';
import { getNearbyEVChargers, EnodeCharger } from '../../lib/enode';
import { Navigation, Zap, Route, AlertTriangle, MapPin, RefreshCw, Info, Battery, Loader2, Maximize, Minimize } from 'lucide-react';

interface GoogleMapComponentProps {
  spaces: CurbsideSpace[];
  onSpaceSelect: (space: CurbsideSpace) => void;
  selectedSpace: CurbsideSpace | null;
  filterType?: string;
  showEVChargers?: boolean;
  showTrafficLayer?: boolean;
  showRouting?: boolean;
  onChargerSelect?: (charger: EnodeCharger) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  spaces,
  onSpaceSelect,
  selectedSpace,
  filterType = 'all',
  showEVChargers = false,
  showTrafficLayer = false,
  showRouting = false,
  onChargerSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [parkopediaSpots, setParkopediaSpots] = useState<ParkopediaSpot[]>([]);
  const [enodeChargers, setEnodeChargers] = useState<EnodeCharger[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [dataSourceInfo, setDataSourceInfo] = useState<{ source: string; description: string }>({ source: '', description: '' });
  const [locationLoading, setLocationLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Check if API key is available
    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      setMapError('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      setLocationLoading(false);
      return;
    }

    const initMap = async () => {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry'],
      });

      try {
        await loader.load();
        
        // Get user location first
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: location,
            zoom: 13,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          });

          setMap(mapInstance);
          setDirectionsService(new google.maps.DirectionsService());
          setDirectionsRenderer(new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#4F46E5',
              strokeWeight: 4,
            },
          }));
          setTrafficLayer(new google.maps.TrafficLayer());

          // Get data source info
          setDataSourceInfo(parkopediaAPI.getDataSourceInfo());

          // Add user location marker
          new google.maps.Marker({
            position: location,
            map: mapInstance,
            title: `Your Location - ${currentCity}`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
            },
          });

          // Load data for user location
          loadParkopediaData(location, mapInstance);
          if (showEVChargers) {
            loadEnodeData(location, mapInstance);
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError('Failed to load Google Maps. Please check your API key and internet connection.');
      } finally {
        setLocationLoading(false);
      }
    };

    initMap();
  }, [apiKey, showEVChargers]);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported');
        const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
        setCurrentCity('New York');
        resolve(defaultLocation);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Get city name from coordinates
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lng}&localityLanguage=en`
            );
            const data = await response.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
            setCurrentCity(city);
          } catch (error) {
            console.error('Error getting city name:', error);
            setCurrentCity('Current Location');
          }

          resolve(location);
        },
        (error) => {
          console.log('Geolocation permission denied or failed:', error);
          // Fallback to default location
          const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
          setCurrentCity('New York (Default)');
          resolve(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const loadParkopediaData = async (location: { lat: number; lng: number }, mapInstance: google.maps.Map) => {
    try {
      let spots: ParkopediaSpot[] = [];
      
      if (showEVChargers || filterType === 'parking-ev') {
        spots = await searchEVCharging(location.lat, location.lng, 2000);
      } else {
        spots = await searchNearbyParking(location.lat, location.lng, {
          radius: 1000,
          includeEV: filterType === 'parking-ev',
        });
      }

      setParkopediaSpots(spots);
      addParkopediaMarkers(spots, mapInstance);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading Parkopedia data:', error);
    }
  };

  const loadEnodeData = async (location: { lat: number; lng: number }, mapInstance: google.maps.Map) => {
    try {
      const chargers = await getNearbyEVChargers(location.lat, location.lng, 5000);
      setEnodeChargers(chargers);
      addEnodeMarkers(chargers, mapInstance);
    } catch (error) {
      console.error('Error loading Enode data:', error);
    }
  };

  const addParkopediaMarkers = (spots: ParkopediaSpot[], mapInstance: google.maps.Map) => {
    // Clear existing Parkopedia markers
    markers.forEach(marker => {
      if (marker.get('isParkopedia')) {
        marker.setMap(null);
      }
    });

    const newMarkers: google.maps.Marker[] = [];

    spots.forEach(spot => {
      const availabilityPercentage = (spot.availability.available / spot.availability.total) * 100;
      const markerColor = availabilityPercentage > 50 ? '#10B981' : 
                         availabilityPercentage > 20 ? '#F59E0B' : '#EF4444';

      const marker = new google.maps.Marker({
        position: { lat: spot.latitude, lng: spot.longitude },
        map: mapInstance,
        title: spot.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="${markerColor}" stroke="#FFFFFF" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" font-weight="bold">
                ${spot.evCharging ? '⚡' : 'P'}
              </text>
              ${spot.evCharging ? '<circle cx="24" cy="8" r="4" fill="#3B82F6" stroke="#FFFFFF" stroke-width="1"/>' : ''}
              ${spot.dataSource === 'mock' ? '<circle cx="8" cy="8" r="3" fill="#9CA3AF" stroke="#FFFFFF" stroke-width="1"/>' : ''}
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      marker.set('isParkopedia', true);

      const infoWindow = new google.maps.InfoWindow({
        content: createParkopediaInfoWindow(spot),
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(prev => [...prev.filter(m => !m.get('isParkopedia') && !m.get('isEnode')), ...newMarkers]);
  };

  const addEnodeMarkers = (chargers: EnodeCharger[], mapInstance: google.maps.Map) => {
    // Clear existing Enode markers
    markers.forEach(marker => {
      if (marker.get('isEnode')) {
        marker.setMap(null);
      }
    });

    const newMarkers: google.maps.Marker[] = [];

    chargers.forEach(charger => {
      const statusColor = !charger.status.isOnline ? '#6B7280' :
                         charger.status.isCharging ? '#3B82F6' : '#10B981';

      const marker = new google.maps.Marker({
        position: { lat: charger.location?.latitude || 0, lng: charger.location?.longitude || 0 },
        map: mapInstance,
        title: charger.displayName,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="${statusColor}" stroke="#FFFFFF" stroke-width="2"/>
              <path d="M12 10h12v8l-3 3v6h-6v-6l-3-3V10z" fill="#FFFFFF"/>
              <circle cx="28" cy="8" r="6" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>
              <text x="28" y="12" text-anchor="middle" font-size="8" fill="#FFFFFF" font-weight="bold">E</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(36, 36),
        },
      });

      marker.set('isEnode', true);
      marker.set('chargerData', charger);

      const infoWindow = new google.maps.InfoWindow({
        content: createEnodeInfoWindow(charger),
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
        if (onChargerSelect) {
          onChargerSelect(charger);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(prev => [...prev.filter(m => !m.get('isEnode')), ...newMarkers]);
  };

  const createParkopediaInfoWindow = (spot: ParkopediaSpot) => {
    const availabilityPercentage = (spot.availability.available / spot.availability.total) * 100;
    const statusColor = availabilityPercentage > 50 ? '#10B981' : 
                       availabilityPercentage > 20 ? '#F59E0B' : '#EF4444';

    const dataSourceBadge = spot.dataSource === 'mock' 
      ? '<span style="background: #9CA3AF20; color: #6B7280; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 500;">Demo Data</span>'
      : '<span style="background: #10B98120; color: #059669; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 500;">Live Data</span>';

    return `
      <div style="max-width: 300px; padding: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <h3 style="margin: 0; font-weight: bold; color: #1F2937; flex: 1;">${spot.name}</h3>
          ${dataSourceBadge}
        </div>
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
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}', '_blank')" 
                  style="background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
            Get Directions
          </button>
          <span style="font-size: 11px; color: #9CA3AF; margin-left: 8px;">
            Updated: ${new Date(spot.availability.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>
    `;
  };

  const createEnodeInfoWindow = (charger: EnodeCharger) => {
    const statusColor = !charger.status.isOnline ? '#6B7280' :
                       charger.status.isCharging ? '#3B82F6' : '#10B981';

    return `
      <div style="max-width: 320px; padding: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <h3 style="margin: 0; font-weight: bold; color: #1F2937; flex: 1;">⚡ ${charger.displayName}</h3>
          <span style="background: #10B98120; color: #059669; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 500;">Enode API</span>
        </div>
        <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">${charger.vendor} ${charger.model}</p>
        
        <div style="margin: 8px 0; padding: 8px; background: ${statusColor}10; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
            <div>
              <strong style="color: ${statusColor};">Status:</strong>
              <div style="color: ${statusColor};">
                ${!charger.status.isOnline ? 'Offline' :
                  charger.status.isCharging ? 'Charging' : 'Available'}
              </div>
            </div>
            <div>
              <strong style="color: ${statusColor};">Power:</strong>
              <div style="color: ${statusColor};">${charger.status.power} kW</div>
            </div>
            <div>
              <strong style="color: ${statusColor};">Energy:</strong>
              <div style="color: ${statusColor};">${charger.status.energy} kWh</div>
            </div>
            <div>
              <strong style="color: ${statusColor};">Max Power:</strong>
              <div style="color: ${statusColor};">${charger.capabilities.maxPower} kW</div>
            </div>
          </div>
        </div>
        
        <div style="margin: 8px 0;">
          <strong style="color: #374151;">Capabilities:</strong>
          <div style="margin-top: 4px; font-size: 12px;">
            <div>Connectors: ${charger.capabilities.connectorTypes.join(', ')}</div>
            <div>Smart Charging: ${charger.capabilities.smartCharging ? 'Yes' : 'No'}</div>
            <div>Scheduling: ${charger.capabilities.scheduling ? 'Yes' : 'No'}</div>
          </div>
        </div>
        
        ${charger.status.isCharging ? `
          <div style="margin: 8px 0; padding: 8px; background: #3B82F610; border-radius: 8px;">
            <strong style="color: #3B82F6;">Currently Charging:</strong>
            <div style="font-size: 12px; color: #1E40AF; margin-top: 4px;">
              <div>Active Session: ${charger.status.power} kW</div>
              <div>Energy Delivered: ${charger.status.energy} kWh</div>
              <div>Connection: ${charger.status.isPluggedIn ? 'Connected' : 'Disconnected'}</div>
            </div>
          </div>
        ` : ''}
        
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${charger.location?.latitude},${charger.location?.longitude}', '_blank')" 
                  style="background: #10B981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-right: 8px;">
            Navigate to Charger
          </button>
          <button onclick="window.selectCharger && window.selectCharger('${charger.id}')"
                  style="background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
            View Details
          </button>
          <div style="margin-top: 8px;">
            <span style="font-size: 11px; color: #9CA3AF;">
              Updated: ${new Date(charger.status.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    if (map && trafficLayer) {
      if (showTrafficLayer) {
        trafficLayer.setMap(map);
      } else {
        trafficLayer.setMap(null);
      }
    }
  }, [map, trafficLayer, showTrafficLayer]);

  useEffect(() => {
    if (map && directionsRenderer) {
      directionsRenderer.setMap(showRouting ? map : null);
    }
  }, [map, directionsRenderer, showRouting]);

  useEffect(() => {
    if (!map) return;

    // Clear existing space markers
    markers.forEach(marker => {
      if (!marker.get('isParkopedia') && !marker.get('isEnode')) {
        marker.setMap(null);
      }
    });

    const filteredSpaces = spaces.filter(space => {
      if (filterType === 'all') return true;
      if (filterType === 'parking-ev') return space.type === 'parking' && space.features.includes('EV Charging');
      return space.type === filterType.replace('-', '_');
    });

    const newMarkers = filteredSpaces.map(space => {
      const marker = new google.maps.Marker({
        position: space.coordinates,
        map,
        title: space.location,
        icon: getMarkerIcon(space),
      });

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(space),
      });

      marker.addListener('click', () => {
        onSpaceSelect(space);
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(prev => [...prev.filter(m => m.get('isParkopedia') || m.get('isEnode')), ...newMarkers]);
  }, [map, spaces, filterType, onSpaceSelect]);

  const getMarkerIcon = (space: CurbsideSpace) => {
    const getColor = () => {
      switch (space.status) {
        case 'available': return '#10B981';
        case 'occupied': return '#EF4444';
        case 'reserved': return '#F59E0B';
        case 'scheduled': return '#3B82F6';
        case 'maintenance': return '#6B7280';
        default: return '#6B7280';
      }
    };

    const getIcon = () => {
      switch (space.type) {
        case 'parking': return '🚗';
        case 'last_mile_delivery': return '📦';
        case 'school_dropoff': return '🎓';
        case 'cycling': return '🚲';
        case 'trash_collection': return '🗑️';
        case 'loading': return '🚛';
        case 'pickup': return '🚕';
        default: return '📍';
      }
    };

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${getColor()}" stroke="#FFFFFF" stroke-width="2"/>
          <text x="20" y="26" text-anchor="middle" font-size="16">${getIcon()}</text>
          ${space.priority === 'emergency' ? '<circle cx="32" cy="8" r="6" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>' : ''}
        </svg>
      `),
      scaledSize: new google.maps.Size(40, 40),
    };
  };

  const createInfoWindowContent = (space: CurbsideSpace) => {
    return `
      <div style="max-width: 250px; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1F2937;">${space.location}</h3>
        <p style="margin: 0 0 4px 0; color: #6B7280; font-size: 14px;">${space.address}</p>
        <div style="display: flex; gap: 8px; margin: 8px 0;">
          <span style="background: ${space.status === 'available' ? '#D1FAE5' : '#FEE2E2'}; color: ${space.status === 'available' ? '#065F46' : '#991B1B'}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
            ${space.status.toUpperCase()}
          </span>
          <span style="background: #E5E7EB; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
            ${space.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <p style="margin: 4px 0; color: #374151; font-size: 14px;">
          <strong>Price:</strong> ${space.price === 0 ? 'Free' : `$${space.price}/hour`}
        </p>
        <p style="margin: 4px 0; color: #374151; font-size: 14px;">
          <strong>Max Duration:</strong> ${space.maxDuration} minutes
        </p>
        ${space.features.length > 0 ? `
          <p style="margin: 4px 0; color: #374151; font-size: 14px;">
            <strong>Features:</strong> ${space.features.join(', ')}
          </p>
        ` : ''}
      </div>
    `;
  };

  const calculateRoute = (destination: CurbsideSpace) => {
    if (!directionsService || !directionsRenderer || !userLocation) return;

    directionsService.route(
      {
        origin: userLocation,
        destination: destination.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: false,
        avoidHighways: false,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
        }
      }
    );
  };

  const handleRefreshData = () => {
    if (userLocation && map) {
      loadParkopediaData(userLocation, map);
      if (showEVChargers) {
        loadEnodeData(userLocation, map);
      }
    }
  };

  const toggleMapSize = () => {
    setIsExpanded(!isExpanded);
  };

  // Show loading state while getting location
  if (locationLoading) {
    return (
      <div className="relative h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center p-8">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Your Location</h3>
          <p className="text-gray-600">Please allow location access to show nearby spaces</p>
        </div>
      </div>
    );
  }

  // Show error message if API key is not configured
  if (mapError) {
    return (
      <div className="relative h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center p-8 max-w-md">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Maps Not Available</h3>
          <p className="text-gray-600 mb-4">{mapError}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-blue-900 mb-2">To enable Google Maps:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Get an API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>2. Enable the Maps JavaScript API</li>
              <li>3. Add <code className="bg-blue-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=your_api_key</code> to your .env file</li>
              <li>4. Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isExpanded ? 'fixed inset-0 z-50 p-4 bg-black bg-opacity-75' : 'h-full'}`}>
      <div ref={mapRef} className={`w-full ${isExpanded ? 'h-full' : 'h-full'} rounded-lg`} />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={toggleMapSize}
          className="flex items-center space-x-2 bg-white shadow-lg rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          <span>{isExpanded ? 'Exit Fullscreen' : 'Expand Map'}</span>
        </button>

        {selectedSpace && userLocation && (
          <button
            onClick={() => calculateRoute(selectedSpace)}
            className="flex items-center space-x-2 bg-white shadow-lg rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Navigation className="h-4 w-4" />
            <span>Get Directions</span>
          </button>
        )}

        <button
          onClick={handleRefreshData}
          className="flex items-center space-x-2 bg-white shadow-lg rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
        
        {showEVChargers && (
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="text-green-800 font-medium">EV Chargers</span>
          </div>
        )}
        
        {showTrafficLayer && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-red-800 font-medium">Live Traffic</span>
          </div>
        )}
        
        {showRouting && (
          <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
            <Route className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 font-medium">Smart Routing</span>
          </div>
        )}
      </div>

      {/* Current Location Info */}
      {userLocation && currentCity && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Your Location</span>
          </div>
          <div className="text-xs text-gray-600">
            <div>{currentCity}</div>
            <div>({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})</div>
          </div>
        </div>
      )}

      {/* Data Source Info */}
      {(parkopediaSpots.length > 0 || enodeChargers.length > 0) && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">Real-time Data</h4>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            {parkopediaSpots.length > 0 && (
              <div>Parkopedia spots: {parkopediaSpots.length}</div>
            )}
            {enodeChargers.length > 0 && (
              <div>Enode chargers: {enodeChargers.length}</div>
            )}
            <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
            {!parkopediaAPI.isRealApiAvailable() && (
              <div className="text-blue-600 mt-2">
                <Info className="h-3 w-3 inline mr-1" />
                Demo data shown
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      {map && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-3">Map Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Limited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
              <span>Your Location</span>
            </div>
            {showEVChargers && (
              <>
                <div className="flex items-center space-x-2 col-span-2">
                  <Zap className="h-3 w-3 text-green-600" />
                  <span>Parkopedia EV Charging</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Battery className="h-3 w-3 text-blue-600" />
                  <span>Enode EV Chargers</span>
                </div>
              </>
            )}
            {!parkopediaAPI.isRealApiAvailable() && (
              <div className="flex items-center space-x-2 col-span-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Demo Data</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close button for expanded map */}
      {isExpanded && (
        <button
          onClick={toggleMapSize}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Close Fullscreen Map
        </button>
      )}
    </div>
  );
};

// Global function for selecting a charger (called from info windows)
declare global {
  interface Window {
    selectCharger: (chargerId: string) => void;
  }
}

window.selectCharger = (chargerId: string) => {
  // This will be implemented by the parent component
  console.log('Selected charger:', chargerId);
  // Dispatch a custom event that can be listened to
  const event = new CustomEvent('chargerSelected', { detail: { chargerId } });
  window.dispatchEvent(event);
};

export default GoogleMapComponent;