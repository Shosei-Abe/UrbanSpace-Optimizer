// Mock data store for the Friction app
// In production, this would be a real database

export interface Transaction {
    id: string;
    userId: string;
    date: string;
    merchant: string;
    amount: number;
    type: 'subscription' | 'one-time' | 'blocked-attempt';
    category: string;
    outcome: 'completed' | 'blocked' | 'pending';
    source: 'bank-import' | 'browser-extension';
}

export interface UserSettings {
    userId: string;
    monthlyGoal: number | null;
    warnThreshold: number;
    cooldownMinutes: number;
    warnCategories: string[];
    bankConnected: boolean;
    bankName: string | null;
    extensionConnected: boolean;
    onboardingCompleted: boolean;
    plaidAccessToken?: string;
    plaidItemId?: string;
    lastPlaidSync?: string;
}

export interface UserStats {
    blockedCount: number;
    blockedAmount: number;
    completedCount: number;
    completedAmount: number;
    subscriptionCount: number;
    subscriptionMonthly: number;
}

// In-memory stores (reset on server restart)
import fs from 'fs';
import path from 'path';

// File-based persistence
const DATA_FILE = path.join(process.cwd(), 'data.json');

interface DataStore {
    transactions: Record<string, Transaction[]>;
    userSettings: Record<string, UserSettings>;
}

function loadData(): DataStore {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.error("Failed to load data", e);
    }
    return { transactions: {}, userSettings: {} };
}

function saveData(data: DataStore) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to save data", e);
    }
}

// In-memory cache (initially loaded from file)
// We reload on get to ensure we always have the latest file state (simplistic approach for dev)
const transactions = {
    get: (userId: string) => {
        const currentStore = loadData();
        return currentStore.transactions[userId] || [];
    },
    set: (userId: string, data: Transaction[]) => {
        const currentStore = loadData();
        currentStore.transactions[userId] = data;
        saveData(currentStore);
    }
};
const userSettings = {
    get: (userId: string) => {
        const currentStore = loadData();
        return currentStore.userSettings[userId];
    },
    set: (userId: string, data: UserSettings) => {
        const currentStore = loadData();
        currentStore.userSettings[userId] = data;
        saveData(currentStore);
    }
};

// Seed data generators
const merchants = [
    { name: 'Amazon', category: 'Shopping' },
    { name: 'Spotify', category: 'Entertainment' },
    { name: 'Netflix', category: 'Entertainment' },
    { name: 'Zara', category: 'Clothes' },
    { name: 'Uber Eats', category: 'Food Delivery' },
    { name: 'Apple', category: 'Gadgets' },
    { name: 'Steam', category: 'Gaming' },
    { name: 'Zalando', category: 'Clothes' },
    { name: 'Deliveroo', category: 'Food Delivery' },
    { name: 'Adobe', category: 'Software' },
    { name: 'Dropbox', category: 'Software' },
    { name: 'YouTube Premium', category: 'Entertainment' },
];

const subscriptions = [
    { name: 'Spotify', amount: 9.99, category: 'Entertainment' },
    { name: 'Netflix', amount: 15.99, category: 'Entertainment' },
    { name: 'Adobe Creative Cloud', amount: 54.99, category: 'Software' },
    { name: 'Dropbox Plus', amount: 11.99, category: 'Software' },
    { name: 'YouTube Premium', amount: 11.99, category: 'Entertainment' },
];

function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

function randomDate(daysBack: number): string {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString().split('T')[0];
}

function randomAmount(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function seedTransactionsForUser(userId: string): Transaction[] {
    const userTransactions: Transaction[] = [];

    // Add some subscriptions
    subscriptions.slice(0, 3 + Math.floor(Math.random() * 3)).forEach((sub) => {
        userTransactions.push({
            id: generateId(),
            userId,
            date: randomDate(30),
            merchant: sub.name,
            amount: sub.amount,
            type: 'subscription',
            category: sub.category,
            outcome: 'completed',
            source: 'bank-import',
        });
    });

    // Add some one-time purchases
    for (let i = 0; i < 5 + Math.floor(Math.random() * 5); i++) {
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        userTransactions.push({
            id: generateId(),
            userId,
            date: randomDate(30),
            merchant: merchant.name,
            amount: randomAmount(15, 150),
            type: 'one-time',
            category: merchant.category,
            outcome: 'completed',
            source: 'bank-import',
        });
    }

    // Add some blocked attempts
    for (let i = 0; i < 2 + Math.floor(Math.random() * 4); i++) {
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        userTransactions.push({
            id: generateId(),
            userId,
            date: randomDate(14),
            merchant: merchant.name,
            amount: randomAmount(20, 200),
            type: 'blocked-attempt',
            category: merchant.category,
            outcome: 'blocked',
            source: 'browser-extension',
        });
    }

    // Add some completed impulse purchases (user continued after nudge)
    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        userTransactions.push({
            id: generateId(),
            userId,
            date: randomDate(14),
            merchant: merchant.name,
            amount: randomAmount(25, 100),
            type: 'one-time',
            category: merchant.category,
            outcome: 'completed',
            source: 'browser-extension',
        });
    }

    // Sort by date descending
    userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    transactions.set(userId, userTransactions);
    return userTransactions;
}

export function getTransactions(userId: string): Transaction[] {
    return transactions.get(userId) || [];
}

export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction = { ...transaction, id: generateId() };
    const userTransactions = transactions.get(transaction.userId) || [];
    userTransactions.unshift(newTransaction);
    transactions.set(transaction.userId, userTransactions);
    return newTransaction;
}

export function getUserSettings(userId: string): UserSettings {
    const existing = userSettings.get(userId);
    if (existing) return existing;

    const defaults: UserSettings = {
        userId,
        monthlyGoal: null,
        warnThreshold: 50,
        cooldownMinutes: 15,
        warnCategories: ['Clothes', 'Gadgets', 'Food Delivery'],
        bankConnected: false,
        bankName: null,
        extensionConnected: false,
        onboardingCompleted: false,
    };

    userSettings.set(userId, defaults);
    return defaults;
}

export function updateUserSettings(userId: string, updates: Partial<UserSettings>): UserSettings {
    const current = getUserSettings(userId);
    const updated = { ...current, ...updates };
    userSettings.set(userId, updated);
    return updated;
}

export function getUserStats(userId: string): UserStats {
    const userTransactions = getTransactions(userId);

    const blockedAttempts = userTransactions.filter(t => t.outcome === 'blocked');
    const completedPurchases = userTransactions.filter(t => t.outcome === 'completed' && t.type !== 'subscription');
    const activeSubscriptions = userTransactions.filter(t => t.type === 'subscription');

    return {
        blockedCount: blockedAttempts.length,
        blockedAmount: blockedAttempts.reduce((sum, t) => sum + t.amount, 0),
        completedCount: completedPurchases.length,
        completedAmount: completedPurchases.reduce((sum, t) => sum + t.amount, 0),
        subscriptionCount: activeSubscriptions.length,
        subscriptionMonthly: activeSubscriptions.reduce((sum, t) => sum + t.amount, 0),
    };
}

export function connectBank(userId: string, bankName: string): void {
    updateUserSettings(userId, { bankConnected: true, bankName });
    seedTransactionsForUser(userId);
}

export function regenerateTransactions(userId: string): Transaction[] {
    return seedTransactionsForUser(userId);
}
