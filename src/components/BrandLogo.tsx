"use client";
import { ShoppingBag, Store, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface BrandLogoProps {
    merchant: string;
    size?: number;
    className?: string;
    fallbackIcon?: 'shopping-bag' | 'store' | 'credit-card';
}

export function BrandLogo({
    merchant,
    size = 40,
    className = "",
    fallbackIcon = 'shopping-bag'
}: BrandLogoProps) {
    const [error, setError] = useState(false);

    // Simple heuristic to guess domain
    const domain = merchant.toLowerCase().replace(/\s+/g, '') + '.com';
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    if (error) {
        return (
            <div
                className={`flex items-center justify-center rounded-full bg-slate-100 text-slate-500 ${className}`}
                style={{ width: size, height: size }}
            >
                {fallbackIcon === 'shopping-bag' && <ShoppingBag size={size * 0.5} />}
                {fallbackIcon === 'store' && <Store size={size * 0.5} />}
                {fallbackIcon === 'credit-card' && <CreditCard size={size * 0.5} />}
            </div>
        );
    }

    return (
        <div
            className={`overflow-hidden rounded-full border border-slate-200 bg-white ${className}`}
            style={{ width: size, height: size, position: 'relative' }}
        >
            <Image
                src={logoUrl}
                alt={`${merchant} logo`}
                fill
                className="object-cover p-1.5"
                onError={() => setError(true)}
            />
        </div>
    );
}
