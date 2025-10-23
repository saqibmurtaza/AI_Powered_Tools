import {
  getSelectedText,
  getSelectionRect,
  isTrivialSelection,
} from "./utils/selection";
import { debounce } from "./utils/debounce";

// --- Detect PDF Viewer ---
(() => {
  try {
    const isPdf =
      window.location.href.endsWith(".pdf") ||
      document.contentType === "application/pdf";

    if (isPdf) {
      console.log("⚠️ PDF detected: Skipping injection for PDF viewer.");
      try {
        chrome.runtime.sendMessage({
          type: "PDF_VIEWER_NOTICE",
          data: {
            message:
              "📄 CardContext can’t capture text on PDF pages due to Chrome restrictions.",
          },
        });
      } catch (e) {
        // ignore
      }
      return;
    }
  } catch (err) {
    console.warn("PDF detection failed gracefully:", err);
  }
})();

function signalExtensionActiveToPage() {
  try {
    const attach = (attempt = 0) => {
      const container = document.documentElement || document.head || document.body;
      if (!container) {
        if (attempt < 5) {
          window.setTimeout(() => attach(attempt + 1), 100);
        }
        return;
      }

      try {
        const injected = document.createElement("script");
        injected.type = "text/javascript";
        injected.textContent = `
          try {
            window.__CARDCONTEXT_EXTENSION_ACTIVE__ = true;
            window.__CARDCONTEXT_EXTENSION_TIMESTAMP__ = Date.now();
          } catch (e) {}
        `;
        container.appendChild(injected);
        injected.parentNode?.removeChild(injected);
      } catch (e) {}

      try {
        document.documentElement.setAttribute("data-cardcontext", "1");
      } catch (e) {}
    };

    attach();
  } catch (e) {}
}

// call early
signalExtensionActiveToPage();

(window as any).__CARDCONTEXT_EXTENSION_ACTIVE__ = true;

console.log("🎯 CardContext content script initialized.");

let currentButton: HTMLButtonElement | null = null;

function createFloatingButton(): HTMLButtonElement {
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

function sendMessageToBackground(message: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const doSend = () =>
      new Promise<any>((res, rej) => {
        try {
          chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime?.lastError) {
              rej(chrome.runtime.lastError);
            } else {
              res(response);
            }
          });
        } catch (err) {
          rej(err);
        }
      });

    try {
      const resp = await doSend();
      return resolve(resp);
    } catch (err: any) {
      const msg = String(err && err.message ? err.message : err);
      if (msg.includes("Extension context invalidated")) {
        await new Promise((r) => setTimeout(r, 1000));
        try {
          const retryResp = await doSend();
          return resolve(retryResp);
        } catch (retryErr) {
          return reject(retryErr);
        }
      }
      return reject(err);
    }
  });
}

function fallbackSaveToStorageSafe(
  card: any,
  onSuccess: () => void,
  onFail: (err: any) => void
) {
  try {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      onFail(new Error("chrome.storage.local not available"));
      return;
    }

    chrome.storage.local.get(["contextCards"], (res) => {
      const existing = Array.isArray(res.contextCards) ? res.contextCards : [];
      const entry = {
        id: card.id ?? `c-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        ...card,
      };
      const updated = [entry, ...existing];
      chrome.storage.local.set({ contextCards: updated }, () => {
        if (chrome.runtime?.lastError) {
          onFail(chrome.runtime.lastError);
          return;
        }
        console.log("✅ selection saved via fallback storage (content script)");
        onSuccess();
      });
    });
  } catch (error) {
    console.error("❌ Exception in fallbackSaveToStorage:", error);
    onFail(error);
  }
}

async function saveSelectionWithFallback(
  selectionText: string,
  buttonElement: HTMLButtonElement | null,
  payload: any
) {
  if (buttonElement) buttonElement.setAttribute("data-saving", "1");

  try {
    const response = await sendMessageToBackground(payload);
    if (response?.success) {
      buttonElement?.removeAttribute("data-saving");
      hideAndRemoveButton(buttonElement);
      return;
    }
    fallbackSaveToStorageSafe(
      payload.data,
      () => {
        buttonElement?.removeAttribute("data-saving");
        hideAndRemoveButton(buttonElement);
      },
      (err) => {
        console.error("❌ fallback also failed:", err);
        buttonElement?.removeAttribute("data-saving");
        buttonElement?.classList.add("save-failed");
      }
    );
  } catch (err) {
    fallbackSaveToStorageSafe(
      payload.data,
      () => {
        buttonElement?.removeAttribute("data-saving");
        hideAndRemoveButton(buttonElement);
      },
      (e) => {
        console.error("❌ fallback also failed:", e);
        buttonElement?.removeAttribute("data-saving");
        buttonElement?.classList.add("save-failed");
      }
    );
  }
}

const handleSelectionChange = debounce((e: MouseEvent) => {
  const selectedText = getSelectedText();
  if (isTrivialSelection(selectedText)) {
    hideAndRemoveButton(currentButton);
    return;
  }

  const rect = getSelectionRect();
  const button = createFloatingButton();

  const x = rect ? rect.left + rect.width + 10 : e.pageX + 10;
  const y = rect ? rect.top : e.pageY + 10;

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  button.style.opacity = "1";

  // clear previous onclick
  button.onclick = null;

  button.onclick = async (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    // --- PROMPT FOR MANUAL TITLE ---
    let title = prompt("Enter a title for this selection:", "");
    if (!title || !title.trim()) title = "Untitled";

    const payload = {
      type: "SAVE_CONTEXT_CARD",
      data: {
        content: selectedText,
        title,
        savedAt: new Date().toISOString(),
      },
    };

    await saveSelectionWithFallback(selectedText, button, payload);
  };
}, 150);

document.addEventListener("mouseup", handleSelectionChange);
window.addEventListener("scroll", () => hideAndRemoveButton(currentButton));
document.addEventListener("mousedown", (evt) => {
  if (evt.target !== currentButton) hideAndRemoveButton(currentButton);
});

console.log("🎯 CardContext content script ready!");
