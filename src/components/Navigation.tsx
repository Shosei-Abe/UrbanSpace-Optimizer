import React from 'react';
import { BarChart3, Map, Calendar, Settings, Users, Car, Zap, GraduationCap, Bike, Trash2, Truck, AlertTriangle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, darkMode }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'parking-ev', label: 'Parking + EV', icon: Zap },
    { id: 'school-drop', label: 'School Drop-off', icon: GraduationCap },
    { id: 'cycling', label: 'Cycling', icon: Bike },
    { id: 'trash-collection', label: 'Waste Collection', icon: Trash2 },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'congestion', label: 'Traffic', icon: AlertTriangle },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
      <div className="px-6">
        <div className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;