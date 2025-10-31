'use client';

import { useEffect } from 'react';

export default function FacebookMeta() {
  useEffect(() => {
    // Only add if not already present
    if (document.querySelector('meta[property="fb:app_id"]')) {
      return;
    }

    const fbAppId = process.env.NEXT_PUBLIC_FB_APP_ID;

    if (fbAppId) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'fb:app_id');
      meta.setAttribute('content', fbAppId);
      document.head.appendChild(meta);
    }
  }, []);

  return null;
}
