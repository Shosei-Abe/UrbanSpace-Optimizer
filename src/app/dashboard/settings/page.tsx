"use client";

import BankConnect from "@/components/BankConnect";
import { ExtensionAuthSync } from "@/components/ExtensionAuthSync";

export default function SettingsPage() {
    return (
        <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Banking & Payments</h2>
                    <BankConnect />
                </section>

                <section>
                    <ExtensionAuthSync />
                </section>
            </div>
        </div>
    );
}
