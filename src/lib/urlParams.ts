/**
 * URL Parameter Utilities for Conversation ID Management
 *
 * This utility provides functions to manage conversation IDs via URL paths
 * using the format: /conv/{conversationId}
 */

/**
 * Get the conversation ID from URL path
 * @returns conversation ID string or null if not found
 */
export function getConversationIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const path = window.location.pathname;
  const match = path.match(/^\/conv\/([^\/]+)$/);
  return match ? match[1] : null;
}

/**
 * Navigate to a specific conversation by updating the URL path
 * @param conversationId - The conversation ID to navigate to
 */
export function navigateToConversation(conversationId: string): void {
  if (typeof window === 'undefined') return;

  const newUrl = `/conv/${conversationId}`;
  window.history.pushState({}, '', newUrl);
}

/**
 * Navigate to a new conversation (goes to home page)
 */
export function navigateToNewConversation(): void {
  if (typeof window === 'undefined') return;

  window.history.pushState({}, '', '/');
}

/**
 * Set the conversation ID in the URL path without page reload
 * @param conversationId - The conversation ID to set
 * @param replaceHistory - Whether to replace current history entry (default: false)
 */
export function setConversationIdInUrl(conversationId: string | null, replaceHistory: boolean = false): void {
  if (typeof window === 'undefined') return;

  const newUrl = conversationId ? `/conv/${conversationId}` : '/';

  if (replaceHistory) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}

/**
 * Remove conversation ID from URL (navigate to home)
 * @param replaceHistory - Whether to replace current history entry (default: false)
 */
export function removeConversationIdFromUrl(replaceHistory: boolean = false): void {
  setConversationIdInUrl(null, replaceHistory);
}

/**
 * Check if a conversation ID exists in the current URL
 * @returns true if conversation ID exists in URL, false otherwise
 */
export function hasConversationIdInUrl(): boolean {
  return getConversationIdFromUrl() !== null;
}

/**
 * Check if the current URL is a conversation URL
 * @returns true if URL follows /conv/{id} pattern
 */
export function isConversationUrl(): boolean {
  if (typeof window === 'undefined') return false;
  return /^\/conv\/[^\/]+$/.test(window.location.pathname);
}

/**
 * Check if the current URL is the home page
 * @returns true if URL is home page
 */
export function isHomePage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/';
}

/**
 * Get the current URL with conversation ID
 * @param conversationId - The conversation ID to include
 * @returns Full URL with conversation ID in path
 */
export function getUrlWithConversationId(conversationId: string): string {
  if (typeof window === 'undefined') return '';

  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}/conv/${conversationId}`;
}

/**
 * Listen for URL path changes (for back/forward navigation)
 * @param callback - Function to call when conversation ID changes
 * @returns Cleanup function to remove the listener
 */
export function onConversationIdChange(callback: (conversationId: string | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handlePopState = () => {
    const conversationId = getConversationIdFromUrl();
    callback(conversationId);
  };

  window.addEventListener('popstate', handlePopState);

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}

/**
 * Parse conversation ID from any URL path
 * @param path - URL path to parse
 * @returns conversation ID or null
 */
export function parseConversationIdFromPath(path: string): string | null {
  const match = path.match(/^\/conv\/([^\/]+)$/);
  return match ? match[1] : null;
}