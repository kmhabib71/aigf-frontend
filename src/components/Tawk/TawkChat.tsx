"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function TawkChat({
  propertyId,
  widgetId,
}: {
  propertyId: string;
  widgetId: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Guard against duplicate loads
    const existing = document.querySelector(
      `script[src*="embed.tawk.to/${propertyId}/${widgetId}"]`
    );
    if (!existing) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Hook into events to detect hidden/minimized state
      try {
        window.Tawk_API.onLoad = function () {
          setLoaded(true);
          setHidden(false);
        };
        window.Tawk_API.onChatHidden = function () { setHidden(true); };
        window.Tawk_API.onChatShown = function () { setHidden(false); };
        // If the widget uses minimize to fully hide, also restore with our button
        window.Tawk_API.onChatMinimized = function () { setHidden(true); };
        window.Tawk_API.onChatMaximized = function () { setHidden(false); };
      } catch {}

      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      // Insert before the first script, like the recommended snippet
      const s0 = document.getElementsByTagName("script")[0];
      if (s0 && s0.parentNode) s0.parentNode.insertBefore(s1, s0);
      else document.head.appendChild(s1);
    }

    return () => {
      // Best-effort cleanup to scope Tawk to this page only
      try {
        // Hide/end chat if API available
        if (window.Tawk_API) {
          try { window.Tawk_API.endChat && window.Tawk_API.endChat(); } catch {}
          try { window.Tawk_API.hideWidget && window.Tawk_API.hideWidget(); } catch {}
        }

        // Remove Tawk script(s)
        document
          .querySelectorAll(`script[src*="embed.tawk.to/${propertyId}/${widgetId}"]`)
          .forEach((el) => el.parentElement?.removeChild(el));

        // Remove any iframes injected by Tawk
        document
          .querySelectorAll('iframe[src*="tawk.to"], iframe[src*="embed.tawk.to"]')
          .forEach((el) => el.parentElement?.removeChild(el));

        // Remove generic containers sometimes used by Tawk
        document
          .querySelectorAll('[id^="tawk"], [class*="tawk"]')
          .forEach((el) => el.parentElement?.removeChild(el));

        // Clear globals
        delete window.Tawk_API;
        delete window.Tawk_LoadStart;
      } catch {
        // ignore cleanup errors
      }
    };
  }, [propertyId, widgetId]);

  return (
    hidden && loaded ? (
      <button
        type="button"
        onClick={() => {
          try {
            if (window.Tawk_API) {
              window.Tawk_API.showWidget && window.Tawk_API.showWidget();
              window.Tawk_API.maximize && window.Tawk_API.maximize();
              setHidden(false);
            }
          } catch {}
        }}
        className="fixed z-50 bottom-6 right-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 font-semibold shadow-xl hover:from-indigo-600 hover:to-purple-700"
        aria-label="Reopen chat"
      >
        Chat
      </button>
    ) : null
  );
}
