"use client";

import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "@/lib/mock-data";

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscriptions = useCallback(async () => {
        try {
            const res = await fetch('/api/transactions');
            const data = await res.json();
            const subs = (data.transactions || []).filter(
                (tx: Transaction) => tx.type === 'subscription'
            );
            setSubscriptions(subs);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="text-muted animate-pulse">Loading subscriptions...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Subscriptions</h1>
                <p className="page-subtitle">Manage your recurring payments</p>
            </div>

            {/* Summary Card */}
            <div className="card mb-xl" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(34, 211, 238, 0.1))',
                borderColor: 'rgba(99, 102, 241, 0.3)'
            }}>
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-secondary text-sm mb-xs">Total Monthly Cost</div>
                        <div className="text-3xl font-bold">€{totalMonthly.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-secondary text-sm mb-xs">Active Subscriptions</div>
                        <div className="text-3xl font-bold">{subscriptions.length}</div>
                    </div>
                </div>
            </div>

            {/* Subscriptions List */}
            {subscriptions.length > 0 ? (
                <div className="grid gap-md">
                    {subscriptions.map(sub => (
                        <div key={sub.id} className="card flex items-center gap-lg" style={{ padding: 'var(--spacing-lg)' }}>
                            <div className="activity-icon icon-bg-info" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                🔄
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-lg">{sub.merchant}</div>
                                <div className="text-sm text-muted">{sub.category}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-lg">€{sub.amount.toFixed(2)}/mo</div>
                                <div className="text-sm text-muted">Next: {getNextBillingDate(sub.date)}</div>
                            </div>
                            <div>
                                <button className="btn btn-ghost btn-sm">
                                    Cancel info →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔄</div>
                        <div className="empty-state-title">No subscriptions found</div>
                        <div className="empty-state-description">
                            Connect your bank to automatically detect recurring payments.
                        </div>
                    </div>
                </div>
            )}

            {/* Tips section */}
            <div className="card mt-xl" style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.2)'
            }}>
                <h4 className="mb-md">💡 Subscription Tips</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <li className="flex items-start gap-md">
                        <span className="text-success">•</span>
                        <span className="text-secondary">Review your subscriptions monthly to catch ones you no longer use</span>
                    </li>
                    <li className="flex items-start gap-md">
                        <span className="text-success">•</span>
                        <span className="text-secondary">Check for annual plans that could save you money</span>
                    </li>
                    <li className="flex items-start gap-md">
                        <span className="text-success">•</span>
                        <span className="text-secondary">Share subscriptions with family when possible</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

function getNextBillingDate(lastDate: string): string {
    const date = new Date(lastDate);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
