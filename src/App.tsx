import { useState, useEffect } from 'react';
import { useAuth, useUser, SignIn, SignUp } from '@clerk/clerk-react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HeroPage from './components/HeroPage';
import Dashboard from './components/Dashboard';
import SubscriptionPage from './components/subscription/SubscriptionPage';
import SubscriptionSuccess from './components/subscription/SubscriptionSuccess';
import ParkingTab from './components/specialized/ParkingTab';
import ParkingEVTab from './components/specialized/ParkingEVTab';
import DeliveryTab from './components/specialized/DeliveryTab';
import SchoolDropoffTab from './components/specialized/SchoolDropoffTab';
import CyclingTab from './components/specialized/CyclingTab';
import WasteCollectionTab from './components/specialized/WasteCollectionTab';
import CongestionTab from './components/specialized/CongestionTab';
import UsersTab from './components/specialized/UsersTab';
import SettingsTab from './components/specialized/SettingsTab';
import { CurbsideSpace } from './types';
import { mockSpaces, mockAnalytics } from './data/mockData';

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSpace, setSelectedSpace] = useState<CurbsideSpace | null>(null);
  const [currentView, setCurrentView] = useState('main');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setCurrentView('success');
    }
  }, []);

  const handleAuthSuccess = () => {
    setCurrentView('main');
  };

  const handleLogout = () => {
    setCurrentView('hero');
  };

  const handleBackToDashboard = () => {
    setCurrentView('main');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'parking':
        return <ParkingTab spaces={mockSpaces} />;
      case 'parking-ev':
        return <ParkingEVTab spaces={mockSpaces} />;
      case 'delivery':
        return <DeliveryTab spaces={mockSpaces} />;
      case 'school':
        return <SchoolDropoffTab spaces={mockSpaces} />;
      case 'cycling':
        return <CyclingTab spaces={mockSpaces} />;
      case 'waste':
        return <WasteCollectionTab spaces={mockSpaces} />;
      case 'congestion':
        return <CongestionTab spaces={mockSpaces} />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab darkMode={darkMode} onDarkModeChange={setDarkMode} />;
      default:
        return <Dashboard analytics={mockAnalytics} />;
    }
  };

  if (!isLoaded) {
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
    return <HeroPage onGetStarted={handleAuthSuccess} />;
  }

  if (!isSignedIn && currentView === 'main') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to SmartCurb</h2>
            <p className="mt-2 text-gray-600">Please sign in to continue</p>
          </div>
          <SignIn routing="path" path="/sign-in" />
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('signup')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    );
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
        onLogout={handleLogout}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
        onSubscriptionClick={() => setCurrentView('subscription')}
        onHomeClick={() => setCurrentView('main')}
      />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;