// console.log("🎯 CardContext content script ready!");

// // --- Diagnostic Chrome API Check ---
// console.log("🔍 Chrome API check:");
// console.log("chrome:", typeof chrome !== "undefined" ? chrome : "❌ missing");
// console.log("chrome.runtime:", chrome?.runtime || "❌ missing");
// console.log("chrome.runtime.id:", chrome?.runtime?.id || "❌ missing");
// console.log("Extension context available:", !!chrome?.runtime?.id);

// if (chrome?.runtime?.id) {
//   console.log(
//     "✅ Chrome runtime API available, extension ID:",
//     chrome.runtime.id
//   );
// } else {
//   console.error("❌ Chrome runtime API not available - messaging will fail!");
// }

// // --- Automated Test (optional sanity check) ---
// (async () => {
//   try {
//     console.log("🧪 Sending automated test message...");
//     const response = await chrome.runtime.sendMessage({
//       type: "TEST_SAVE",
//       data: { content: "Automated test content" },
//     });
//     console.log("🧪 Test response:", response);
//   } catch (err) {
//     console.error("🧪 Test failed:", err);
//   }
// })();

// // ===============================
// // Floating Button Logic
// // ===============================

// let currentButton: HTMLButtonElement | null = null;

// function createFloatingButton(): HTMLButtonElement {
//   // Reuse button if it exists
//   if (!currentButton) {
//     const button = document.createElement("button");
//     button.id = "cardContextFloatingBtn";
//     button.textContent = "Add to Context";
//     button.style.position = "absolute";
//     button.style.zIndex = "99999";
//     button.style.padding = "6px 12px";
//     button.style.background = "#4f46e5";
//     button.style.color = "#fff";
//     button.style.border = "none";
//     button.style.borderRadius = "8px";
//     button.style.cursor = "pointer";
//     button.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
//     button.style.fontSize = "14px";
//     button.style.transition = "opacity 0.2s ease-in-out";
//     button.style.opacity = "0";
//     document.body.appendChild(button);
//     currentButton = button;
//   }
//   return currentButton;
// }

// // --- Handle Text Selection ---
// document.addEventListener("mouseup", (e) => {
//   const selection = window.getSelection();
//   const text = selection?.toString().trim();

//   if (text) {
//     console.log("📝 Text selected:", text);

//     const button = createFloatingButton();
//     const x = e.pageX + 10;
//     const y = e.pageY + 10;

//     button.style.left = `${x}px`;
//     button.style.top = `${y}px`;
//     button.style.opacity = "1";

//     console.log("✅ Floating button added at position:", { x, y });

//     // Rebind click listener every time
//     button.onclick = async () => {
//       console.log("🧩 Sending selected text to background:", text);
//       try {
//         const response = await chrome.runtime.sendMessage({
//           type: "SAVE_CONTEXT_CARD",
//           data: { content: text },
//         });

//         console.log("🧩 Background response:", response);

//         // Hide button smoothly
//         button.style.opacity = "0";
//         setTimeout(() => {
//           if (button.parentNode) button.parentNode.removeChild(button);
//           currentButton = null;
//         }, 300);
//       } catch (err) {
//         console.error("❌ Failed to send message:", err);
//       }
//     };
//   } else if (currentButton) {
//     // Hide button if user clicks elsewhere
//     currentButton.style.opacity = "0";
//     setTimeout(() => {
//       if (currentButton?.parentNode)
//         currentButton.parentNode.removeChild(currentButton);
//       currentButton = null;
//     }, 200);
//   }
// });

// // --- Initialization confirmation ---
// console.log("🎯 CardContext content script initialized.");



// ===============================
// CardContext - Content Script
// Stable Final Version
// ===============================

console.log("🎯 CardContext content script ready!");

// --- Diagnostic Chrome API Check ---
console.log("🔍 Chrome API check:");
console.log("chrome:", typeof chrome !== "undefined" ? chrome : "❌ missing");
console.log("chrome.runtime:", chrome?.runtime || "❌ missing");
console.log("chrome.runtime.id:", chrome?.runtime?.id || "❌ missing");
console.log("Extension context available:", !!chrome?.runtime?.id);

if (chrome?.runtime?.id) {
  console.log("✅ Chrome runtime API available, extension ID:", chrome.runtime.id);
} else {
  console.error("❌ Chrome runtime API not available - messaging will fail!");
}

// --- Automated Test (sanity) ---
(async () => {
  try {
    console.log("🧪 Sending automated test message...");
    const response = await chrome.runtime.sendMessage({
      type: "TEST_SAVE",
      data: { content: "Automated test content" },
    });
    console.log("🧪 Test response:", response);
  } catch (err) {
    console.error("🧪 Test failed:", err);
  }
})();

// ===============================
// Floating Button Logic
// ===============================

let currentButton: HTMLButtonElement | null = null;

function createFloatingButton(): HTMLButtonElement {
  // Reuse existing button instance
  if (!currentButton) {
    const button = document.createElement("button");
    button.id = "cardContextFloatingBtn";
    button.textContent = "Add to Context";
    button.style.position = "absolute";
    button.style.zIndex = "999999";
    button.style.padding = "6px 12px";
    button.style.background = "#4f46e5";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "8px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    button.style.fontSize = "14px";
    button.style.transition = "opacity 0.18s ease-in-out";
    button.style.opacity = "0";
    document.body.appendChild(button);
    currentButton = button;
  }
  return currentButton;
}

function hideAndRemoveButton(button: HTMLButtonElement | null) {
  if (!button) return;
  button.style.opacity = "0";
  setTimeout(() => {
    if (button.parentNode) button.parentNode.removeChild(button);
    if (currentButton === button) currentButton = null;
  }, 250);
}

// Handle user text selection and show floating button
document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();
  const text = selection?.toString().trim();

  if (text && text.length > 2) {
    console.log("📝 Text selected:", text.substring(0, 200));
    const button = createFloatingButton();
    const x = e.pageX + 10;
    const y = e.pageY + 10;
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.opacity = "1";

    // Always attach a fresh onclick so the handler context is correct
    button.onclick = async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      console.log("🧩 Sending selected text to background:", text.substring(0, 200));
      try {
        const response = await chrome.runtime.sendMessage({
          type: "SAVE_CONTEXT_CARD",
          data: { content: text },
        });
        console.log("🧩 Background response:", response);
        // give UX feedback by hiding button
        hideAndRemoveButton(button);
      } catch (err) {
        console.error("❌ Failed to send message:", err);
        // still remove UI gracefully
        hideAndRemoveButton(button);
      }
    };
  } else {
    // no selection -> remove button
    hideAndRemoveButton(currentButton);
  }
});

// Hide button when user scrolls or clicks elsewhere
window.addEventListener("scroll", () => hideAndRemoveButton(currentButton));
document.addEventListener("mousedown", (evt) => {
  if (evt.target !== currentButton) hideAndRemoveButton(currentButton);
});

console.log("🎯 CardContext content script initialized.");
