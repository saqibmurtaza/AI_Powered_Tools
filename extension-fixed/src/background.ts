// background.ts
interface Card {
    id: string;
    title: string;
    content: string;
    description?: string;
    source?: string;
    timestamp: string;
    tags?: string[];
    sourceUrl?: string;
    createdAt?: string;
}

interface StorageResult {
    contextCards?: Card[];
}

console.log('🎯 Background script loaded');

// Initialize storage and context menu
chrome.runtime.onInstalled.addListener(() => {
    console.log('🔧 Extension installed/updated');
    initializeStorage();
    createContextMenu();
});

// Create context menu item
function createContextMenu(): void {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "saveToCardContext",
            title: "Save to CardContext",
            contexts: ["selection"]
        });
        console.log('📝 Context menu created');
    });
}

// Initialize storage with empty cards array if not exists
function initializeStorage(): void {
    chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
        if (!result.contextCards) {
            chrome.storage.local.set({ contextCards: [] }, () => {
                console.log('💾 Storage initialized with empty cards array');
            });
        } else {
            console.log(`💾 Storage loaded with ${result.contextCards.length} existing cards`);
        }
    });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId === "saveToCardContext" && info.selectionText && tab) {
        console.log('💾 Saving selected text as card');
        saveCardFromSelection(info.selectionText, tab);
    }
});

// Save card from selected text
async function saveCardFromSelection(selectedText: string, tab: chrome.tabs.Tab): Promise<void> {
    try {
        const cardData: Card = {
            id: 'card-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: tab.title || 'Untitled Card',
            content: selectedText,
            description: `From: ${tab.url || 'unknown'}`,
            source: tab.url || 'unknown',
            sourceUrl: tab.url || 'unknown',
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            tags: ['web-content']
        };

        // Get existing cards
        const result = await new Promise<StorageResult>((resolve) => {
            chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
                resolve(result);
            });
        });
        
        const existingCards = result.contextCards || [];
        const updatedCards = [cardData, ...existingCards];

        // Save to storage
        await new Promise<void>((resolve) => {
            chrome.storage.local.set({ contextCards: updatedCards }, () => {
                resolve();
            });
        });
        
        console.log('✅ Card saved successfully:', cardData.id);
        
        // Show notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon-128.png',
            title: 'CardContext',
            message: `Card saved: "${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}"`
        });

    } catch (error) {
        console.error('❌ Error saving card:', error);
    }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    console.log('📡 Background received message:', request);

    if (request.action === "contentScriptReady") {
        sendResponse({ status: 'ok', message: 'Background script ready' });
        return;
    }

    if (request.action === "getCards") {
        handleGetCards(sendResponse);
        return true; // Keep message channel open for async
    }

    if (request.action === "saveCard" && request.cardData) {
        handleSaveCard(request.cardData, sendResponse);
        return true; // Keep message channel open for async
    }

    console.warn('⚠️ Unhandled action:', request.action);
    sendResponse({ error: 'Unknown action' });
});

// Handle get cards request
async function handleGetCards(sendResponse: (response: any) => void): Promise<void> {
    try {
        const result = await new Promise<StorageResult>((resolve) => {
            chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
                resolve(result);
            });
        });
        
        const cards: Card[] = result.contextCards || [];
        console.log(`📚 Sending ${cards.length} cards to popup`);
        sendResponse({ cards: cards, success: true });
    } catch (error) {
        console.error('❌ Error getting cards:', error);
        sendResponse({ error: (error as Error).message, cards: [] });
    }
}

// Handle save card request
async function handleSaveCard(cardData: Card, sendResponse: (response: any) => void): Promise<void> {
    try {
        // Generate unique ID if not provided
        if (!cardData.id) {
            cardData.id = 'card-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        if (!cardData.timestamp) {
            cardData.timestamp = new Date().toISOString();
            cardData.createdAt = new Date().toISOString();
        }

        // Get existing cards
        const result = await new Promise<StorageResult>((resolve) => {
            chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
                resolve(result);
            });
        });
        
        const existingCards = result.contextCards || [];
        const updatedCards = [cardData, ...existingCards];

        // Save to storage
        await new Promise<void>((resolve) => {
            chrome.storage.local.set({ contextCards: updatedCards }, () => {
                resolve();
            });
        });
        
        console.log('✅ Card saved via message:', cardData.id);
        sendResponse({ success: true, cardId: cardData.id });
        
    } catch (error) {
        console.error('❌ Error saving card via message:', error);
        sendResponse({ success: false, error: (error as Error).message });
    }
}

console.log('🎯 Background script setup complete');