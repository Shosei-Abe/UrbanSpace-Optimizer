// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect } from "react";

export function ElevenLabsClient() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);

        // Auto-start check
        const checkAutoStart = () => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('triggerAgent') === 'true') {
                // Attempt to auto-expand/activate widget
                // Note: The widget is a custom element. We might need to find its internal button often in shadowRoot.
                // This is a best-effort approach as the widget might not expose API.
                // If the widget has an 'opened' attribute or similar, we set it.
                const widget = document.querySelector('elevenlabs-convai');
                if (widget) {
                    // Try to simulate click or set attribute if known
                    // Common behavior: simulating click on the element itself might work if it's just a bubble
                    setTimeout(() => {
                        // Find the shadow root button
                        const shadow = widget.shadowRoot;
                        if (shadow) {
                            const btn = shadow.querySelector('button');
                            if (btn) btn.click();
                        }
                    }, 2000); // Wait for load
                }
            }
        };

        script.onload = () => checkAutoStart();

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        // @ts-expect-error - Custom element not fully typed
        <elevenlabs-convai
            agent-id={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}
        ></elevenlabs-convai>
    );
}
