import React, { useState, useEffect } from 'react';
import { MapPin, Bell, User, Settings, Crown, LogOut, ChevronDown, MessageSquare, HelpCircle, Globe, UserPlus, Users as UsersIcon, Moon, Sun } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getUserSubscription } from '../lib/stripe';
import { getProductByPriceId, formatPrice } from '../stripe-config';

interface HeaderProps {
  onSubscriptionClick: () => void;
  onLogout: () => void;
  onHomeClick: () => void;
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onSubscriptionClick, onLogout, onHomeClick, darkMode, onDarkModeChange }) => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [userCity, setUserCity] = useState('New York');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadUserData();
    detectUserLocation();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      try {
        const subscriptionData = await getUserSubscription();
        setSubscription(subscriptionData);
        
        if (subscriptionData?.price_id) {
          const product = getProductByPriceId(subscriptionData.price_id);
          setCurrentProduct(product);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      }
    }
  };

  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          
          // Use reverse geocoding to get city name
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await response.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Unknown City';
            setUserCity(city);
          } catch (error) {
            console.error('Error getting city name:', error);
            // Fallback to approximate city based on coordinates
            const cities = [
              { name: 'New York', lat: 40.7128, lng: -74.0060 },
              { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
              { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
              { name: 'Houston', lat: 29.7604, lng: -95.3698 },
              { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
              { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
            ];
            
            let closestCity = cities[0];
            let minDistance = Infinity;
            
            cities.forEach(city => {
              const distance = Math.sqrt(
                Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
              );
              if (distance < minDistance) {
                minDistance = distance;
                closestCity = city;
              }
            });
            
            setUserCity(closestCity.name);
          }
        },
        () => {
          setUserCity('New York (Default)');
        }
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    onLogout();
  };

  const handleSwitchAccount = () => {
    setShowSwitchAccount(true);
    setShowUserMenu(false);
  };

  const handleAccountSettings = () => {
    // Navigate to account settings
    alert('Account Settings functionality would be implemented here');
    setShowUserMenu(false);
  };

  const handleHelpSupport = () => {
    // Open help and support
    alert('Help & Support functionality would be implemented here');
    setShowUserMenu(false);
  };

  const getSubscriptionDisplay = () => {
    if (subscription && subscription.subscription_status === 'active' && currentProduct) {
      return {
        text: currentProduct.name,
        color: currentProduct.name === 'Free' ? 'bg-gray-50 text-gray-700' : 'bg-blue-50 text-blue-700',
        showUpgrade: currentProduct.name === 'Free'
      };
    }
    return {
      text: 'Free',
      color: 'bg-gray-50 text-gray-700',
      showUpgrade: true
    };
  };

  const subscriptionDisplay = getSubscriptionDisplay();

  const notifications = [
    {
      id: 1,
      title: 'New parking space available',
      message: 'Downtown Financial District has 3 new spots',
      time: '5 min ago',
      type: 'info',
      unread: true
    },
    {
      id: 2,
      title: 'Delivery zone congestion',
      message: 'High traffic in Business District delivery zones',
      time: '15 min ago',
      type: 'warning',
      unread: true
    },
    {
      id: 3,
      title: 'School zone update',
      message: 'Elementary School Main drop-off schedule changed',
      time: '1 hour ago',
      type: 'info',
      unread: false
    }
  ];

  const cityServices = {
    'New York': ['Parking Management', 'Subway Integration', 'Taxi Zones', 'Bike Share', 'Food Truck Permits'],
    'Los Angeles': ['Parking Meters', 'Metro Bus Integration', 'Beach Parking', 'Film Permit Zones', 'Food Truck Routes'],
    'Chicago': ['Winter Parking Rules', 'L Train Integration', 'Lakefront Parking', 'Festival Zones', 'Snow Route Management'],
    'Houston': ['Flood Zone Parking', 'Metro Rail Integration', 'Medical Center Zones', 'Energy Corridor Management', 'Port Authority Coordination'],
    'Phoenix': ['Desert Parking Solutions', 'Light Rail Integration', 'Heat Management Zones', 'Sports Event Coordination', 'Airport Shuttle Zones'],
    'Philadelphia': ['Historic District Parking', 'SEPTA Integration', 'University City Zones', 'Market Street Management', 'Independence Hall Coordination']
  };

  return (
    <>
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-6 py-4 relative`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onHomeClick}
              className={`flex items-center space-x-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-lg p-2 transition-colors`}
            >
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>SmartCurb</h1>
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-100'} px-2 py-1 rounded-full`}>
                Urban Space Management Platform
              </span>
              <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                <Globe className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">{userCity}</span>
                {userLocation && (
                  <span className="text-xs text-blue-500">
                    ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)})
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onSubscriptionClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                subscriptionDisplay.showUpgrade 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : `${subscriptionDisplay.color} hover:bg-opacity-80`
              }`}
            >
              <Crown className="h-4 w-4" />
              <span className="text-sm font-medium">
                {subscriptionDisplay.showUpgrade ? 'Upgrade' : subscriptionDisplay.text}
              </span>
            </button>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => onDarkModeChange(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-yellow-400 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-50`}>
                  <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} ${notification.unread ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : (darkMode ? 'bg-gray-600' : 'bg-gray-300')}`}></div>
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{notification.message}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                <Settings className="h-5 w-5" />
              </button>

              {showSettings && (
                <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-50`}>
                  <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Settings</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Auto-refresh</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dark mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={darkMode}
                          onChange={(e) => onDarkModeChange(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Advanced Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full px-3 py-2 transition-colors`}
              >
                <User className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-50`}>
                  <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email?.split('@')[0] || 'User'}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                        <p className="text-xs text-blue-600">{subscriptionDisplay.text} Plan</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={handleSwitchAccount}
                      className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-md flex items-center space-x-2`}
                    >
                      <UsersIcon className="h-4 w-4" />
                      <span>Switch Account</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowFeedbackForm(true);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-md flex items-center space-x-2`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Send Feedback</span>
                    </button>
                    <button 
                      onClick={handleHelpSupport}
                      className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-md flex items-center space-x-2`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </button>
                    <button 
                      onClick={handleAccountSettings}
                      className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-md flex items-center space-x-2`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                  
                  <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-3 py-2 text-sm text-red-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} rounded-md flex items-center space-x-2`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* City Services Banner */}
        <div className={`mt-3 p-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>{userCity} Services:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {cityServices[userCity as keyof typeof cityServices]?.slice(0, 3).map((service, index) => (
                <span key={index} className={`px-2 py-1 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-blue-100 text-blue-700'} rounded text-xs`}>
                  {service}
                </span>
              ))}
              <span className={`px-2 py-1 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-blue-100 text-blue-700'} rounded text-xs`}>
                +{(cityServices[userCity as keyof typeof cityServices]?.length || 0) - 3} more
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Switch Account Modal */}
      {showSwitchAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full mx-4`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Switch Account</h3>
                <button 
                  onClick={() => setShowSwitchAccount(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className={`p-4 border ${darkMode ? 'border-blue-600 bg-gray-700' : 'border-blue-200 bg-blue-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>{user?.email?.split('@')[0] || 'Current User'}</p>
                      <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{user?.email}</p>
                      <span className={`text-xs ${darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'} px-2 py-1 rounded`}>Current</span>
                    </div>
                  </div>
                </div>
                
                <button className={`w-full p-4 border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'} rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                  <UserPlus className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Add Another Account</span>
                </button>
              </div>
              
              <div className={`flex space-x-3 pt-4 mt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowSwitchAccount(false)}
                  className={`flex-1 px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSwitchAccount(false);
                    handleLogout();
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Out & Switch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full mx-4`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Send Feedback</h3>
                <button 
                  onClick={() => setShowFeedbackForm(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ×
                </button>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                alert('Feedback submitted successfully!');
                setShowFeedbackForm(false);
              }}>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Feedback Type
                  </label>
                  <select className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}>
                    <option>General Feedback</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Service Complaint</option>
                    <option>Service Improvement</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Subject
                  </label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Brief description of your feedback"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Message
                  </label>
                  <textarea 
                    rows={4}
                    className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Please provide detailed feedback to help us improve our service..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="anonymous" className="rounded" />
                  <label htmlFor="anonymous" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Submit anonymously
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className={`flex-1 px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showNotifications || showSettings || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowSettings(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Header;