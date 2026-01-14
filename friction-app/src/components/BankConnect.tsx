"use client";

import React, { useCallback, useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function BankConnect() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const createLinkToken = async () => {
        try {
            const response = await fetch("/api/plaid/link-token", { method: "POST" });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || response.statusText);
            }
            const data = await response.json();
            setToken(data.link_token);
        } catch (err: unknown) {
            console.error("Link Token Error:", err);
            const message = err instanceof Error ? err.message : "Failed to initialize Plaid";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        createLinkToken();
    }, []);

    const onSuccess = useCallback(async (public_token: string) => {
        try {
            await fetch("/api/plaid/exchange-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ public_token }),
            });
            alert("Bank connected successfully!");
            window.location.reload();
        } catch (err) {
            console.error("Exchange Error:", err);
            alert("Failed to save connection. Please try again.");
        }
    }, []);

    const { open, ready } = usePlaidLink({
        token,
        onSuccess,
    });

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>Connect Your Bank</h2>
            {loading && <p>Loading connection secure link...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}. Please check your Plaid configuration/credentials or allowed countries.</p>}

            {!loading && !error && (
                <button
                    onClick={() => open()}
                    disabled={!ready}
                    style={{
                        padding: "10px 20px",
                        cursor: ready ? "pointer" : "not-allowed",
                        opacity: ready ? 1 : 0.5,
                        backgroundColor: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    {ready ? "Connect Bank Account" : "Initializing..."}
                </button>
            )}
        </div>
    );
}
