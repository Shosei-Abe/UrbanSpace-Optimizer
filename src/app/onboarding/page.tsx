"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Bank {
    id: string;
    name: string;
}

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<string>("");
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);

    // Rules state
    const [warnThreshold, setWarnThreshold] = useState(50);
    const [monthlyGoal, setMonthlyGoal] = useState<string>("");

    const fetchBanks = useCallback(async () => {
        try {
            const res = await fetch('/api/bank/connect');
            const data = await res.json();
            setBanks(data.banks || []);
        } catch (error) {
            console.error('Failed to fetch banks:', error);
        }
    }, []);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const connectBank = async () => {
        if (!selectedBank) return;

        setConnecting(true);
        try {
            const res = await fetch('/api/bank/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bankId: selectedBank }),
            });

            if (res.ok) {
                setConnected(true);
                setTimeout(() => setStep(3), 1000);
            }
        } catch (error) {
            console.error('Failed to connect bank:', error);
        } finally {
            setConnecting(false);
        }
    };

    const saveRules = async () => {
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    warnThreshold,
                    monthlyGoal: monthlyGoal ? parseInt(monthlyGoal) : null,
                    onboardingCompleted: true,
                }),
            });
            setStep(4);
        } catch (error) {
            console.error('Failed to save rules:', error);
        }
    };

    const finishOnboarding = () => {
        router.push('/dashboard');
    };

    const totalSteps = 4;

    return (
        <div className="wizard">
            {/* Progress */}
            <div className="wizard-progress">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`wizard-step-indicator ${s < step ? 'completed' : s === step ? 'active' : ''
                            }`}
                    />
                ))}
            </div>

            {/* Step 1: Welcome */}
            {step === 1 && (
                <div className="wizard-card animate-fadeIn">
                    <div className="text-center mb-xl">
                        <div className="text-3xl mb-md">👋</div>
                        <h2 className="wizard-title">Welcome to Friction</h2>
                        <p className="wizard-description">
                            Let&apos;s set you up in a few quick steps to help you take control of your impulse spending.
                        </p>
                    </div>

                    <div className="card-glass" style={{ padding: 'var(--spacing-lg)' }}>
                        <h4 className="mb-md">Here&apos;s what we&apos;ll do:</h4>
                        <ol style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', lineHeight: '2' }}>
                            <li>Connect your bank (mock for demo)</li>
                            <li>Set your spending rules</li>
                            <li>Install the Chrome extension (optional)</li>
                        </ol>
                    </div>

                    <div className="wizard-actions">
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(2)}>
                            Let&apos;s get started →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Bank Connection */}
            {step === 2 && (
                <div className="wizard-card animate-fadeIn">
                    <div className="text-center mb-xl">
                        <div className="text-3xl mb-md">🏦</div>
                        <h2 className="wizard-title">Connect Your Bank</h2>
                        <p className="wizard-description">
                            Select a demo bank to connect. This will generate sample transactions for testing.
                        </p>
                    </div>

                    {!connected ? (
                        <>
                            <div className="mb-xl">
                                <label className="label">Select a bank</label>
                                <select
                                    className="input select"
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                >
                                    <option value="">Choose a bank...</option>
                                    {banks.map((bank) => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="wizard-actions">
                                <button className="btn btn-secondary" onClick={() => setStep(1)}>
                                    ← Back
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    onClick={connectBank}
                                    disabled={!selectedBank || connecting}
                                >
                                    {connecting ? 'Connecting...' : 'Connect Bank'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center animate-fadeIn">
                            <div className="stat-card-icon icon-bg-success" style={{ width: '64px', height: '64px', margin: '0 auto var(--spacing-lg)', fontSize: '2rem' }}>
                                ✓
                            </div>
                            <div className="text-lg font-medium text-success">Bank Connected!</div>
                            <p className="text-muted mt-sm">Loading your transactions...</p>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Spending Rules */}
            {step === 3 && (
                <div className="wizard-card animate-fadeIn">
                    <div className="text-center mb-xl">
                        <div className="text-3xl mb-md">⚙️</div>
                        <h2 className="wizard-title">Set Your Rules</h2>
                        <p className="wizard-description">
                            Customize when you want to be nudged before making a purchase.
                        </p>
                    </div>

                    <div className="mb-xl">
                        <label className="label">Monthly spending goal (optional)</label>
                        <div className="flex items-center gap-md">
                            <span className="text-xl">€</span>
                            <input
                                type="number"
                                className="input"
                                placeholder="e.g., 500"
                                value={monthlyGoal}
                                onChange={(e) => setMonthlyGoal(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-xl">
                        <label className="label">Warn me for purchases over</label>
                        <div className="flex items-center gap-md">
                            <span className="text-xl">€</span>
                            <input
                                type="number"
                                className="input"
                                value={warnThreshold}
                                onChange={(e) => setWarnThreshold(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="wizard-actions">
                        <button className="btn btn-secondary" onClick={() => setStep(2)}>
                            ← Back
                        </button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveRules}>
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Extension */}
            {step === 4 && (
                <div className="wizard-card animate-fadeIn">
                    <div className="text-center mb-xl">
                        <div className="text-3xl mb-md">🧩</div>
                        <h2 className="wizard-title">Install the Extension</h2>
                        <p className="wizard-description">
                            Get real-time nudges when you&apos;re about to make an impulse purchase online.
                        </p>
                    </div>

                    <div className="card-glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                        <div className="flex items-center gap-lg mb-lg">
                            <div className="activity-icon icon-bg-primary" style={{ width: '48px', height: '48px' }}>
                                🛡️
                            </div>
                            <div>
                                <div className="font-medium">Friction Chrome Extension</div>
                                <div className="text-sm text-muted">Detects checkout pages and shows nudges</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <h4 className="mb-sm" style={{ fontSize: '0.9rem' }}>Installation Steps:</h4>
                            <ol style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.85rem' }}>
                                <li>Open Chrome → <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>chrome://extensions</code></li>
                                <li>Enable &quot;Developer mode&quot; (top right)</li>
                                <li>Click &quot;Load unpacked&quot; → select the <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>extension</code> folder</li>
                                <li>Click the Friction icon and enter your User ID</li>
                            </ol>
                        </div>

                        <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                            <div className="text-sm text-muted mb-sm">Your User ID (copy this for the extension):</div>
                            <code style={{ fontSize: '0.75rem', wordBreak: 'break-all', display: 'block' }}>
                                You can find your User ID in Settings after completing onboarding
                            </code>
                        </div>
                    </div>

                    <div className="wizard-actions">
                        <button className="btn btn-ghost" onClick={finishOnboarding}>
                            Skip for now
                        </button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={finishOnboarding}>
                            Go to Dashboard →
                        </button>
                    </div>
                </div>
            )}

            {/* Step indicator text */}
            <div className="text-center text-muted text-sm mt-xl">
                Step {step} of {totalSteps}
            </div>
        </div>
    );
}
