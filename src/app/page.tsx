import Link from "next/link";
import { ElevenLabsClient } from "@/components/ElevenLabsClient";
import { Shield, Landmark, Puzzle, Lightbulb, Check, Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fadeIn">
          <div className="badge badge-info mb-lg gap-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Shield size={16} /> Your spending companion
          </div>

          <h1>Stop impulse buys before they hit your card</h1>

          <p>
            Connect your bank, see your subscriptions, and get nudged before you buy.
            Take control of your spending habits with friendly, non-judgmental guidance.
          </p>

          <div className="flex gap-md justify-center flex-wrap">
            <Link href="/sign-up" className="btn btn-primary btn-lg">
              Get started free
            </Link>
            <Link href="/sign-in" className="btn btn-secondary btn-lg">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
        <div className="text-center mb-2xl">
          <h2 className="animate-fadeIn">How Friction Works</h2>
          <p className="mt-md">Three simple steps to mindful spending</p>
        </div>

        <div className="grid grid-3">
          {/* Step 1 */}
          <div className="card animate-fadeIn animate-delay-100">
            <div className="stat-card-icon icon-bg-primary mb-md">
              <Landmark size={24} />
            </div>
            <h4>1. Connect Your Bank</h4>
            <p className="mt-sm text-sm">
              Securely link your bank account to track your spending patterns and subscriptions automatically.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card animate-fadeIn animate-delay-200">
            <div className="stat-card-icon icon-bg-info mb-md">
              <Puzzle size={24} />
            </div>
            <h4>2. Install the Extension</h4>
            <p className="mt-sm text-sm">
              Add our Chrome extension to get real-time nudges when you&apos;re about to make a purchase.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card animate-fadeIn animate-delay-300">
            <div className="stat-card-icon icon-bg-success mb-md">
              <Lightbulb size={24} />
            </div>
            <h4>3. Get Smart Nudges</h4>
            <p className="mt-sm text-sm">
              Receive gentle reminders before checkout. Cancel impulsive purchases or continue with awareness.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
        <div className="card card-glass" style={{ padding: 'var(--spacing-2xl)' }}>
          <div className="grid grid-2 gap-xl items-center">
            <div>
              <h3 className="mb-md">What You&apos;ll Get</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <li className="flex items-center gap-md">
                  <span className="text-success"><Check size={20} /></span>
                  <span>Real-time purchase intervention</span>
                </li>
                <li className="flex items-center gap-md">
                  <span className="text-success"><Check size={20} /></span>
                  <span>Subscription tracking & management</span>
                </li>
                <li className="flex items-center gap-md">
                  <span className="text-success"><Check size={20} /></span>
                  <span>Spending insights dashboard</span>
                </li>
                <li className="flex items-center gap-md">
                  <span className="text-success"><Check size={20} /></span>
                  <span>Customizable impulse rules</span>
                </li>
                <li className="flex items-center gap-md">
                  <span className="text-success"><Check size={20} /></span>
                  <span>Money saved tracking</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-2xl)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div className="flex justify-center mb-sm text-success">
                  <Wallet size={40} />
                </div>
                <div className="stat-card-value text-success">€127</div>
                <div className="stat-card-label">Average monthly savings</div>
                <p className="text-sm text-muted mt-md">
                  Users save an average of €127/month by cancelling impulse purchases
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container text-center" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
        <h2 className="mb-md">Ready to take control?</h2>
        <p className="mb-xl">Join thousands who&apos;ve reduced their impulse spending</p>
        <Link href="/sign-up" className="btn btn-primary btn-lg">
          Start your free trial
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--spacing-xl) 0',
        marginTop: 'var(--spacing-2xl)'
      }}>
        <div className="container flex justify-between items-center flex-wrap gap-md">
          <div className="sidebar-logo">Friction</div>
          <div className="text-muted text-sm">
            © 2026 Friction. Built for mindful spending.
          </div>
        </div>
      </footer>

      {/* ElevenLabs Agent Widget */}
      <ElevenLabsClient />
    </main>
  );
}
