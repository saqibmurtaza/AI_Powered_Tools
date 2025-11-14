// contentScript.ts
console.log('✅ CardContext content script loaded');

// Floating button functionality
let currentButton: HTMLButtonElement | null = null;

function createFloatingButton(): HTMLButtonElement {
  if (currentButton && document.body.contains(currentButton)) return currentButton;

  const button = document.createElement("button");
  button.id = "cardContextFloatingBtn";
  button.textContent = "Add to CardContext";
  Object.assign(button.style, {
    position: "fixed",
    zIndex: "999999",
    padding: "8px 16px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease-in-out",
    opacity: "0",
    pointerEvents: "none",
  });

  document.body.appendChild(button);
  currentButton = button;
  return button;
}

function hideAndRemoveButton(button: HTMLButtonElement | null) {
  if (!button) return;
  button.style.opacity = "0";
  button.style.pointerEvents = "none";
  setTimeout(() => {
    if (button.parentNode) {
      button.parentNode.removeChild(button);
    }
    if (currentButton === button) currentButton = null;
  }, 200);
}

function getSelectedText(): string {
  return window.getSelection()?.toString().trim() || '';
}

function isTrivialSelection(text: string): boolean {
  return text.length < 2 || text.length > 10000;
}

function getSelectionRect(): DOMRect | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0);
  return range.getBoundingClientRect();
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Handle text selection and show floating button
const handleSelectionChange = debounce((e: MouseEvent) => {
  const selectedText = getSelectedText();
  
  if (isTrivialSelection(selectedText)) {
    hideAndRemoveButton(currentButton);
    return;
  }

  const rect = getSelectionRect();
  if (!rect) return;

  const button = createFloatingButton();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  // Position button near selection
  const x = rect.left + scrollX;
  const y = rect.top + scrollY - 50; // Position above selection

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  button.style.opacity = "1";
  button.style.pointerEvents = "auto";

  // Remove existing click listeners to prevent duplicates
  const newButton = button.cloneNode(true) as HTMLButtonElement;
  button.parentNode?.replaceChild(newButton, button);
  currentButton = newButton;

  newButton.onclick = async (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    // Get title from user
    let title = prompt("Enter a title for this selection:", "") || "Untitled";
    
    // Get description (optional)
    let description = prompt("Enter a description (optional):", "") || "";
    
    // Get tags (comma-separated)
    let tagsInput = prompt("Enter tags (comma-separated, optional):", "") || "";
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    const cardData = {
      title,
      content: selectedText,
      description,
      tags,
      sourceUrl: window.location.href,
      timestamp: new Date().toISOString(),
      type: 'text' as const,
      metadata: {
        wordCount: selectedText.split(/\s+/).length,
        characterCount: selectedText.length,
        domain: new URL(window.location.href).hostname
      }
    };

    try {
      // Save card via background script
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { 
            action: "saveCard", 
            cardData 
          }, 
          resolve
        );
      });

      if (response && (response as any).success) {
        console.log('✅ Card saved via floating button');
        hideAndRemoveButton(newButton);
      } else {
        console.error('❌ Failed to save card');
      }
    } catch (error) {
      console.error('❌ Error saving card:', error);
    }
  };
}, 300);

// Event listeners for selection
document.addEventListener("mouseup", handleSelectionChange);
window.addEventListener("scroll", () => hideAndRemoveButton(currentButton));
document.addEventListener("mousedown", (evt) => {
  if (evt.target !== currentButton) hideAndRemoveButton(currentButton);
});

// Context menu functionality (keep existing)
document.addEventListener('contextmenu', (event: MouseEvent) => {
  const selectedText = getSelectedText();
  if (selectedText && selectedText.length > 0) {
    console.log('📝 Text selected for card creation:', selectedText.substring(0, 100));
    
    chrome.storage.local.set({ 
      lastSelectedText: selectedText,
      lastPageUrl: window.location.href,
      lastPageTitle: document.title
    });
  }
});

// Message handling (keep existing)
chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  console.log('📡 Content script received message:', request);
  
  if (request.action === "getSelectedText") {
    const selectedText = getSelectedText();
    const response = {
      text: selectedText,
      pageUrl: window.location.href,
      pageTitle: document.title
    };
    sendResponse(response);
  }
  
  return true;
});

// Test connection to background
chrome.runtime.sendMessage({ action: "contentScriptReady" }, (response: any) => {
  if (response && response.status === 'ok') {
    console.log('✅ Content script successfully connected to background');
  } else {
    console.error('❌ Content script failed to connect to background');
  }
});

console.log('🎯 CardContext content script ready with floating button!');