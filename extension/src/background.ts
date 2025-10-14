// Background script for CardContext - Manifest V3
console.log('🎯 CardContext background script LOADED');

// Test storage on startup
chrome.storage.local.get(['contextCards']).then((result) => {
  console.log('📊 Startup: Found', result.contextCards?.length || 0, 'context cards');
});

// Message listener - IMPROVED LOGGING
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 BACKGROUND: Received message type:', message.type);
  console.log('📨 BACKGROUND: Message details:', message);
  console.log('📨 BACKGROUND: Sender tab:', sender.tab?.url);
  
  if (message.type === 'CAPTURE_SELECTION') {
    console.log('🔄 BACKGROUND: Processing capture selection...');
    
    // Handle the capture asynchronously
    handleCaptureSelection(message.data)
      .then((card) => {
        console.log('✅ BACKGROUND: Capture successful, card saved:', card.id);
        sendResponse({ success: true, cardId: card.id });
      })
      .catch((error) => {
        console.error('❌ BACKGROUND: Capture failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
  
  console.log('⚠️ BACKGROUND: Unknown message type:', message.type);
  sendResponse({ success: false, error: 'Unknown message type' });
});

async function handleCaptureSelection(data: any) {
  console.log('💾 BACKGROUND: Saving selection:', data.content.substring(0, 30) + '...');
  
  // Create context card
  const contextCard = {
    id: 'card_' + Date.now(),
    content: data.content,
    source: data.source,
    title: data.title,
    url: data.url,
    createdAt: new Date().toISOString(),
  };
  
  console.log('💾 BACKGROUND: Created card:', contextCard);
  
  // Get existing cards
  const result = await chrome.storage.local.get(['contextCards']);
  console.log('💾 BACKGROUND: Existing storage result:', result);
  
  const existingCards = result.contextCards || [];
  console.log('💾 BACKGROUND: Existing cards count:', existingCards.length);
  
  // Add new card to beginning
  const updatedCards = [contextCard, ...existingCards];
  console.log('💾 BACKGROUND: Updated cards count:', updatedCards.length);
  
  // Save back to storage
  console.log('💾 BACKGROUND: Saving to storage...');
  await chrome.storage.local.set({ contextCards: updatedCards });
  console.log('✅ BACKGROUND: Saved to storage!');
  
  // Verify the save
  const verify = await chrome.storage.local.get(['contextCards']);
  console.log('🔍 BACKGROUND: Verification - stored cards:', verify.contextCards?.length || 0);
  
  return contextCard;
}

console.log('🎯 Background script ready for messages');