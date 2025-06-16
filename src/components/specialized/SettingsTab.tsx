import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, MapPin, Clock, Users, Database, Palette, Globe, Key, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsTabProps {
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ darkMode, onDarkModeChange }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [originalSettings, setOriginalSettings] = useState<any>(null);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'SmartCurb',
      timezone: 'America/New_York',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      bookingReminders: true,
      systemAlerts: true,
      weeklyReports: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: '',
    },
    maps: {
      defaultZoom: 13,
      mapStyle: 'standard',
      showTraffic: true,
      showTransit: false,
      clusterMarkers: true,
      autoRefresh: 30,
    },
    booking: {
      maxBookingDuration: 480,
      advanceBookingDays: 30,
      cancellationWindow: 60,
      autoConfirm: true,
      requirePayment: false,
    },
    appearance: {
      theme: darkMode ? 'dark' : 'light',
      primaryColor: '#2563EB',
      compactMode: false,
      showAnimations: true,
    },
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Store original settings for comparison
  useEffect(() => {
    if (!originalSettings) {
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, []);

  // Check for changes
  useEffect(() => {
    if (originalSettings) {
      const settingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(settingsChanged);
    }
  }, [settings, originalSettings]);

  // Apply settings effects
  useEffect(() => {
    // Apply language
    document.documentElement.lang = settings.general.language;
    
    // Apply date format
    const dateFormat = settings.general.dateFormat;
    if (dateFormat) {
      // This would normally update date formatting throughout the app
      console.log(`Date format set to: ${dateFormat}`);
    }
    
    // Apply currency
    const currency = settings.general.currency;
    if (currency) {
      // This would normally update currency formatting throughout the app
      console.log(`Currency set to: ${currency}`);
    }
    
    // Apply timezone
    const timezone = settings.general.timezone;
    if (timezone) {
      // This would normally update timezone throughout the app
      console.log(`Timezone set to: ${timezone}`);
    }
    
    // Apply theme
    if (settings.appearance.theme === 'dark') {
      onDarkModeChange(true);
    } else if (settings.appearance.theme === 'light') {
      onDarkModeChange(false);
    }
    
    // Apply primary color
    document.documentElement.style.setProperty('--primary-color', settings.appearance.primaryColor);
    
    // Apply animations
    if (settings.appearance.showAnimations) {
      document.documentElement.classList.remove('no-animations');
    } else {
      document.documentElement.classList.add('no-animations');
    }
    
    // Apply compact mode
    if (settings.appearance.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  }, [settings.general.language, settings.general.dateFormat, settings.general.currency, 
      settings.general.timezone, settings.appearance.theme, settings.appearance.primaryColor, 
      settings.appearance.showAnimations, settings.appearance.compactMode, onDarkModeChange]);

  const sections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'maps', name: 'Maps', icon: MapPin },
    { id: 'booking', name: 'Booking', icon: Clock },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));

    // Clear any previous messages
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSave = async () => {
    // Clear any previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save settings to localStorage for persistence
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply theme changes
      if (settings.appearance.theme === 'dark') {
        onDarkModeChange(true);
      } else if (settings.appearance.theme === 'light') {
        onDarkModeChange(false);
      }
      
      // Update original settings to reflect saved state
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      
      // Show success message
      setSuccessMessage('Settings saved successfully!');
      setSaveStatus('saved');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
      setSaveStatus('error');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      // Reset to defaults
      const defaultSettings = {
        general: {
          siteName: 'SmartCurb',
          timezone: 'America/New_York',
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          currency: 'USD',
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          bookingReminders: true,
          systemAlerts: true,
          weeklyReports: true,
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
          loginAttempts: 5,
          ipWhitelist: '',
        },
        maps: {
          defaultZoom: 13,
          mapStyle: 'standard',
          showTraffic: true,
          showTransit: false,
          clusterMarkers: true,
          autoRefresh: 30,
        },
        booking: {
          maxBookingDuration: 480,
          advanceBookingDays: 30,
          cancellationWindow: 60,
          autoConfirm: true,
          requirePayment: false,
        },
        appearance: {
          theme: 'light',
          primaryColor: '#2563EB',
          compactMode: false,
          showAnimations: true,
        },
      };
      
      setSettings(defaultSettings);
      
      // Apply theme
      onDarkModeChange(false);
      
      // Show success message
      setSuccessMessage('Settings have been reset to defaults');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Site Name</label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
          className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">GMT</option>
            <option value="Europe/Paris">CET</option>
            <option value="Europe/Budapest">CET (Budapest)</option>
            <option value="Asia/Tokyo">JST</option>
            <option value="Australia/Sydney">AEST</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Language</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hu">Hungarian</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Date Format</label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="YYYY.MM.DD">YYYY.MM.DD</option>
            <option value="DD.MM.YYYY">DD.MM.YYYY</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="HUF">HUF (Ft)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'pushNotifications' && 'Browser push notifications'}
                {key === 'smsNotifications' && 'SMS text message notifications'}
                {key === 'bookingReminders' && 'Reminders for upcoming bookings'}
                {key === 'systemAlerts' && 'Important system notifications'}
                {key === 'weeklyReports' && 'Weekly usage and analytics reports'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-blue-900'} mb-2`}>Notification Preferences</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
          You can customize which specific notifications you receive in each category by clicking the button below.
        </p>
        <button 
          onClick={() => alert('Advanced notification preferences would open here')}
          className={`mt-3 px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} rounded-lg transition-colors text-sm`}
        >
          Advanced Notification Settings
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Two-Factor Authentication</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add an extra layer of security to your account</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Session Timeout (minutes)</label>
          <input
            type="number"
            min="5"
            max="240"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Time before automatic logout due to inactivity
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Password Expiry (days)</label>
          <input
            type="number"
            min="0"
            max="365"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Set to 0 to disable password expiry
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Max Login Attempts</label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.security.loginAttempts}
            onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Number of failed attempts before account lockout
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>IP Whitelist</label>
          <input
            type="text"
            value={settings.security.ipWhitelist}
            onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
            placeholder="192.168.1.1, 10.0.0.1"
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Comma-separated list of allowed IP addresses
          </p>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
        <div className="flex items-start space-x-3">
          <Shield className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mt-0.5`} />
          <div>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-yellow-800'}`}>Security Recommendations</h4>
            <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-yellow-700'} mt-2 space-y-1`}>
              <li>• Enable two-factor authentication for enhanced security</li>
              <li>• Set a reasonable session timeout (15-30 minutes recommended)</li>
              <li>• Use IP whitelisting for sensitive accounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMapsSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Default Zoom Level</label>
          <input
            type="range"
            min="10"
            max="18"
            value={settings.maps.defaultZoom}
            onChange={(e) => handleSettingChange('maps', 'defaultZoom', parseInt(e.target.value))}
            className="w-full"
          />
          <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            <span>City</span>
            <span>{settings.maps.defaultZoom}</span>
            <span>Street</span>
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Map Style</label>
          <select
            value={settings.maps.mapStyle}
            onChange={(e) => handleSettingChange('maps', 'mapStyle', e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="standard">Standard</option>
            <option value="satellite">Satellite</option>
            <option value="hybrid">Hybrid</option>
            <option value="terrain">Terrain</option>
            <option value="night">Night Mode</option>
            <option value="retro">Retro</option>
            <option value="silver">Silver</option>
          </select>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Visual style of the map
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Auto Refresh (seconds)</label>
          <select
            value={settings.maps.autoRefresh}
            onChange={(e) => handleSettingChange('maps', 'autoRefresh', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={300}>5 minutes</option>
            <option value={0}>Disabled</option>
          </select>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            How often map data refreshes automatically
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Default Location</label>
          <select
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            onChange={() => alert('Location selection would be implemented here')}
          >
            <option value="current">Current Location</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
            <option value="houston">Houston</option>
            <option value="custom">Custom Location</option>
          </select>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Default center location when map loads
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'showTraffic', label: 'Show Traffic Layer', desc: 'Display real-time traffic information' },
          { key: 'showTransit', label: 'Show Transit Layer', desc: 'Display public transportation routes' },
          { key: 'clusterMarkers', label: 'Cluster Markers', desc: 'Group nearby markers for better performance' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maps[key as keyof typeof settings.maps] as boolean}
                onChange={(e) => handleSettingChange('maps', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        <div className="flex items-start space-x-3">
          <MapPin className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5`} />
          <div>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-blue-900'}`}>Map Data Sources</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-700'} mt-1`}>
              Configure which data sources are used for map information
            </p>
            <button 
              onClick={() => alert('Map data sources configuration would open here')}
              className={`mt-3 px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} rounded-lg transition-colors text-sm`}
            >
              Configure Data Sources
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Max Booking Duration (minutes)</label>
          <input
            type="number"
            min="15"
            max="1440"
            value={settings.booking.maxBookingDuration}
            onChange={(e) => handleSettingChange('booking', 'maxBookingDuration', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Maximum time a space can be booked (1440 = 24 hours)
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Advance Booking (days)</label>
          <input
            type="number"
            min="1"
            max="90"
            value={settings.booking.advanceBookingDays}
            onChange={(e) => handleSettingChange('booking', 'advanceBookingDays', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            How far in advance bookings can be made
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Cancellation Window (minutes)</label>
          <input
            type="number"
            min="0"
            max="1440"
            value={settings.booking.cancellationWindow}
            onChange={(e) => handleSettingChange('booking', 'cancellationWindow', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Time before booking start when cancellation is allowed
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Booking Buffer (minutes)</label>
          <input
            type="number"
            min="0"
            max="60"
            defaultValue={15}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Time between consecutive bookings
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'autoConfirm', label: 'Auto-Confirm Bookings', desc: 'Automatically confirm bookings without manual approval' },
          { key: 'requirePayment', label: 'Require Payment', desc: 'Require payment before confirming bookings' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.booking[key as keyof typeof settings.booking] as boolean}
                onChange={(e) => handleSettingChange('booking', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Allow Recurring Bookings</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enable users to set up recurring bookings</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={true}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
        <div className="flex items-start space-x-3">
          <Clock className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'} mt-0.5`} />
          <div>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-green-900'}`}>Booking Rules</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-green-700'} mt-1`}>
              Configure advanced booking rules and restrictions
            </p>
            <button 
              onClick={() => alert('Booking rules configuration would open here')}
              className={`mt-3 px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-green-600 hover:bg-green-700 text-white'} rounded-lg transition-colors text-sm`}
            >
              Configure Booking Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Theme</label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Choose between light and dark mode
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Primary Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className="w-10 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className={`flex-1 px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="#2563EB">Blue</option>
              <option value="#10B981">Green</option>
              <option value="#8B5CF6">Purple</option>
              <option value="#EF4444">Red</option>
              <option value="#F59E0B">Orange</option>
              <option value="#6B7280">Gray</option>
              <option value="#000000">Custom</option>
            </select>
          </div>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Main accent color for buttons and interactive elements
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'compactMode', label: 'Compact Mode', desc: 'Use smaller spacing and components' },
          { key: 'showAnimations', label: 'Show Animations', desc: 'Enable smooth transitions and animations' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance[key as keyof typeof settings.appearance] as boolean}
                onChange={(e) => handleSettingChange('appearance', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>High Contrast Mode</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Increase contrast for better accessibility</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={false}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
        <div className="flex items-start space-x-3">
          <Palette className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'} mt-0.5`} />
          <div>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-purple-900'}`}>Custom Theme</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-purple-700'} mt-1`}>
              Create and apply a fully customized theme
            </p>
            <button 
              onClick={() => alert('Theme customization would open here')}
              className={`mt-3 px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'} rounded-lg transition-colors text-sm`}
            >
              Customize Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'maps': return renderMapsSettings();
      case 'booking': return renderBookingSettings();
      case 'appearance': return renderAppearanceSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Configure your platform preferences</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleReset}
            className={`flex items-center space-x-2 px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || !hasChanges}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              saveStatus === 'saved' 
                ? 'bg-green-600 text-white' 
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saveStatus === 'saving' && <RefreshCw className="h-4 w-4 animate-spin" />}
            {saveStatus === 'saved' && <CheckCircle className="h-4 w-4" />}
            {saveStatus === 'error' && <AlertCircle className="h-4 w-4" />}
            {saveStatus === 'idle' && <Save className="h-4 w-4" />}
            <span>
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && 'Saved!'}
              {saveStatus === 'error' && 'Error!'}
              {saveStatus === 'idle' && (hasChanges ? 'Save Changes' : 'No Changes')}
            </span>
          </button>
        </div>
      </div>

      {/* Status messages */}
      {successMessage && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800 text-green-100' : 'bg-green-50 text-green-800'} flex items-center space-x-2`}>
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {errorMessage && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-800 text-red-100' : 'bg-red-50 text-red-800'} flex items-center space-x-2`}>
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? darkMode 
                        ? 'bg-blue-900 text-blue-100 border border-blue-800' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} capitalize`}>
                {activeSection} Settings
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Configure your {activeSection} preferences and options.
              </p>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;