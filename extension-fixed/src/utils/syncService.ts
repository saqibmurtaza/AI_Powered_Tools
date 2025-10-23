// File: extension-fixed/src/utils/syncService.ts

/**
 * Handles sync of context cards between local storage and backend (Supabase).
 * Auto-fallback to local storage if backend or auth unavailable.
 */

// Add at the very top of the file
declare global {
  interface Window {
    Clerk?: {
      user?: {
        id?: string;
        getToken: () => Promise<string>;
      };
    };
  }
}


interface ContextCard {
  id?: string;
  title: string;
  content: string;
  sourceUrl?: string;
  createdAt?: string;
  userId?: string | null;
  tags?: string[] | null;
}

// --- Environment variables ---
const BASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
const SUPABASE_URL = BASE_URL.endsWith("/rest/v1") ? BASE_URL : `${BASE_URL}/rest/v1`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";

/**
 * Checks if backend sync is possible.
 */
export function isBackendSyncAvailable(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Internal helper: Fetch with timeout to prevent hanging requests.
 */
async function fetchWithTimeout(resource: RequestInfo, options: RequestInit = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Saves a context card to Supabase if backend sync is available,
 * otherwise falls back to local Chrome storage.
 */
export async function saveContextCard(
  card: ContextCard,
  token?: string,
  userId?: string
): Promise<void> {
  try {
    if (isBackendSyncAvailable()) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Prefer: "return=minimal",
      };
      if (token) headers.Authorization = `Bearer ${token}`;


      const payload = {
        title: card.title || "Untitled",         // must always have a title
        text: card.content || "(No content)",    // required field
        content: card.content || null,           // optional field
        source_url: card.sourceUrl || null,
        created_at: new Date().toISOString(),
        user_id: userId || card.userId || null,
        tags: card.tags || null,                 // optional array
      };


      const res = await fetchWithTimeout(`${SUPABASE_URL}/context_cards`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Supabase save failed: ${res.statusText} | ${errText}`);
      }

      console.log("☁️ Synced card to Supabase:", card.title);
      return;
    }

    // Local fallback
    const stored = (await chrome.storage.local.get("contextCards")).contextCards || [];
    stored.push({ ...card, createdAt: new Date().toISOString() });
    await chrome.storage.local.set({ contextCards: stored });
    console.log("💾 Card saved locally (fallback):", card.title);
  } catch (err) {
    console.error("❌ saveContextCard error:", err);
  }
}

/**
 * Loads context cards (from Supabase if available, otherwise from local storage).
 */
export async function loadContextCards(
  userId?: string,
  token?: string
): Promise<ContextCard[]> {
  try {
    if (isBackendSyncAvailable()) {
      const headers: Record<string, string> = { apikey: SUPABASE_ANON_KEY };
      if (token) headers.Authorization = `Bearer ${token}`;

      let url = `${SUPABASE_URL}/context_cards?select=*`;
      if (userId) url += `&user_id=eq.${encodeURIComponent(userId)}`;

      const res = await fetchWithTimeout(url, { headers });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch cards: ${res.statusText} | ${errText}`);
      }

      const data = await res.json();
      console.log("☁️ Loaded cards from backend:", data.length);
      return data;
    }

    // Local fallback
    const localData = (await chrome.storage.local.get("contextCards")).contextCards || [];
    console.log("💾 Loaded cards from local storage:", localData.length);
    return localData;
  } catch (err) {
    console.error("❌ loadContextCards error:", err);
    return [];
  }
}

// --- Wait for Clerk to initialize safely ---
export async function getClerkUserSafe(): Promise<{ userId?: string; token?: string }> {
  let attempts = 0;
  const maxAttempts = 20;
  const delayMs = 100;

  while ((!window.Clerk || !window.Clerk.user) && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    attempts++;
  }

  if (window.Clerk && window.Clerk.user) {
    try {
      const userId = window.Clerk.user.id || undefined;
      const token = await window.Clerk.user.getToken();
      return { userId, token };
    } catch (err) {
      console.warn("⚠️ getClerkUserSafe failed:", err);
    }
  }

  return {}; // fallback
}

