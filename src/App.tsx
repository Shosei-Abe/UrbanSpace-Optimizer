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
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'hero' | 'main' | 'subscription' | 'success' | 'auth'>('hero');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);

    // Check URL parameters for success state
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setCurrentView('success');
    }

    // If user is signed in, show main app
    if (isSignedIn) {
      setCurrentView('main');
    }
  }, [isSignedIn]);

  const handleAuthSuccess = () => {
    setCurrentView('main');
    setActiveTab('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentView('main');
    setActiveTab('dashboard');
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard analytics={mockAnalytics} />;
      case 'parking':
        return <ParkingTab spaces={mockSpaces} />;
      case 'parking-ev':
        return <ParkingEVTab spaces={mockSpaces} />;
      case 'delivery':
        return <DeliveryTab spaces={mockSpaces} />;
      case 'school-drop':
        return <SchoolDropoffTab spaces={mockSpaces} />;
      case 'cycling':
        return <CyclingTab spaces={mockSpaces} />;
      case 'trash-collection':
        return <WasteCollectionTab spaces={mockSpaces} />;
      case 'congestion':
        return <CongestionTab spaces={mockSpaces} />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab darkMode={darkMode} onDarkModeChange={handleDarkModeToggle} />;
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

  // If user is signed in, show main app
  if (isSignedIn) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Header 
          onSubscriptionClick={() => setCurrentView('subscription')}
          onLogout={() => setCurrentView('hero')}
          onHomeClick={() => {
            setCurrentView('main');
            setActiveTab('dashboard');
          }}
          darkMode={darkMode}
          onDarkModeChange={handleDarkModeToggle}
        />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    );
  }

  // Show Hero page for non-authenticated users
  if (currentView === 'hero') {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <HeroPage onGetStarted={() => setCurrentView('auth')} />
      </div>
    );
  }

  // Show Auth page for non-authenticated users
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to SmartCurb</h2>
            <p className="mt-2 text-gray-600">
              {authMode === 'sign-in' ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>
          <div className="space-y-6">
            {authMode === 'sign-in' ? (
              <SignIn 
                routing="path" 
                path="/sign-in" 
                afterSignInUrl="/"
                redirectUrl="/"
                signUpUrl="/sign-up"
              />
            ) : (
              <SignUp 
                routing="path" 
                path="/sign-up" 
                afterSignUpUrl="/"
                redirectUrl="/"
                signInUrl="/sign-in"
              />
            )}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {authMode === 'sign-in' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {authMode === 'sign-in' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
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

  // Default to Hero page
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <HeroPage onGetStarted={() => setCurrentView('auth')} />
    </div>
  );
}

export default App;