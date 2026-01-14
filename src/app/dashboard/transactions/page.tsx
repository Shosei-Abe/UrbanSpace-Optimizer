"use client";

import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "@/lib/mock-data";

type TabType = 'all' | 'purchases' | 'subscriptions' | 'blocked';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('all');

    const fetchTransactions = useCallback(async () => {
        try {
            const res = await fetch('/api/transactions');
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filteredTransactions = transactions.filter(tx => {
        switch (activeTab) {
            case 'purchases':
                return tx.type === 'one-time' && tx.outcome === 'completed';
            case 'subscriptions':
                return tx.type === 'subscription';
            case 'blocked':
                return tx.outcome === 'blocked';
            default:
                return true;
        }
    });

    const tabs: { key: TabType; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: transactions.length },
        { key: 'purchases', label: 'Purchases', count: transactions.filter(t => t.type === 'one-time' && t.outcome === 'completed').length },
        { key: 'subscriptions', label: 'Subscriptions', count: transactions.filter(t => t.type === 'subscription').length },
        { key: 'blocked', label: 'Blocked', count: transactions.filter(t => t.outcome === 'blocked').length },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="text-muted animate-pulse">Loading transactions...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Transactions</h1>
                <p className="page-subtitle">View all your purchases, subscriptions, and blocked attempts</p>
            </div>

            {/* Tabs */}
            <div className="tabs mb-xl">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                        <span className="badge badge-info" style={{ marginLeft: '8px' }}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {filteredTransactions.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Merchant</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Outcome</th>
                                <th>Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.date}</td>
                                    <td>
                                        <div className="flex items-center gap-md">
                                            <span className={`activity-icon ${tx.outcome === 'blocked'
                                                    ? 'icon-bg-success'
                                                    : tx.type === 'subscription'
                                                        ? 'icon-bg-info'
                                                        : 'icon-bg-warning'
                                                }`} style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}>
                                                {tx.outcome === 'blocked' ? '🛡️' : tx.type === 'subscription' ? '🔄' : '🛒'}
                                            </span>
                                            <div>
                                                <div className="font-medium">{tx.merchant}</div>
                                                <div className="text-sm text-muted">{tx.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-secondary text-sm">
                                            {tx.type === 'subscription' ? 'Subscription' : tx.type === 'blocked-attempt' ? 'Attempt' : 'One-time'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={tx.outcome === 'blocked' ? 'text-success' : ''}>
                                            €{tx.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${tx.outcome === 'blocked'
                                                ? 'badge-success'
                                                : tx.type === 'subscription'
                                                    ? 'badge-info'
                                                    : 'badge-warning'
                                            }`}>
                                            {tx.outcome === 'blocked' ? 'Blocked' : tx.outcome === 'pending' ? 'Pending' : 'Completed'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-sm text-muted">
                                            {tx.source === 'browser-extension' ? 'Extension' : 'Bank'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <div className="empty-state-title">No transactions found</div>
                        <div className="empty-state-description">
                            {activeTab === 'all'
                                ? "Connect your bank to see your transactions here."
                                : `No ${activeTab} found in your history.`}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
