// Contentsquare (Hotjar) tracking
// Get your script URL from Contentsquare dashboard
export const CONTENTSQUARE_SCRIPT = process.env.NEXT_PUBLIC_CONTENTSQUARE_SCRIPT || '';

export const initHotjar = () => {
  if (typeof window !== 'undefined' && CONTENTSQUARE_SCRIPT) {
    const script = document.createElement('script');
    script.src = CONTENTSQUARE_SCRIPT;
    script.async = true;
    document.head.appendChild(script);
  }
};
