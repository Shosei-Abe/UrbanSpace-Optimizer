import React from 'react';
import { MapPin, Car, Package, GraduationCap, Bike, Trash2, Truck, Zap, Shield, TrendingUp, Users, Globe, ArrowRight, CheckCircle } from 'lucide-react';

interface HeroPageProps {
  onGetStarted: () => void;
}

const HeroPage: React.FC<HeroPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Car,
      title: 'Smart Parking',
      description: 'Real-time parking availability with EV charging integration',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Package,
      title: 'Delivery Zones',
      description: 'Optimized last-mile delivery and loading zone management',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: GraduationCap,
      title: 'School Drop-off',
      description: 'Safe and efficient student transportation zones',
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      icon: Bike,
      title: 'Cycling Infrastructure',
      description: 'Bike parking, routes, and sharing station management',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Trash2,
      title: 'Waste Collection',
      description: 'Municipal waste collection scheduling and tracking',
      color: 'bg-gray-50 text-gray-600'
    },
    {
      icon: Truck,
      title: 'Traffic Management',
      description: 'Real-time congestion monitoring and route optimization',
      color: 'bg-red-50 text-red-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Managed Spaces', icon: MapPin },
    { number: '200+', label: 'Cities Served', icon: Globe },
    { number: '1M+', label: 'Daily Users', icon: Users },
    { number: '99.9%', label: 'Uptime', icon: TrendingUp }
  ];

  const benefits = [
    'Reduce traffic congestion by up to 30%',
    'Increase parking efficiency by 40%',
    'Improve air quality through smart routing',
    'Enhance public safety in school zones',
    'Optimize delivery operations',
    'Real-time data and analytics'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <MapPin className="h-12 w-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">SmartCurb</h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Future of Urban Space Management
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your city with intelligent curbside management. From parking to deliveries, 
              school zones to cycling infrastructure - manage it all with real-time data and smart automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-blue-600 mr-2" />
                    <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Urban Solutions
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform integrates all aspects of urban space management into one powerful, 
              easy-to-use system that adapts to your city's unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Proven Results for Modern Cities
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of cities worldwide that have transformed their urban mobility 
                with SmartCurb's intelligent management platform.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">30%</div>
                    <div className="text-blue-100">Less Congestion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">40%</div>
                    <div className="text-blue-100">More Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">25%</div>
                    <div className="text-blue-100">Reduced Emissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">60%</div>
                    <div className="text-blue-100">Faster Response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powered by Advanced Technology
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform leverages cutting-edge technology to provide real-time insights, 
              predictive analytics, and seamless integration with existing city infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time Processing</h4>
              <p className="text-gray-600">
                Process millions of data points in real-time to provide instant updates and insights.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h4>
              <p className="text-gray-600">
                Bank-level security with end-to-end encryption and compliance with global standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Predictive Analytics</h4>
              <p className="text-gray-600">
                AI-powered predictions help optimize space utilization and prevent congestion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your City?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join the smart city revolution and start optimizing your urban spaces today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;