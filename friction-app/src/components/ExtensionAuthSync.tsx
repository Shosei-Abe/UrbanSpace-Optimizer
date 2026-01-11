"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function ExtensionAuthSync() {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);

    if (!user) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(user.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-8 max-w-2xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">Chrome Extension Connection</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Connect the Friction extension to your account to enable safe shopping nudges.
                </p>
            </div>

            {/* Hidden element for auto-sync */}
            <div
                id="friction-auth-sync"
                data-user-id={user.id}
                style={{ display: "none" }}
            />

            <div className="p-6 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-700">Manual Connection ID</p>
                        <p className="text-xs text-slate-500">
                            If auto-sync fails, paste this ID into the extension.
                        </p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                    >
                        {copied ? "Copied! ✓" : "Copy ID"}
                    </button>
                </div>
                <div className="font-mono text-xs bg-slate-200 p-3 rounded-md text-slate-600 break-all border border-slate-300">
                    {user.id}
                </div>
            </div>
        </div>
    );
}
