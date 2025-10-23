import { saveContextCard, loadContextCards, isBackendSyncAvailable } from "./utils/syncService";

console.log("🎯 Background script LOADED");
console.log("☁️ Backend sync available:", isBackendSyncAvailable());
console.log("🔧 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

// --- Cache cards in memory (optional) ---
let cachedCards: any[] = [];
const CACHE_LIMIT = 200; // keep only latest 200 cards

// --- Helper: add card to cache with duplicate prevention ---
function addToCache(card: { title: string; content: string; sourceUrl: string; createdAt: string }) {
  const exists = cachedCards.some(
    (c) => c.content === card.content && c.sourceUrl === card.sourceUrl
  );
  if (!exists) {
    cachedCards.unshift(card); // newest first
    if (cachedCards.length > CACHE_LIMIT) {
      cachedCards = cachedCards.slice(0, CACHE_LIMIT);
    }
  }
}

// --- Listen for incoming messages ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📡 Message received:", message);

  (async () => {
    try {
      // --- Save context card ---
      if (message?.type === "SAVE_CONTEXT_CARD") {
        const content = message.data?.content || "";
        const title = message.data?.title?.trim() || "Untitled";
        const sourceUrl = sender?.tab?.url || message.data?.source || "unknown";

        console.log("💾 Saving content (background):", content.substring(0, 200));

        try {
          await saveContextCard({ title, content, sourceUrl });
        } catch (err) {
          console.warn("⚠️ Supabase save failed, will save locally:", err);
        }

        addToCache({ title, content, sourceUrl, createdAt: new Date().toISOString() });

        console.log("✅ Card saved successfully");
        sendResponse({ success: true });
        return;
      }

      // --- Load context cards ---
      if (message?.type === "LOAD_CONTEXT_CARDS" || message?.type === "GET_CARDS") {
        let cards = cachedCards;

        if (isBackendSyncAvailable()) {
          try {
            cards = await loadContextCards();
          } catch {
            console.warn("⚠️ Supabase fetch failed, falling back to local storage");
            const result = await chrome.storage.local.get("contextCards");
            cards = result?.contextCards ?? [];
          }
        } else {
          const result = await chrome.storage.local.get("contextCards");
          cards = result?.contextCards ?? [];
        }

        sendResponse({ cards });
        return;
      }

      // --- PDF viewer warning ---
      if (message?.type === "PDF_VIEWER_NOTICE") {
        console.log("📄 PDF viewer notice received from content script");
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: "CardContext Notice",
          message: message.data?.message || "CardContext can’t capture text from Chrome’s built-in PDF viewer.",
        });
        sendResponse({ success: true });
        return;
      }

      console.warn("⚠️ Unrecognized message type:", message?.type);
      sendResponse({ success: true, received: message });
    } catch (err: any) {
      console.error("❌ Background message error:", err);
      sendResponse({ success: false, error: err?.message || String(err) });
    }
  })();

  return true; // Keep service worker alive for async
});

// --- Verify storage access on startup ---
try {
  chrome.storage.local.set({ test: "Background active" }, () => {
    if (chrome.runtime?.lastError) {
      console.warn("⚠️ Background storage write failed:", chrome.runtime.lastError);
      return;
    }
    console.log("✅ Background storage functional");
  });
} catch (err) {
  console.warn("⚠️ Background storage test threw:", err);
}

console.log("🎯 Background setup complete");
