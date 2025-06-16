import React from 'react';
import { Info, Zap, MapPin, Clock, ExternalLink } from 'lucide-react';
import { parkopediaAPI } from '../lib/parkopedia';

interface ParkingDataInfoProps {
  className?: string;
}

const ParkingDataInfo: React.FC<ParkingDataInfoProps> = ({ className = '' }) => {
  const dataSourceInfo = parkopediaAPI.getDataSourceInfo();
  const isRealApi = parkopediaAPI.isRealApiAvailable();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Parking Data Source</h3>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isRealApi ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
          <span className={`text-sm font-medium ${isRealApi ? 'text-green-600' : 'text-blue-600'}`}>
            {isRealApi ? 'Live Data' : 'Demo Mode'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">{dataSourceInfo.source}</p>
            <p className="text-sm text-gray-600">{dataSourceInfo.description}</p>
          </div>
        </div>

        {isRealApi ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Real-time Features Active</span>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Live parking availability</li>
              <li>• Real-time pricing updates</li>
              <li>• EV charging station status</li>
              <li>• Accurate location data</li>
            </ul>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Enhanced Demo Data</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1 mb-3">
              <li>• Realistic parking scenarios</li>
              <li>• Time-based availability simulation</li>
              <li>• EV charging station demos</li>
              <li>• Location-aware pricing</li>
            </ul>
            
            <div className="border-t border-blue-200 pt-3">
              <p className="text-sm font-medium text-blue-900 mb-2">To enable live data:</p>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Get a Parkopedia API key from their developer portal</li>
                <li>2. Add <code className="bg-blue-100 px-1 rounded text-xs">VITE_PARKOPEDIA_API_KEY=your_key</code> to .env</li>
                <li>3. Restart the development server</li>
              </ol>
              <a 
                href="https://developer.parkopedia.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                <span>Get Parkopedia API Key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Updates every 30 seconds</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>1km radius</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDataInfo;