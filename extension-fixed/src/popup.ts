// console.log('🎯 CardContext popup loaded');

// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const result = await chrome.storage.local.get(['contextCards']);
//         const cards = result.contextCards || [];
//         const statusElement = document.getElementById('status');
        
//         if (statusElement) {
//             if (cards.length === 0) {
//                 statusElement.textContent = 'No context cards saved yet.';
//                 statusElement.style.color = '#666';
//             } else {
//                 statusElement.innerHTML = `
//                     <strong>${cards.length} context card(s) saved:</strong>
//                     <ul style="margin: 8px 0; padding-left: 16px; font-size: 12px;">
//                         ${cards.slice(0, 5).map((card: any) => 
//                             `<li title="${card.content}">${card.content.substring(0, 40)}...</li>`
//                         ).join('')}
//                     </ul>
//                     ${cards.length > 5 ? `<em>... and ${cards.length - 5} more</em>` : ''}
//                 `;
//             }
//         }
        
//         console.log('📊 Stored context cards:', cards);
//     } catch (error) {
//         console.error('❌ Popup error:', error);
//         const statusElement = document.getElementById('status');
//         if (statusElement) {
//             statusElement.textContent = 'Error loading context cards';
//             statusElement.style.color = 'red';
//         }
//     }
// });


// // Popup script - reads/writes chrome.storage and updates UI
// async function loadCards() {
//   const container = document.getElementById("cardsContainer")!;
//   container.innerHTML = "Loading…";
//   try {
//     const result = await chrome.storage.local.get(["contextCards"]);
//     const cards = result.contextCards || [];
//     if (!cards.length) {
//       container.innerHTML = "<div>No context cards saved.</div>";
//       return;
//     }
//     container.innerHTML = "";
//     for (const c of cards.slice().reverse()) {
//       const el = document.createElement("div");
//       el.className = "card";
//       el.innerHTML = `<div>${escapeHtml(String(c.content)).slice(0, 400)}</div>
//                       <div class="meta">${escapeHtml(String(c.sourceUrl || ""))} • ${new Date(c.savedAt).toLocaleString()}</div>`;
//       container.appendChild(el);
//     }
//   } catch (err) {
//     container.innerHTML = "Error loading cards.";
//     console.error(err);
//   }
// }

// async function clearCards() {
//   if (!confirm("Clear all saved context cards?")) return;
//   await chrome.storage.local.set({ contextCards: [] });
//   loadCards();
// }

// function escapeHtml(str: string) {
//   return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m] || m));
// }

// document.getElementById("refreshBtn")!.addEventListener("click", loadCards);
// document.getElementById("clearBtn")!.addEventListener("click", clearCards);

// // Initial load
// loadCards();


console.log("🧩 Popup script loaded");

/**
 * Load saved cards from chrome.storage.local
 */
async function loadCards() {
  const cardsContainer = document.getElementById("cards") as HTMLElement;
  if (!cardsContainer) {
    console.warn("⚠️ cardsContainer not found");
    return;
  }

  try {
    console.log("📦 Loading cards from storage...");
    const result = await chrome.storage.local.get(["contextCards"]);
    const cards = result.contextCards || [];

    if (!cards.length) {
      cardsContainer.innerHTML = `<div class="empty">No saved cards yet.</div>`;
      console.log("ℹ️ No cards found.");
      return;
    }

    cardsContainer.classList.remove("empty");
    cardsContainer.innerHTML = cards
      .map(
        (c: any) => `
        <div class="card">
          <div>${c.content || "(No content)"}</div>
          <div style="font-size:0.75em;color:#666;margin-top:4px;">
            Saved: ${new Date(c.savedAt).toLocaleString()}
          </div>
        </div>
      `
      )
      .join("");

    console.log(`✅ Loaded ${cards.length} cards.`);
  } catch (error) {
    console.error("❌ Error loading cards:", error);
    cardsContainer.innerHTML = `<div class="empty">Error loading cards</div>`;
  }
}

/**
 * Clear all cards from storage
 */
async function clearCards() {
  const cardsContainer = document.getElementById("cards") as HTMLElement;
  if (!cardsContainer) return;

  try {
    console.log("🗑️ Clearing all cards...");
    await chrome.storage.local.set({ contextCards: [] });
    cardsContainer.innerHTML = `<div class="empty">All cards cleared.</div>`;
  } catch (error) {
    console.error("❌ Error clearing cards:", error);
  }
}

// Wait until DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Popup DOM ready");

  const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement | null;
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCards);
  } else {
    console.warn("⚠️ clearBtn not found in DOM");
  }

  loadCards();
});

console.log("✅ Popup script initialized");
