# SmartCurb - Urban Space Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49.1-green.svg)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Transform your city with intelligent curbside management. From parking to deliveries, school zones to cycling infrastructure - manage it all with real-time data and smart automation.

## 🌟 Features

### 🚗 **Smart Parking Management**
- Real-time parking availability with EV charging integration
- Dynamic pricing and reservation system
- Integration with Parkopedia API for live parking data
- Support for multiple vehicle types and accessibility features

### ⚡ **EV Charging Integration**
- Real-time EV charger status via Enode API
- Battery monitoring and charging control
- Route optimization to nearest charging stations
- Support for multiple charging networks

### 📦 **Last-Mile Delivery Optimization**
- Dedicated delivery zones with time-based restrictions
- Package locker integration and security features
- Route optimization for delivery vehicles
- Real-time tracking and scheduling

### 🎓 **School Drop-off Management**
- Safe student transportation zones
- Time-restricted access during school hours
- Parent notification system
- Emergency contact integration

### 🚲 **Cycling Infrastructure**
- Bike parking and sharing station management
- E-bike charging stations
- Route planning and safety features
- Integration with bike share systems

### 🗑️ **Waste Collection Scheduling**
- Municipal waste collection tracking
- Route optimization for garbage trucks
- Recycling and organic waste separation
- Real-time collection status updates

### 📊 **Advanced Analytics**
- Real-time occupancy monitoring
- Revenue tracking and reporting
- Peak hour analysis
- Space utilization optimization

### 💳 **Subscription Management**
- Stripe integration for payments
- Multiple subscription tiers
- Usage-based billing
- Enterprise features

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **TypeScript 5.5.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite 5.4.2** - Fast build tool

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust database with RLS
- **Edge Functions** - Serverless API endpoints

### Integrations
- **Google Maps API** - Interactive mapping
- **Parkopedia API** - Real-time parking data
- **Enode API** - EV charger integration
- **Stripe** - Payment processing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Maps API key
- (Optional) Parkopedia API key
- (Optional) Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shosei-Abe/UrbanSpace-Optimizer.git
   cd UrbanSpace-Optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Configure your environment variables in `.env`:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Google Maps API Key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Parkopedia API Key (Optional)
   VITE_PARKOPEDIA_API_KEY=your_parkopedia_api_key

   # Stripe Configuration (Optional)
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Database Setup**
   
   The database schema is automatically set up when you connect to Supabase. The migration files in `supabase/migrations/` will create all necessary tables and security policies.

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🔧 Configuration

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Maps JavaScript API
4. Create credentials (API key)
5. Add the API key to your `.env` file

### Parkopedia API Setup (Optional)
1. Visit [Parkopedia Developer Portal](https://developer.parkopedia.com/)
2. Sign up for an API key
3. Add the key to your `.env` file
4. Without this key, the app uses enhanced mock data

### Enode API Setup (Optional)
The app includes pre-configured sandbox credentials for Enode API. For production use:
1. Sign up at [Enode](https://www.enode.io/)
2. Get your production credentials
3. Update the Edge Function configuration

### Stripe Setup (Optional)
1. Create a [Stripe account](https://stripe.com/)
2. Get your publishable key from the dashboard
3. Configure webhook endpoints for subscription management
4. Add the key to your `.env` file

## 📱 Usage

### Getting Started
1. **Sign Up/Login**: Create an account or sign in
2. **Explore Dashboard**: View real-time analytics and space utilization
3. **Browse Map**: Use the interactive map to find available spaces
4. **Make Reservations**: Book parking spots or delivery zones
5. **Manage Subscriptions**: Upgrade to access premium features

### Key Features
- **Real-time Map**: View live availability of all space types
- **Smart Filtering**: Filter by space type, availability, and features
- **Booking System**: Reserve spaces with flexible duration options
- **EV Integration**: Find and control EV charging stations
- **Analytics Dashboard**: Monitor usage patterns and revenue
- **Multi-language Support**: Available in multiple languages
- **Dark Mode**: Toggle between light and dark themes

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── maps/            # Map-related components
│   ├── specialized/     # Feature-specific components
│   └── subscription/    # Stripe subscription components
├── lib/                 # Utility libraries
│   ├── enode.ts        # EV charger API integration
│   ├── parkopedia.ts   # Parking data API
│   ├── stripe.ts       # Payment processing
│   └── supabase.ts     # Database client
├── data/               # Mock data and types
├── types/              # TypeScript type definitions
└── stripe-config.ts    # Stripe product configuration

supabase/
├── functions/          # Edge Functions
│   ├── enode-proxy/    # EV API proxy
│   ├── stripe-checkout/ # Payment processing
│   └── stripe-webhook/ # Webhook handling
└── migrations/         # Database migrations
```

## 🌐 API Integration

### Parkopedia Integration
- **Real-time Data**: Live parking availability and pricing
- **EV Charging**: Electric vehicle charging station information
- **Fallback System**: Enhanced mock data when API is unavailable

### Enode Integration
- **Vehicle Monitoring**: Real-time battery levels and charging status
- **Charger Control**: Start/stop charging remotely
- **Location Services**: Find nearby charging stations

### Google Maps Integration
- **Interactive Maps**: Real-time space visualization
- **Route Planning**: Optimized directions to selected spaces
- **Traffic Data**: Live traffic information overlay

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy with automatic CI/CD

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/Shosei-Abe/UrbanSpace-Optimizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Shosei-Abe/UrbanSpace-Optimizer/discussions)
- **Email**: [Contact Developer](mailto:your-email@example.com)

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] IoT sensor integration
- [ ] Machine learning for demand prediction
- [ ] Multi-city deployment
- [ ] Advanced reporting dashboard
- [ ] API for third-party integrations

## 🏆 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [Parkopedia](https://parkopedia.com/) for parking data API
- [Enode](https://enode.io/) for EV integration
- [Google Maps](https://developers.google.com/maps) for mapping services
- [Stripe](https://stripe.com/) for payment processing

---

**Built with ❤️ for smarter cities**

[⬆ Back to top](#smartcurb---urban-space-management-platform)
