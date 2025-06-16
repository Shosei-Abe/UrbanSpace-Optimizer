import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthPage from './components/auth/AuthPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SpaceMap from './components/SpaceMap';
import BookingManager from './components/BookingManager';
import SubscriptionPage from './components/subscription/SubscriptionPage';
import SubscriptionSuccess from './components/subscription/SubscriptionSuccess';
import HeroPage from './components/HeroPage';
import ParkingTab from './components/specialized/ParkingTab';
import ParkingEVTab from './components/specialized/ParkingEVTab';
import CongestionTab from './components/specialized/CongestionTab';
import SchoolDropoffTab from './components/specialized/SchoolDropoffTab';
import CyclingTab from './components/specialized/CyclingTab';
import WasteCollectionTab from './components/specialized/WasteCollectionTab';
import DeliveryTab from './components/specialized/DeliveryTab';
import UsersTab from './components/specialized/UsersTab';
import SettingsTab from './components/specialized/SettingsTab';
import { mockSpaces, mockBookings, mockAnalytics } from './data/mockData';
import { CurbsideSpace } from './types';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [currentView, setCurrentView] = useState<'hero' | 'main' | 'subscription' | 'success'>('hero');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentView('main');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentView('main');
      } else {
        setCurrentView('hero');
      }
    });

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Check for success URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setCurrentView('success');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAuthSuccess = () => {
    setCurrentView('main');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('hero');
    setActiveTab('dashboard');
  };

  const handleSpaceSelect = (space: CurbsideSpace) => {
    setSelectedSpace(space);
  };

  const handleSubscriptionClick = () => {
    setCurrentView('subscription');
  };

  const handleBackToDashboard = () => {
    setCurrentView('main');
  };

  const handleHomeClick = () => {
    if (user) {
      setCurrentView('main');
      setActiveTab('dashboard');
    } else {
      setCurrentView('hero');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('main');
      setActiveTab('dashboard');
    } else {
      setCurrentView('main'); // This will show the auth page
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard analytics={mockAnalytics} />;
      case 'map':
        return <SpaceMap spaces={mockSpaces} onSpaceSelect={handleSpaceSelect} />;
      case 'parking':
        return <ParkingTab spaces={mockSpaces} />;
      case 'parking-ev':
        return <ParkingEVTab spaces={mockSpaces} />;
      case 'school-drop':
        return <SchoolDropoffTab spaces={mockSpaces} />;
      case 'cycling':
        return <CyclingTab spaces={mockSpaces} />;
      case 'trash-collection':
        return <WasteCollectionTab spaces={mockSpaces} />;
      case 'delivery':
        return <DeliveryTab spaces={mockSpaces} />;
      case 'congestion':
        return <CongestionTab spaces={mockSpaces} />;
      case 'bookings':
        return <BookingManager bookings={mockBookings} />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab darkMode={darkMode} onDarkModeChange={setDarkMode} />;
      default:
        return <Dashboard analytics={mockAnalytics} />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-600'} mx-auto mb-4`}></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'hero') {
    return <HeroPage onGetStarted={handleGetStarted} />;
  }

  if (!user && currentView === 'main') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'subscription') {
    return <SubscriptionPage onBack={handleBackToDashboard} />;
  }

  if (currentView === 'success') {
    return <SubscriptionSuccess onContinue={handleBackToDashboard} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        onSubscriptionClick={handleSubscriptionClick} 
        onLogout={handleLogout}
        onHomeClick={handleHomeClick}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
      />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />
      <main className="max-w-7xl mx-auto py-8 px-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;