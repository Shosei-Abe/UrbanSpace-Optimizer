import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getTransactions, getUserStats, getUserSettings, seedTransactionsForUser } from "@/lib/mock-data";

// Force dynamic rendering since this page uses auth
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        return null;
    }

    // Get user settings to check if they have data
    const settings = getUserSettings(userId);

    // If no bank connected but user exists, seed some demo data anyway
    if (!settings.bankConnected) {
        seedTransactionsForUser(userId);
    }

    const transactions = getTransactions(userId);
    const stats = getUserStats(userId);

    const recentTransactions = transactions.slice(0, 5);
    const firstName = user?.firstName || "there";

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Hi, {firstName} 👋</h1>
                <p className="page-subtitle">
                    {stats.blockedCount > 0
                        ? `You avoided ${stats.blockedCount} impulse buy${stats.blockedCount !== 1 ? 's' : ''} this month`
                        : "Let's start tracking your spending"}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-3 mb-xl">
                {/* Blocked */}
                <div className="stat-card animate-fadeIn">
                    <div className="stat-card-icon icon-bg-success">
                        🛡️
                    </div>
                    <div className="stat-card-value text-success">
                        €{stats.blockedAmount.toFixed(0)}
                    </div>
                    <div className="stat-card-label">
                        {stats.blockedCount} impulse buy{stats.blockedCount !== 1 ? 's' : ''} blocked
                    </div>
                </div>

                {/* Completed */}
                <div className="stat-card animate-fadeIn animate-delay-100">
                    <div className="stat-card-icon icon-bg-warning">
                        💸
                    </div>
                    <div className="stat-card-value">
                        €{stats.completedAmount.toFixed(0)}
                    </div>
                    <div className="stat-card-label">
                        {stats.completedCount} purchase{stats.completedCount !== 1 ? 's' : ''} made
                    </div>
                </div>

                {/* Subscriptions */}
                <div className="stat-card animate-fadeIn animate-delay-200">
                    <div className="stat-card-icon icon-bg-info">
                        🔄
                    </div>
                    <div className="stat-card-value">
                        €{stats.subscriptionMonthly.toFixed(0)}/mo
                    </div>
                    <div className="stat-card-label">
                        {stats.subscriptionCount} active subscription{stats.subscriptionCount !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card animate-fadeIn animate-delay-300">
                <div className="flex justify-between items-center mb-lg">
                    <h3>Recent Activity</h3>
                    <Link href="/dashboard/transactions" className="btn btn-ghost btn-sm">
                        View all →
                    </Link>
                </div>

                {recentTransactions.length > 0 ? (
                    <div className="activity-list">
                        {recentTransactions.map((tx) => (
                            <div key={tx.id} className="activity-item">
                                <div className={`activity-icon ${tx.outcome === 'blocked'
                                    ? 'icon-bg-success'
                                    : tx.type === 'subscription'
                                        ? 'icon-bg-info'
                                        : 'icon-bg-warning'
                                    }`}>
                                    {tx.outcome === 'blocked' ? '🛡️' : tx.type === 'subscription' ? '🔄' : '🛒'}
                                </div>
                                <div className="activity-info">
                                    <div className="activity-title">{tx.merchant}</div>
                                    <div className="activity-meta">
                                        {tx.date} · {tx.type === 'subscription' ? 'Subscription' : tx.source === 'browser-extension' ? 'Extension detected' : 'Bank import'}
                                    </div>
                                </div>
                                <div className="activity-amount">
                                    <div className={tx.outcome === 'blocked' ? 'text-success' : ''}>
                                        €{tx.amount.toFixed(2)}
                                    </div>
                                    <div className="activity-status">
                                        <span className={`badge ${tx.outcome === 'blocked'
                                            ? 'badge-success'
                                            : tx.type === 'subscription'
                                                ? 'badge-info'
                                                : 'badge-warning'
                                            }`}>
                                            {tx.outcome === 'blocked' ? 'Blocked' : tx.type === 'subscription' ? 'Recurring' : 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <div className="empty-state-title">No activity yet</div>
                        <div className="empty-state-description">
                            Connect your bank or install the Chrome extension to start tracking purchases.
                        </div>
                        <Link href="/onboarding" className="btn btn-primary">
                            Complete setup
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-4 mt-xl">
                <Link href="/dashboard/transactions" className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <div className="mb-sm">💳</div>
                    <div className="font-medium">View Transactions</div>
                </Link>
                <Link href="/dashboard/subscriptions" className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <div className="mb-sm">🔄</div>
                    <div className="font-medium">Manage Subscriptions</div>
                </Link>
                <Link href="/dashboard/settings" className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <div className="mb-sm">⚙️</div>
                    <div className="font-medium">Edit Rules</div>
                </Link>
                <Link href="#extension" className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <div className="mb-sm">🧩</div>
                    <div className="font-medium">Install Extension</div>
                </Link>
            </div>
        </div>
    );
}
