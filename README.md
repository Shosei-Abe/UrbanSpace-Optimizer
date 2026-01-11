# Friction - Impulse Guard

Friction is a comprehensive financial wellness platform designed to help users curb impulse spending and gain better control over their finances. It combines a Chrome Extension for real-time shopping interventions with a powerful Web Dashboard for financial tracking.

## Features

- **Impulse Control (Chrome Extension)**: Intervenes on major shopping sites (Amazon, Temu, Shein, AliExpress) to encourage mindful spending.
- **Financial Dashboard**: View your transaction history and account balances in one place.
- **Bank Integration**: Securely connect your bank accounts using Plaid.
- **Subscription Management**: Track and manage your recurring subscriptions.
- **AI Coach**: Interactive voice-enabled Impulse Control Coach powered by ElevenLabs.
- **Payments**: Integrated Stripe payments for premium features.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Payments**: Stripe
- **Banking API**: Plaid
- **AI/Voice**: ElevenLabs
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Friction_antigravity
   ```

2. Navigate to the app directory:
   ```bash
   cd friction-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in the required API keys (Clerk, Plaid, Stripe, ElevenLabs).
   ```bash
   cp .env.example .env.local
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked".
4. Select the `extension` directory located at `friction-app/extension`.
5. The Friction extension is now active on supported shopping sites.

## Project Structure

- `friction-app/`: Main web application code.
  - `src/`: Source code (components, pages, api routes).
  - `extension/`: Chrome Extension source code.
