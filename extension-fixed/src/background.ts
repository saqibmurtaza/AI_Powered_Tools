// console.log("🎯 TEST: Background script LOADED");

// // Handle incoming messages
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("📡 Message received:", message);

//   // --- Handle Context Card Save ---
//   if (message.type === "SAVE_CONTEXT_CARD") {
//     const text = message.data?.content || "";
//     console.log("💾 Saving content:", text.substring(0, 50));

//     (async () => {
//       try {
//         const result = await chrome.storage.local.get(["contextCards"]);
//         const cards = result.contextCards || [];

//         cards.push({
//           content: text,
//           savedAt: new Date().toISOString(),
//           sourceUrl: sender.tab?.url || "unknown",
//         });

//         await chrome.storage.local.set({ contextCards: cards });
//         console.log(
//           "✅ Content saved successfully. Total cards:",
//           cards.length
//         );

//         sendResponse({ success: true, total: cards.length });
//       } catch (err: any) {
//         console.error("❌ Storage error:", err);
//         sendResponse({ success: false, error: err.message });
//       }
//     })();

//     return true; // Keep channel open for async response
//   }

//   // --- Automated test message handler ---
//   if (message.type === "TEST_SAVE") {
//     console.log("🧪 Test message received:", message);
//     (async () => {
//       const result = await chrome.storage.local.get(["contextCards"]);
//       const cards = result.contextCards || [];
//       cards.push({
//         content: message.data?.content || "Automated test",
//         savedAt: new Date().toISOString(),
//         sourceUrl: "internal-test",
//       });
//       await chrome.storage.local.set({ contextCards: cards });
//       console.log("✅ Test card saved. Total:", cards.length);
//       sendResponse({ success: true, total: cards.length });
//     })();
//     return true;
//   }

//   // --- Default fallback response ---
//   sendResponse({ success: true, received: message });
//   return true;
// });

// // Verify that Chrome storage is writable
// chrome.storage.local.set({ test: "Background active" }, () => {
//   console.log("✅ TEST: Storage write successful");
// });

// console.log("🎯 TEST: Background setup complete");



// ===============================
// CardContext - Background Script
// Stable Final Version
// ===============================

console.log("🎯 TEST: Background script LOADED");

// Handle incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📡 Message received:", message);

  // --- Save context card from content script ---
  if (message.type === "SAVE_CONTEXT_CARD") {
    const text = message.data?.content || "";
    console.log("💾 Saving content:", text.substring(0, 200));

    (async () => {
      try {
        const result = await chrome.storage.local.get(["contextCards"]);
        const cards = result.contextCards || [];

        cards.push({
          content: text,
          savedAt: new Date().toISOString(),
          sourceUrl: sender?.tab?.url || message.data?.source || "unknown",
        });

        await chrome.storage.local.set({ contextCards: cards });
        console.log("✅ Content saved successfully. Total cards:", cards.length);

        sendResponse({ success: true, total: cards.length });
      } catch (err: any) {
        console.error("❌ Storage error:", err);
        sendResponse({ success: false, error: err?.message || String(err) });
      }
    })();

    return true; // Keep channel open for async response
  }

  // --- Automated test message handler ---
  if (message.type === "TEST_SAVE") {
    console.log("🧪 Test message received:", message);
    (async () => {
      try {
        const result = await chrome.storage.local.get(["contextCards"]);
        const cards = result.contextCards || [];
        cards.push({
          content: message.data?.content || "Automated test",
          savedAt: new Date().toISOString(),
          sourceUrl: "internal-test",
        });
        await chrome.storage.local.set({ contextCards: cards });
        console.log("✅ Test card saved. Total:", cards.length);
        sendResponse({ success: true, total: cards.length });
      } catch (err: any) {
        console.error("❌ Test storage error:", err);
        sendResponse({ success: false, error: err?.message || String(err) });
      }
    })();
    return true;
  }

  // --- Default fallback response ---
  sendResponse({ success: true, received: message });
  return true;
});

// Verify storage write at startup
chrome.storage.local.set({ test: "Background active" }, () => {
  console.log("✅ TEST: Storage write successful");
});

console.log("🎯 TEST: Background setup complete");
