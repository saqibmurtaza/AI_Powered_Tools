console.log("🧩 Popup script loaded");

function renderCards(cards: any[]) {
  const cardsContainer = document.getElementById("cards") as HTMLElement | null;
  if (!cardsContainer) return;

  if (!cards || !cards.length) {
    cardsContainer.classList.add("empty");
    cardsContainer.innerHTML = `<div class="empty">No saved cards yet.</div>`;
    console.log("ℹ️ No cards found.");
    return;
  }

  cardsContainer.classList.remove("empty");

  const rows = cards.map((c: any) => {
    const content = String(c.content ?? c.text ?? "(No content)");
    const savedAt = c.createdAt ? new Date(c.createdAt).toLocaleString() : "Unknown";
    const source = c.sourceUrl || "";

    return `
      <div class="card" data-card-id="${c.id ?? ""}">
        <div class="card-content">${content}</div>
        <div class="card-meta">
          <span>Saved: ${savedAt}</span><br>
          ${source ? `<a href="${source}" target="_blank">Open Source</a>` : ""}
        </div>
      </div>
    `;
  });

  cardsContainer.innerHTML = rows.join("");
}

async function loadCards() {
  const cardsContainer = document.getElementById("cards") as HTMLElement | null;
  if (!cardsContainer) return;

  try {
    console.log("📦 Requesting cards from background");
    chrome.runtime.sendMessage({ type: "GET_CARDS" }, (response) => {
      const cards = response?.cards ?? [];
      if (!cards.length) {
        cardsContainer.innerHTML = `<div class="empty">No saved cards yet.</div>`;
      } else {
        renderCards(cards);
      }
    });
  } catch (err) {
    console.error("❌ Popup loadCards error:", err);
    cardsContainer.innerHTML = `<div class="empty">Error loading cards</div>`;
  }
}

function clearCards() {
  const cardsContainer = document.getElementById("cards") as HTMLElement | null;
  if (!cardsContainer) return;

  chrome.storage.local.set({ contextCards: [] }, () => {
    cardsContainer.classList.add("empty");
    cardsContainer.innerHTML = `<div class="empty">All local cards cleared.</div>`;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ Popup DOM ready");

  const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement | null;
  if (clearBtn) clearBtn.addEventListener("click", clearCards);

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tabs[0]?.url || "";
  console.log("🔍 Active tab URL:", url);

  if (url.startsWith("chrome-extension://") && url.includes("mhjfbmdgcfjbbpaeojofohoefgiehjai")) {
    const cardsContainer = document.getElementById("cards") as HTMLElement;
    cardsContainer.innerHTML = `
      <div class="empty" style="color:#9333ea;font-weight:600;text-align:center;margin-top:1rem;">
        ⚠️ PDF pages are not supported in Chrome’s built-in viewer.<br>
        Please open in a web viewer or download the PDF.
      </div>`;
    return;
  }

  await loadCards();
});
