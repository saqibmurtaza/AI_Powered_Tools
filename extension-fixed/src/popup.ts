// // popup.ts
// interface Card {
//     id: string;
//     title: string;
//     content: string;
//     description?: string;
//     source?: string;
//     timestamp: string;
//     tags?: string[];
//     sourceUrl?: string;
//     createdAt?: string;
//     metadata?: {
//         wordCount?: number;
//         characterCount?: number;
//         domain?: string;
//     };
//     summary?: string;
//     aiSummary?: string;
//     selected?: boolean; // New: Track card selection
// }

// interface StorageResult {
//     contextCards?: Card[];
//     collectiveSummary?: string; // New: Store collective summaries
// }

// interface AISettings {
//     baseUrl: string;
//     apiKey: string;
//     model: string;
//     enabled: boolean;
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     console.log('🎯 Popup loaded');
    
//     const cardsContainer = document.getElementById('cards') as HTMLDivElement;
//     const cardsCount = document.getElementById('cardsCount') as HTMLSpanElement;
//     const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
//     const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
//     const aiSummary = document.getElementById('aiSummary') as HTMLDivElement;
    
//     // AI Settings elements
//     const toggleAISettings = document.getElementById('toggleAISettings') as HTMLButtonElement;
//     const aiSettings = document.getElementById('aiSettings') as HTMLDivElement;
//     const aiBaseUrl = document.getElementById('aiBaseUrl') as HTMLInputElement;
//     const aiApiKey = document.getElementById('aiApiKey') as HTMLInputElement;
//     const aiModel = document.getElementById('aiModel') as HTMLInputElement;
//     const saveAISettings = document.getElementById('saveAISettings') as HTMLButtonElement;
//     const aiStatusText = document.getElementById('aiStatusText') as HTMLSpanElement;

//     let currentAISettings: AISettings = {
//         baseUrl: '',
//         apiKey: '',
//         model: 'gemini-pro',
//         enabled: false
//     };

//     // Load AI settings and cards
//     await loadAISettings();
//     await loadCards();
    
//     // Initialize selection tracking
//     setupSelectionTracking();

//     // AI Settings toggle
//     toggleAISettings.addEventListener('click', () => {
//         aiSettings.style.display = aiSettings.style.display === 'none' ? 'block' : 'none';
//     });

//     // Save AI settings
//     saveAISettings.addEventListener('click', async () => {
//         await saveAISettingsToStorage();
//     });

//     clearBtn.addEventListener('click', async () => {
//         if (confirm('Are you sure you want to clear all cards? This action cannot be undone.')) {
//             await new Promise<void>((resolve) => {
//                 chrome.storage.local.set({ contextCards: [], collectiveSummary: '' }, () => {
//                     resolve();
//                 });
//             });
//             await loadCards();
//             console.log('✅ All cards cleared');
//         }
//     });

//     exportBtn.addEventListener('click', exportCards);

//     async function loadAISettings(): Promise<void> {
//         try {
//             const result = await new Promise<{ aiSettings?: AISettings }>((resolve) => {
//                 chrome.storage.local.get(['aiSettings'], (result) => {
//                     const settings = result as { aiSettings?: AISettings };
//                     resolve(settings);
//                 });
//             });
            
//             if (result.aiSettings) {
//                 currentAISettings = result.aiSettings;
//                 aiBaseUrl.value = currentAISettings.baseUrl;
//                 aiApiKey.value = currentAISettings.apiKey;
//                 aiModel.value = currentAISettings.model;
                
//                 updateAIStatus();
//             }
//         } catch (error) {
//             console.error('❌ Error loading AI settings:', error);
//         }
//     }

//     async function saveAISettingsToStorage(): Promise<void> {
//         currentAISettings = {
//             baseUrl: aiBaseUrl.value.trim(),
//             apiKey: aiApiKey.value.trim(),
//             model: aiModel.value.trim() || 'gemini-pro',
//             enabled: aiBaseUrl.value.trim() !== '' && aiApiKey.value.trim() !== ''
//         };

//         await new Promise<void>((resolve) => {
//             chrome.storage.local.set({ aiSettings: currentAISettings }, () => {
//                 resolve();
//             });
//         });

//         updateAIStatus();
//         aiSettings.style.display = 'none';
//         console.log('✅ AI settings saved');
//     }

//     function updateAIStatus(): void {
//         if (currentAISettings.enabled) {
//             aiStatusText.textContent = 'Ready';
//             aiStatusText.style.color = '#10b981';
//         } else {
//             aiStatusText.textContent = 'Configure settings';
//             aiStatusText.style.color = '#ef4444';
//         }
//     }

//     async function loadCards(): Promise<void> {
//         try {
//             console.log('📚 Loading cards...');
//             const result = await new Promise<StorageResult>((resolve) => {
//                 chrome.storage.local.get(['contextCards', 'collectiveSummary'], (result: StorageResult) => {
//                     resolve(result);
//                 });
//             });
            
//             const cards: Card[] = result.contextCards || [];
//             console.log(`✅ Loaded ${cards.length} cards from storage:`, cards);
            
//             renderCards(cards);
//             updateCardsCount(cards.length);
//             updateGlobalSummary(cards, result.collectiveSummary);
            
//         } catch (error) {
//             console.error('❌ Error loading cards:', error);
//             if (cardsContainer) {
//                 cardsContainer.innerHTML = '<div class="empty">Error loading cards</div>';
//             }
//         }
//     }

//     function renderCards(cards: Card[]): void {
//         if (!cardsContainer) return;

//         if (cards.length === 0) {
//             cardsContainer.innerHTML = '<div class="empty">No cards saved yet. Select text and use right-click → "Save to CardContext" to create cards.</div>';
//             return;
//         }

//         cards.sort((a, b) => {
//             const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
//             const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
//             return dateB - dateA;
//         });

//         cardsContainer.innerHTML = cards.map(card => `
//             <div class="card" data-card-id="${card.id}">
//                 <div class="card-header">
//                     <div class="card-selection">
//                         <input type="checkbox" class="card-checkbox" data-card-id="${card.id}" ${card.selected ? 'checked' : ''}>
//                         <h3 class="card-title">${escapeHtml(card.title || 'Untitled Card')}</h3>
//                     </div>
//                     <div class="card-actions">
//                         <button class="summary-btn" data-card-id="${card.id}" title="Generate Simple Summary">
//                             📝
//                         </button>
//                         ${currentAISettings.enabled ? `
//                         <button class="ai-summary-btn" data-card-id="${card.id}" title="Generate AI Summary">
//                             🤖
//                         </button>
//                         ` : ''}
//                     </div>
//                 </div>
//                 ${card.description ? `<div class="card-description">${escapeHtml(card.description)}</div>` : ''}
                
//                 ${card.summary ? `
//                 <div class="card-summary">
//                     <strong>Simple Summary:</strong> ${escapeHtml(card.summary)}
//                 </div>
//                 ` : ''}
                
//                 ${card.aiSummary ? `
//                 <div class="card-ai-summary">
//                     <strong>AI Summary:</strong> ${escapeHtml(card.aiSummary)}
//                 </div>
//                 ` : ''}
                
//                 <div class="card-content">${escapeHtml(card.content)}</div>
//                 ${card.tags && card.tags.length > 0 ? `
//                     <div class="card-tags">
//                         ${card.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
//                     </div>
//                 ` : ''}
//                 <div class="card-meta">
//                     ${formatDate(card.timestamp || card.createdAt)} • ${getSourceDisplay(card.source || card.sourceUrl)}
//                 </div>
//             </div>
//         `).join('');

//         // Event listeners for checkboxes
//         document.querySelectorAll('.card-checkbox').forEach(checkbox => {
//             checkbox.addEventListener('change', async (e) => {
//                 const cardId = (e.target as HTMLInputElement).getAttribute('data-card-id');
//                 const checked = (e.target as HTMLInputElement).checked;
                
//                 if (cardId) {
//                     await updateCardSelection(cardId, checked);
//                 }
//             });
//         });

//         // Event listeners for summary buttons
//         document.querySelectorAll('.summary-btn').forEach(button => {
//             button.addEventListener('click', (e) => {
//                 const cardId = (e.target as HTMLElement).closest('.summary-btn')?.getAttribute('data-card-id');
//                 if (cardId) {
//                     generateIndividualSummary(cardId);
//                 }
//             });
//         });

//         // Event listeners for AI summary buttons
//         if (currentAISettings.enabled) {
//             document.querySelectorAll('.ai-summary-btn').forEach(button => {
//                 button.addEventListener('click', (e) => {
//                     const cardId = (e.target as HTMLElement).closest('.ai-summary-btn')?.getAttribute('data-card-id');
//                     if (cardId) {
//                         generateAISummaryForCard(cardId);
//                     }
//                 });
//             });
//         }
//     }

//     async function updateCardSelection(cardId: string, selected: boolean): Promise<void> {
//         const cards = await getCardsFromStorage();
//         const cardIndex = cards.findIndex(c => c.id === cardId);
        
//         if (cardIndex !== -1) {
//             cards[cardIndex].selected = selected;
//             await saveCardsToStorage(cards);
            
//             // Update button states immediately with a small delay to ensure state is saved
//             setTimeout(updateButtonStates, 50);
            
//             // Show selection feedback
//             showNotification(`${selected ? 'Selected' : 'Deselected'} card: ${cards[cardIndex].title}`);
//         }
//     }

//     function updateSelectionCount(cards: Card[]): void {
//         const selectedCount = cards.filter(card => card.selected).length;
//         const selectionInfo = document.getElementById('selectionInfo');
        
//         if (selectionInfo) {
//             if (selectedCount > 0) {
//                 selectionInfo.textContent = `${selectedCount} card${selectedCount !== 1 ? 's' : ''} selected`;
//                 selectionInfo.style.display = 'block';
//             } else {
//                 selectionInfo.style.display = 'none';
//             }
//         }
//     }

//     function updateCardsCount(count: number): void {
//         if (cardsCount) {
//             cardsCount.textContent = count.toString();
//         }
//     }

//     function updateGlobalSummary(cards: Card[], collectiveSummary?: string): void {
//         if (!aiSummary) return;

//         if (cards.length === 0) {
//             aiSummary.innerHTML = `
//                 <div class="summary-header">
//                     <h3>Summary</h3>
//                 </div>
//                 <div class="summary-placeholder">Select text and use right-click → "Save to CardContext" to create cards</div>
//             `;
//             return;
//         }

//         // Show collective summary if it exists
//         if (collectiveSummary) {
//             aiSummary.innerHTML = `
//                 <div class="summary-header">
//                     <h3>Collective Summary</h3>
//                     <button class="refresh-btn" id="clearCollectiveSummary" title="Clear Collective Summary">🗑️</button>
//                 </div>
//                 <div class="summary-content">
//                     ${escapeHtml(collectiveSummary)}
//                 </div>
//                 <div class="summary-actions">
//                     <button class="summary-action-btn" id="backToGlobalSummary">← Back to Overview</button>
//                 </div>
//             `;

//             document.getElementById('clearCollectiveSummary')?.addEventListener('click', async () => {
//                 await new Promise<void>((resolve) => {
//                     chrome.storage.local.set({ collectiveSummary: '' }, () => {
//                         resolve();
//                     });
//                 });
//                 updateGlobalSummary(cards);
//             });

//             document.getElementById('backToGlobalSummary')?.addEventListener('click', () => {
//                 updateGlobalSummary(cards);
//             });
//             return;
//         }

//         const selectedCount = cards.filter(card => card.selected).length;
//         const summaryContent = generateGlobalSummary(cards);
        
//         aiSummary.innerHTML = `
//             <div class="summary-header">
//                 <h3>Summary</h3>
//                 <button class="refresh-btn" id="refreshGlobalSummary" title="Refresh Summary">↻</button>
//             </div>
//             <div class="summary-content">
//                 ${summaryContent}
//             </div>
//             <div class="selection-info" id="selectionInfo" style="display: ${selectedCount > 0 ? 'block' : 'none'}">
//                 ${selectedCount} card${selectedCount !== 1 ? 's' : ''} selected
//             </div>
//             <div class="summary-actions">
//                 <button class="summary-action-btn" id="generateGroupSummary" ${selectedCount === 0 ? 'disabled' : ''}>
//                     Simple Summary of Selected Cards
//                 </button>
//                 ${currentAISettings.enabled ? `
//                 <button class="summary-action-btn" id="generateAIGroupSummary" ${selectedCount === 0 ? 'disabled' : ''}>
//                     AI Summary of Selected Cards
//                 </button>
//                 ` : ''}
//                 <button class="summary-action-btn" id="selectAllCards">
//                     Select All Cards
//                 </button>
//                 <button class="summary-action-btn" id="clearSelection" ${selectedCount === 0 ? 'disabled' : ''}>
//                     Clear Selection
//                 </button>
//             </div>
//         `;

//         document.getElementById('refreshGlobalSummary')?.addEventListener('click', () => {
//             updateGlobalSummary(cards);
//         });

//         document.getElementById('generateGroupSummary')?.addEventListener('click', () => {
//             generateGroupSummary(cards);
//         });

//         if (currentAISettings.enabled) {
//             document.getElementById('generateAIGroupSummary')?.addEventListener('click', () => {
//                 generateAIGroupSummary(cards);
//             });
//         }

//         document.getElementById('selectAllCards')?.addEventListener('click', async () => {
//             await selectAllCards(true);
//         });

//         document.getElementById('clearSelection')?.addEventListener('click', async () => {
//             await selectAllCards(false);
//         });

//         updateSelectionCount(cards);
//     }

//     async function selectAllCards(selected: boolean): Promise<void> {
//         const cards = await getCardsFromStorage();
        
//         cards.forEach(card => {
//             card.selected = selected;
//         });
        
//         await saveCardsToStorage(cards);
//         renderCards(cards);
//         updateGlobalSummary(cards);
//     }

//     function showNotification(message: string, type: 'success' | 'info' | 'error' = 'info'): void {
//         // Remove existing notification if any
//         const existingNotification = document.getElementById('actionNotification');
//         if (existingNotification) {
//             existingNotification.remove();
//         }
        
//         const notification = document.createElement('div');
//         notification.id = 'actionNotification';
//         notification.textContent = message;
//         notification.style.cssText = `
//             position: fixed;
//             top: 10px;
//             right: 10px;
//             background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
//             color: white;
//             padding: 8px 12px;
//             border-radius: 4px;
//             font-size: 0.8em;
//             z-index: 1000;
//             animation: slideIn 0.3s ease;
//         `;
        
//         // Add CSS animation
//         if (!document.querySelector('#notificationStyles')) {
//             const style = document.createElement('style');
//             style.id = 'notificationStyles';
//             style.textContent = `
//                 @keyframes slideIn {
//                     from { transform: translateX(100%); opacity: 0; }
//                     to { transform: translateX(0); opacity: 1; }
//                 }
//             `;
//             document.head.appendChild(style);
//         }
        
//         document.body.appendChild(notification);
        
//         // Auto remove after 3 seconds
//         setTimeout(() => {
//             if (notification.parentNode) {
//                 notification.remove();
//             }
//         }, 3000);
//     }

//     async function updateButtonStates(): Promise<void> {
//         try {
//             const cards = await getCardsFromStorage();
//             const selectedCount = cards.filter(card => card.selected).length;
            
//             const generateGroupSummaryBtn = document.getElementById('generateGroupSummary') as HTMLButtonElement;
//             const generateAIGroupSummaryBtn = document.getElementById('generateAIGroupSummary') as HTMLButtonElement;
//             const clearSelectionBtn = document.getElementById('clearSelection') as HTMLButtonElement;
            
//             if (generateGroupSummaryBtn) {
//                 generateGroupSummaryBtn.disabled = selectedCount === 0;
//             }
            
//             if (generateAIGroupSummaryBtn) {
//                 generateAIGroupSummaryBtn.disabled = selectedCount === 0;
//             }
            
//             if (clearSelectionBtn) {
//                 clearSelectionBtn.disabled = selectedCount === 0;
//             }
            
//             // Update selection count display
//             updateSelectionCount(cards);
//         } catch (error) {
//             console.error('Error updating button states:', error);
//         }
//     }

//     function setupSelectionTracking(): void {
//         const cardsContainer = document.getElementById('cards') as HTMLDivElement;
//         if (cardsContainer) {
//             // Use a more reliable approach - check selection state on any interaction
//             cardsContainer.addEventListener('change', (e) => {
//                 if ((e.target as Element).classList.contains('card-checkbox')) {
//                     updateButtonStates();
//                 }
//             });

//             // Also update button states when cards are rendered
//             const observer = new MutationObserver((mutations) => {
//                 let shouldUpdate = false;
//                 mutations.forEach((mutation) => {
//                     if (mutation.type === 'childList') {
//                         shouldUpdate = true;
//                     }
//                 });
//                 if (shouldUpdate) {
//                     // Small delay to ensure DOM is fully updated
//                     setTimeout(updateButtonStates, 100);
//                 }
//             });
            
//             observer.observe(cardsContainer, {
//                 childList: true,
//                 subtree: false
//             });
//         }
//     }

//     // SIMPLE SUMMARY FUNCTIONS
//     async function generateIndividualSummary(cardId: string): Promise<void> {
//         const cards = await getCardsFromStorage();
//         const card = cards.find(c => c.id === cardId);
        
//         if (!card) {
//             console.error('❌ Card not found:', cardId);
//             return;
//         }

//         const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
//         if (cardElement) {
//             const summaryBtn = cardElement.querySelector('.summary-btn') as HTMLButtonElement;
//             summaryBtn.textContent = '⏳';
//             summaryBtn.disabled = true;
//         }

//         try {
//             const summary = await generateSimpleSummary(card);
            
//             card.summary = summary;
//             await saveCardsToStorage(cards);
            
//             renderCards(cards);
//             showNotification(`Simple summary generated for: ${card.title}`, 'success');
            
//             console.log('✅ Individual summary generated for card:', cardId);
//         } catch (error) {
//             console.error('❌ Error generating individual summary:', error);
//             showNotification('Failed to generate summary. Please try again.', 'error');
//         }
//     }

//     async function generateSimpleSummary(card: Card): Promise<string> {
//         const content = card.content;
//         const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
//         if (sentences.length <= 2) {
//             return content;
//         }

//         const keySentences = [
//             sentences[0],
//             ...sentences.filter(s => 
//                 s.length > 20 && 
//                 (s.includes(' important') || s.includes(' key') || s.includes(' summary') ||
//                  s.length > 50)
//             ).slice(0, 2)
//         ];

//         const uniqueSentences = Array.from(new Set(keySentences));
//         let summary = uniqueSentences.join('. ') + '.';
        
//         if (summary.length > 300) {
//             summary = summary.substring(0, 300) + '...';
//         }

//         return summary;
//     }

//     // NEW: Simple Group Summary for Selected Cards
//     async function generateGroupSummary(cards: Card[]): Promise<void> {
//         const selectedCards = cards.filter(card => card.selected);
        
//         if (selectedCards.length === 0) {
//             showNotification('Please select cards first by checking the checkboxes.', 'error');
//             return;
//         }

//         const groupSummaryBtn = document.getElementById('generateGroupSummary') as HTMLButtonElement;
//         const originalText = groupSummaryBtn.textContent;
//         groupSummaryBtn.textContent = 'Generating...';
//         groupSummaryBtn.disabled = true;

//         try {
//             const collectiveSummary = await generateCollectiveSimpleSummary(selectedCards);
            
//             // Save collective summary to storage
//             await new Promise<void>((resolve) => {
//                 chrome.storage.local.set({ collectiveSummary }, () => {
//                     resolve();
//                 });
//             });
            
//             updateGlobalSummary(cards, collectiveSummary);
//             showNotification(`Simple collective summary generated for ${selectedCards.length} selected cards`, 'success');
//             console.log('✅ Simple collective summary generated for', selectedCards.length, 'selected cards');
//         } catch (error) {
//             console.error('❌ Error generating simple collective summary:', error);
//             showNotification('Failed to generate collective summary.', 'error');
//         } finally {
//             groupSummaryBtn.textContent = originalText;
//             groupSummaryBtn.disabled = false;
//         }
//     }

//     async function generateCollectiveSimpleSummary(selectedCards: Card[]): Promise<string> {
//         const allContent = selectedCards.map(card => card.content).join('\n\n');
//         const allTitles = selectedCards.map(card => card.title).join(', ');
        
//         const commonWords = extractCommonThemes(selectedCards);
//         const tagGroups = groupCardsByTags(selectedCards);

//         let summary = `## Collective Summary of ${selectedCards.length} Selected Cards\n\n`;
//         summary += `**Selected Cards:** ${allTitles}\n\n`;

//         if (commonWords.length > 0) {
//             summary += `**Key Themes:** ${commonWords.slice(0, 5).join(', ')}\n\n`;
//         }

//         if (Object.keys(tagGroups).length > 0) {
//             summary += `**Content Categories:**\n`;
//             Object.entries(tagGroups).forEach(([tag, tagCards]) => {
//                 summary += `- ${tag}: ${tagCards.length} card${tagCards.length !== 1 ? 's' : ''}\n`;
//             });
//             summary += `\n`;
//         }

//         const recentCards = selectedCards.filter(card => {
//             const cardDate = new Date(card.timestamp || card.createdAt || '');
//             const daysAgo = (Date.now() - cardDate.getTime()) / (1000 * 60 * 60 * 24);
//             return daysAgo < 7;
//         });

//         if (recentCards.length > 0) {
//             summary += `**Recent Activity:** ${recentCards.length} cards saved in the last week\n\n`;
//         }

//         const avgLength = selectedCards.reduce((sum, card) => sum + card.content.length, 0) / selectedCards.length;
//         summary += `**Content Insights:** Average card length: ${Math.round(avgLength)} characters\n\n`;

//         summary += `**Summary:** This collection of ${selectedCards.length} cards covers `;
//         if (commonWords.length > 0) {
//             summary += `topics related to ${commonWords.slice(0, 3).join(', ')}. `;
//         }
//         summary += `Consider organizing these cards into focused groups based on their themes.`;

//         return summary;
//     }

//     // AI-POWERED SUMMARY FUNCTIONS
//     async function generateAISummaryForCard(cardId: string): Promise<void> {
//         if (!currentAISettings.enabled) {
//             showNotification('Please configure AI settings first.', 'error');
//             return;
//         }

//         const cards = await getCardsFromStorage();
//         const card = cards.find(c => c.id === cardId);
        
//         if (!card) {
//             console.error('❌ Card not found:', cardId);
//             return;
//         }

//         const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
//         if (cardElement) {
//             const aiSummaryBtn = cardElement.querySelector('.ai-summary-btn') as HTMLButtonElement;
//             aiSummaryBtn.textContent = '⏳';
//             aiSummaryBtn.disabled = true;
//         }

//         try {
//             const aiSummary = await callGeminiAI(card);
            
//             card.aiSummary = aiSummary;
//             await saveCardsToStorage(cards);
            
//             renderCards(cards);
//             showNotification(`AI summary generated for: ${card.title}`, 'success');
            
//             console.log('✅ AI summary generated for card:', cardId);
//         } catch (error) {
//             console.error('❌ Error generating AI summary:', error);
//             showNotification('Failed to generate AI summary. Please check your API settings.', 'error');
            
//             // Reset button state
//             const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
//             if (cardElement) {
//                 const aiSummaryBtn = cardElement.querySelector('.ai-summary-btn') as HTMLButtonElement;
//                 aiSummaryBtn.textContent = '🤖';
//                 aiSummaryBtn.disabled = false;
//             }
//         }
//     }

//     // NEW: AI Group Summary for Selected Cards
//     async function generateAIGroupSummary(cards: Card[]): Promise<void> {
//         if (!currentAISettings.enabled) {
//             showNotification('Please configure AI settings first.', 'error');
//             return;
//         }

//         const selectedCards = cards.filter(card => card.selected);
        
//         if (selectedCards.length === 0) {
//             showNotification('Please select cards first by checking the checkboxes.', 'error');
//             return;
//         }

//         const groupSummaryBtn = document.getElementById('generateAIGroupSummary') as HTMLButtonElement;
//         const originalText = groupSummaryBtn.textContent;
//         groupSummaryBtn.textContent = 'Generating AI Summary...';
//         groupSummaryBtn.disabled = true;

//         try {
//             const collectiveSummary = await generateCollectiveAISummary(selectedCards);
            
//             // Save collective summary to storage
//             await new Promise<void>((resolve) => {
//                 chrome.storage.local.set({ collectiveSummary }, () => {
//                     resolve();
//                 });
//             });
            
//             updateGlobalSummary(cards, collectiveSummary);
//             showNotification(`AI collective summary generated for ${selectedCards.length} selected cards`, 'success');
//             console.log('✅ AI collective summary generated for', selectedCards.length, 'selected cards');
//         } catch (error) {
//             console.error('❌ Error generating AI collective summary:', error);
//             showNotification('Failed to generate AI collective summary. Please check your API settings.', 'error');
//         } finally {
//             groupSummaryBtn.textContent = originalText;
//             groupSummaryBtn.disabled = false;
//         }
//     }

//     async function generateCollectiveAISummary(selectedCards: Card[]): Promise<string> {
//         // Combine selected cards content for group analysis
//         const combinedContent = selectedCards.map(card => 
//             `Title: ${card.title}\nDescription: ${card.description || 'No description'}\nContent: ${card.content}\nTags: ${card.tags?.join(', ') || 'No tags'}\n---`
//         ).join('\n\n');

//         const prompt = `Analyze this collection of ${selectedCards.length} selected context cards and provide a comprehensive summary identifying key themes, patterns, and insights across all these specific cards. Focus on the relationships between the selected content:\n\n${combinedContent}`;
        
//         return await callGeminiAIWithPrompt(prompt);
//     }

//     async function callGeminiAI(card: Card): Promise<string> {
//         const prompt = `Summarize this context card clearly and concisely:\n\nTitle: ${card.title}\nDescription: ${card.description || 'No description'}\nContent: ${card.content}\nTags: ${card.tags?.join(', ') || 'No tags'}`;
        
//         return await callGeminiAIWithPrompt(prompt);
//     }

//     async function callGeminiAIWithPrompt(prompt: string): Promise<string> {
//         if (!currentAISettings.enabled) {
//             throw new Error('AI settings not configured');
//         }

//         const apiUrl = `${currentAISettings.baseUrl}/models/${currentAISettings.model}:generateContent?key=${currentAISettings.apiKey}`;

//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 contents: [
//                     {
//                         parts: [{ text: prompt }],
//                     },
//                 ],
//             }),
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('Gemini API Error:', errorText);
//             throw new Error(`Gemini API error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available.';
        
//         return summary;
//     }

//     // Helper functions (keep your existing implementations)
//     function generateGlobalSummary(cards: Card[]): string {
//         const recentCards = cards.filter(card => {
//             const cardDate = new Date(card.timestamp || card.createdAt || '');
//             return (Date.now() - cardDate.getTime()) < (24 * 60 * 60 * 1000);
//         });

//         const cardsWithSummaries = cards.filter(card => card.summary).length;
//         const cardsWithAISummaries = cards.filter(card => card.aiSummary).length;
//         const selectedCount = cards.filter(card => card.selected).length;

//         return `
//             You have <strong>${cards.length}</strong> saved cards.<br>
//             ${recentCards.length > 0 ? `<strong>${recentCards.length}</strong> added today.` : ''}<br>
//             ${cardsWithSummaries > 0 ? `<strong>${cardsWithSummaries}</strong> cards have simple summaries.` : ''}<br>
//             ${cardsWithAISummaries > 0 ? `<strong>${cardsWithAISummaries}</strong> cards have AI summaries.` : ''}<br>
//             ${selectedCount > 0 ? `<strong>${selectedCount}</strong> cards selected.` : '<br>Use checkboxes to select cards for collective summaries.'}
//         `;
//     }

//     function extractCommonThemes(cards: Card[]): string[] {
//         const wordFrequency: { [key: string]: number } = {};
//         const commonWords = new Set(['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'on', 'with', 'as', 'by', 'at']);
        
//         cards.forEach(card => {
//             const words = (card.title + ' ' + card.content).toLowerCase().split(/\W+/);
//             words.forEach(word => {
//                 if (word.length > 4 && !commonWords.has(word)) {
//                     wordFrequency[word] = (wordFrequency[word] || 0) + 1;
//                 }
//             });
//         });

//         return Object.entries(wordFrequency)
//             .sort(([,a], [,b]) => b - a)
//             .slice(0, 10)
//             .map(([word]) => word);
//     }

//     function groupCardsByTags(cards: Card[]): { [key: string]: Card[] } {
//         const groups: { [key: string]: Card[] } = {};
        
//         cards.forEach(card => {
//             if (card.tags && card.tags.length > 0) {
//                 card.tags.forEach(tag => {
//                     if (!groups[tag]) {
//                         groups[tag] = [];
//                     }
//                     groups[tag].push(card);
//                 });
//             }
//         });

//         return groups;
//     }

//     async function getCardsFromStorage(): Promise<Card[]> {
//         const result = await new Promise<StorageResult>((resolve) => {
//             chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
//                 resolve(result);
//             });
//         });
//         return result.contextCards || [];
//     }

//     async function saveCardsToStorage(cards: Card[]): Promise<void> {
//         await new Promise<void>((resolve) => {
//             chrome.storage.local.set({ contextCards: cards }, () => {
//                 resolve();
//             });
//         });
//     }

//     // Enhanced Export Functions with Collective Summary Support
//     function exportCards(): void {
//         chrome.storage.local.get(['contextCards', 'collectiveSummary'], (result: StorageResult) => {
//             const cards: Card[] = result.contextCards || [];
//             const collectiveSummary = result.collectiveSummary || '';
            
//             if (cards.length === 0 && !collectiveSummary) {
//                 showNotification('No cards or collective summary to export.', 'error');
//                 return;
//             }

//             const selectedCards = cards.filter(card => card.selected);
//             const hasSelectedCards = selectedCards.length > 0;
//             const hasCollectiveSummary = collectiveSummary.length > 0;

//             let promptMessage = 'Choose export format:\n\n';
//             promptMessage += '1 = All Cards (Markdown)\n';
//             promptMessage += '2 = All Cards (HTML)\n';
//             promptMessage += '3 = All Cards (JSON)\n';
            
//             if (hasSelectedCards) {
//                 promptMessage += '\n--- Selected Cards Only ---\n';
//                 promptMessage += '4 = Selected Cards Only (Markdown)\n';
//                 promptMessage += '5 = Selected Cards Only (HTML)\n';
//                 promptMessage += '6 = Selected Cards Only (JSON)\n';
//             }

//             if (hasCollectiveSummary) {
//                 promptMessage += '\n--- Collective Summary Only ---\n';
//                 promptMessage += '7 = Collective Summary (Markdown)\n';
//                 promptMessage += '8 = Collective Summary (HTML)\n';
//                 promptMessage += '9 = Collective Summary (JSON)\n';
//             }

//             if (hasSelectedCards && hasCollectiveSummary) {
//                 promptMessage += '\n--- Selected Cards + Collective Summary ---\n';
//                 promptMessage += '10 = Selected Cards + Collective Summary (Markdown)\n';
//                 promptMessage += '11 = Selected Cards + Collective Summary (HTML)\n';
//                 promptMessage += '12 = Selected Cards + Collective Summary (JSON)\n';
//             }

//             promptMessage += '\nEnter 1-12:';

//             const choice = prompt(promptMessage, hasSelectedCards ? '4' : '1');

//             let cardsToExport: Card[];
//             let summaryToExport: string;
//             let exportScope = '';

//             switch (choice) {
//                 case '1':
//                 case '2':
//                 case '3':
//                     // Export all cards
//                     cardsToExport = cards;
//                     summaryToExport = '';
//                     exportScope = 'All Cards';
//                     break;
//                 case '4':
//                 case '5':
//                 case '6':
//                     // Export selected cards only
//                     if (!hasSelectedCards) {
//                         showNotification('No selected cards to export.', 'error');
//                         return;
//                     }
//                     cardsToExport = selectedCards;
//                     summaryToExport = '';
//                     exportScope = 'Selected Cards Only';
//                     break;
//                 case '7':
//                 case '8':
//                 case '9':
//                     // Export collective summary only
//                     if (!hasCollectiveSummary) {
//                         showNotification('No collective summary available to export.', 'error');
//                         return;
//                     }
//                     cardsToExport = [];
//                     summaryToExport = collectiveSummary;
//                     exportScope = 'Collective Summary Only';
//                     break;
//                 case '10':
//                 case '11':
//                 case '12':
//                     // Export selected cards + collective summary
//                     if (!hasSelectedCards || !hasCollectiveSummary) {
//                         showNotification('Need both selected cards and collective summary for this option.', 'error');
//                         return;
//                     }
//                     cardsToExport = selectedCards;
//                     summaryToExport = collectiveSummary;
//                     exportScope = 'Selected Cards + Collective Summary';
//                     break;
//                 default:
//                     cardsToExport = cards;
//                     summaryToExport = '';
//                     exportScope = 'All Cards';
//             }

//             switch (choice) {
//                 case '1':
//                 case '4':
//                 case '7':
//                 case '10':
//                     exportAsStructuredDocument(cardsToExport, summaryToExport, exportScope);
//                     break;
//                 case '2':
//                 case '5':
//                 case '8':
//                 case '11':
//                     exportAsHTML(cardsToExport, summaryToExport, exportScope);
//                     break;
//                 case '3':
//                 case '6':
//                 case '9':
//                 case '12':
//                     exportAsJSON(cardsToExport, summaryToExport, exportScope);
//                     break;
//                 default:
//                     exportAsStructuredDocument(cardsToExport, summaryToExport, exportScope);
//             }

//             showNotification(`Exported ${exportScope}`, 'success');
//         });
//     }

//     function exportAsStructuredDocument(cards: Card[], collectiveSummary: string, exportScope: string): void {
//         const documentContent = generateStructuredDocument(cards, collectiveSummary, exportScope);
//         const dataBlob = new Blob([documentContent], { type: 'text/markdown' });
        
//         const filename = `cardcontext-${exportScope.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.md`;
//         const url = URL.createObjectURL(dataBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = filename;
        
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
        
//         console.log(`✅ Exported ${exportScope}`);
//     }

//     function exportAsHTML(cards: Card[], collectiveSummary: string, exportScope: string): void {
//         const htmlContent = generateHTMLDocument(cards, collectiveSummary, exportScope);
//         const dataBlob = new Blob([htmlContent], { type: 'text/html' });
        
//         const filename = `cardcontext-${exportScope.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
//         const url = URL.createObjectURL(dataBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = filename;
        
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
        
//         console.log(`✅ Exported ${exportScope} as HTML`);
//     }

//     function exportAsJSON(cards: Card[], collectiveSummary: string, exportScope: string): void {
//         const exportData = {
//             version: '1.0',
//             exportDate: new Date().toISOString(),
//             exportScope: exportScope,
//             totalCards: cards.length,
//             collectiveSummary: collectiveSummary || null,
//             cards: cards
//         };

//         const dataStr = JSON.stringify(exportData, null, 2);
//         const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
//         const filename = `cardcontext-${exportScope.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
//         const url = URL.createObjectURL(dataBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = filename;
        
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
        
//         console.log(`✅ Exported ${exportScope} as JSON`);
//     }

//     function generateStructuredDocument(cards: Card[], collectiveSummary: string, exportScope: string): string {
//         const sortedCards = [...cards].sort((a, b) => {
//             const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
//             const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
//             return dateB - dateA;
//         });

//         let document = `# CardContext Export\n\n`;
//         document += `**Export Date:** ${new Date().toLocaleDateString()}\n`;
//         document += `**Export Scope:** ${exportScope}\n`;
        
//         if (cards.length > 0) {
//             document += `**Total Cards:** ${cards.length}\n`;
//         }
        
//         document += `\n`;

//         // Include collective summary at the top if it exists
//         if (collectiveSummary) {
//             document += `# Collective Summary\n\n`;
//             document += `${collectiveSummary}\n\n`;
//             document += `---\n\n`;
//         }

//         // Only show cards section if there are cards
//         if (cards.length > 0) {
//             document += `---\n\n`;

//             sortedCards.forEach((card, index) => {
//                 document += `## Card ${index + 1}: ${escapeMarkdown(card.title || 'Untitled Card')}\n\n`;
                
//                 if (card.selected && exportScope.includes('Selected')) {
//                     document += `> **✓ Selected for this export**\n\n`;
//                 }
                
//                 if (card.description) {
//                     document += `**Description:** ${escapeMarkdown(card.description)}\n\n`;
//                 }
                
//                 if (card.summary) {
//                     document += `**Simple Summary:** ${escapeMarkdown(card.summary)}\n\n`;
//                 }
                
//                 if (card.aiSummary) {
//                     document += `**AI Summary:** ${escapeMarkdown(card.aiSummary)}\n\n`;
//                 }
                
//                 document += `### Content\n`;
//                 document += `${formatContentForExport(card.content)}\n\n`;
                
//                 if (card.tags && card.tags.length > 0) {
//                     document += `**Tags:** ${card.tags.map(tag => `\`${escapeMarkdown(tag)}\``).join(', ')}\n\n`;
//                 }
                
//                 document += `### Metadata\n`;
//                 document += `- **Source:** ${getSourceDisplay(card.source || card.sourceUrl)}\n`;
//                 document += `- **Saved:** ${formatDate(card.timestamp || card.createdAt)}\n`;
//                 document += `- **ID:** ${card.id}\n`;
                
//                 if (card.metadata) {
//                     if (card.metadata.wordCount) {
//                         document += `- **Words:** ${card.metadata.wordCount}\n`;
//                     }
//                     if (card.metadata.characterCount) {
//                         document += `- **Characters:** ${card.metadata.characterCount}\n`;
//                     }
//                 }
                
//                 document += `\n---\n\n`;
//             });

//             const cardsWithSummaries = cards.filter(card => card.summary).length;
//             const cardsWithAISummaries = cards.filter(card => card.aiSummary).length;
            
//             if (cardsWithSummaries > 0 || cardsWithAISummaries > 0) {
//                 document += `# Summary Statistics\n\n`;
//                 document += `- **Cards with Simple Summaries:** ${cardsWithSummaries} of ${cards.length}\n`;
//                 document += `- **Cards with AI Summaries:** ${cardsWithAISummaries} of ${cards.length}\n\n`;
//             }
//         }

//         return document;
//     }

//     function generateHTMLDocument(cards: Card[], collectiveSummary: string, exportScope: string): string {
//         const sortedCards = [...cards].sort((a, b) => {
//             const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
//             const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
//             return dateB - dateA;
//         });

//         return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>CardContext Export - ${exportScope} - ${new Date().toLocaleDateString()}</title>
//     <style>
//         body { 
//             font-family: Arial, sans-serif; 
//             max-width: 800px; 
//             margin: 0 auto; 
//             padding: 20px; 
//             line-height: 1.6;
//         }
//         .export-header {
//             background: #2563eb;
//             color: white;
//             padding: 20px;
//             border-radius: 8px;
//             margin-bottom: 20px;
//         }
//         .card { 
//             border: 1px solid #e1e1e1; 
//             border-radius: 8px; 
//             padding: 20px; 
//             margin: 20px 0; 
//             background: #f9f9f9;
//         }
//         .card-title { 
//             color: #2563eb; 
//             margin-top: 0; 
//             border-bottom: 2px solid #2563eb; 
//             padding-bottom: 10px;
//         }
//         .card-content { 
//             background: white; 
//             padding: 15px; 
//             border-left: 4px solid #2563eb; 
//             margin: 15px 0;
//         }
//         .card-summary { 
//             background: #f0f9ff; 
//             padding: 12px; 
//             border-radius: 6px; 
//             margin: 10px 0; 
//             border-left: 3px solid #3b82f6;
//         }
//         .card-ai-summary { 
//             background: #ecfdf5; 
//             padding: 12px; 
//             border-radius: 6px; 
//             margin: 10px 0; 
//             border-left: 3px solid #10b981;
//         }
//         .collective-summary {
//             background: #fef3c7;
//             padding: 20px;
//             border-radius: 8px;
//             margin: 20px 0;
//             border-left: 4px solid #f59e0b;
//         }
//         .tag { 
//             display: inline-block; 
//             background: #e5e7eb; 
//             padding: 4px 12px; 
//             border-radius: 16px; 
//             margin: 2px 4px 2px 0; 
//             font-size: 0.9em;
//         }
//         .metadata { 
//             font-size: 0.9em; 
//             color: #6b7280; 
//             border-top: 1px solid #e5e7eb; 
//             padding-top: 10px;
//         }
//         .summary { 
//             background: #f0f9ff; 
//             padding: 20px; 
//             border-radius: 8px; 
//             margin: 20px 0;
//         }
//         .selected-indicator {
//             background: #10b981;
//             color: white;
//             padding: 4px 8px;
//             border-radius: 4px;
//             font-size: 0.8em;
//             margin-left: 10px;
//         }
//     </style>
// </head>
// <body>
//     <div class="export-header">
//         <h1>CardContext Export</h1>
//         <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
//         <p><strong>Export Scope:</strong> ${exportScope}</p>
//         ${cards.length > 0 ? `<p><strong>Total Cards:</strong> ${cards.length}</p>` : ''}
//     </div>

//     ${collectiveSummary ? `
//     <div class="collective-summary">
//         <h2>Collective Summary</h2>
//         ${collectiveSummary.split('\n').map(line => `<p>${escapeHtml(line)}</p>`).join('')}
//     </div>
//     ` : ''}

//     ${cards.length > 0 ? `
//     <div class="summary">
//         <h2>Cards Export</h2>
//         <p><strong>Cards with Simple Summaries:</strong> ${cards.filter(card => card.summary).length}</p>
//         <p><strong>Cards with AI Summaries:</strong> ${cards.filter(card => card.aiSummary).length}</p>
//     </div>
//     ` : ''}

//     ${sortedCards.map((card, index) => `
//     <div class="card">
//         <h2 class="card-title">
//             Card ${index + 1}: ${escapeHtml(card.title || 'Untitled Card')}
//             ${card.selected && exportScope.includes('Selected') ? `<span class="selected-indicator">SELECTED</span>` : ''}
//         </h2>
        
//         ${card.description ? `<p><strong>Description:</strong> ${escapeHtml(card.description)}</p>` : ''}
        
//         ${card.summary ? `
//         <div class="card-summary">
//             <strong>Simple Summary:</strong> ${escapeHtml(card.summary)}
//         </div>
//         ` : ''}
        
//         ${card.aiSummary ? `
//         <div class="card-ai-summary">
//             <strong>AI Summary:</strong> ${escapeHtml(card.aiSummary)}
//         </div>
//         ` : ''}
        
//         <div class="card-content">
//             <strong>Content:</strong><br>
//             ${card.content.split('\n').map(line => `<div>${escapeHtml(line)}</div>`).join('')}
//         </div>
        
//         ${card.tags && card.tags.length > 0 ? `
//         <div>
//             <strong>Tags:</strong><br>
//             ${card.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
//         </div>
//         ` : ''}
        
//         <div class="metadata">
//             <strong>Source:</strong> ${getSourceDisplay(card.source || card.sourceUrl)}<br>
//             <strong>Saved:</strong> ${formatDate(card.timestamp || card.createdAt)}<br>
//             <strong>ID:</strong> ${card.id}
//             ${card.metadata ? `
//             <br><strong>Word Count:</strong> ${card.metadata.wordCount || 'N/A'}
//             <br><strong>Character Count:</strong> ${card.metadata.characterCount || 'N/A'}
//             ` : ''}
//         </div>
//     </div>
//     `).join('')}

//     <div class="summary">
//         <h2>Export Information</h2>
//         <p>Generated by CardContext Extension</p>
//         <p>Includes both simple and AI-generated summaries where available</p>
//         ${collectiveSummary ? '<p>Includes collective summary</p>' : ''}
//         ${exportScope.includes('Selected') ? '<p>Includes only selected cards</p>' : ''}
//         <p><strong>Export Scope:</strong> ${exportScope}</p>
//     </div>
// </body>
// </html>`;
//     }

//     function formatContentForExport(content: string): string {
//         return content
//             .split('\n')
//             .map(line => line.trim())
//             .filter(line => line.length > 0)
//             .map(line => `> ${line}`)
//             .join('\n>\n');
//     }

//     function escapeMarkdown(text: string): string {
//         return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
//     }

//     function escapeHtml(unsafe: string): string {
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }

//     function formatDate(timestamp?: string): string {
//         if (!timestamp) return 'Unknown date';
//         try {
//             const date = new Date(timestamp);
//             return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         } catch {
//             return 'Invalid date';
//         }
//     }

//     function getSourceDisplay(source?: string): string {
//         if (!source) return 'Unknown source';
//         try {
//             return new URL(source).hostname;
//         } catch {
//             return source;
//         }
//     }
// });


// popup.ts
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
    metadata?: {
        wordCount?: number;
        characterCount?: number;
        domain?: string;
    };
    summary?: string;
    aiSummary?: string;
    selected?: boolean; // New: Track card selection
}

interface StorageResult {
    contextCards?: Card[];
    collectiveSummary?: string; // New: Store collective summaries
}

interface AISettings {
    baseUrl: string;
    apiKey: string;
    model: string;
    enabled: boolean;
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎯 Popup loaded');
    
    const cardsContainer = document.getElementById('cards') as HTMLDivElement;
    const cardsCount = document.getElementById('cardsCount') as HTMLSpanElement;
    const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
    const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
    const aiSummary = document.getElementById('aiSummary') as HTMLDivElement;
    
    // AI Settings elements
    const toggleAISettings = document.getElementById('toggleAISettings') as HTMLButtonElement;
    const aiSettings = document.getElementById('aiSettings') as HTMLDivElement;
    const aiBaseUrl = document.getElementById('aiBaseUrl') as HTMLInputElement;
    const aiApiKey = document.getElementById('aiApiKey') as HTMLInputElement;
    const aiModel = document.getElementById('aiModel') as HTMLInputElement;
    const saveAISettings = document.getElementById('saveAISettings') as HTMLButtonElement;
    const aiStatusText = document.getElementById('aiStatusText') as HTMLSpanElement;

    let currentAISettings: AISettings = {
        baseUrl: '',
        apiKey: '',
        model: 'gemini-pro',
        enabled: false
    };

    // Load AI settings and cards
    await loadAISettings();
    await loadCards();
    
    // Initialize selection tracking
    setupSelectionTracking();

    // AI Settings toggle
    toggleAISettings.addEventListener('click', () => {
        aiSettings.style.display = aiSettings.style.display === 'none' ? 'block' : 'none';
    });

    // Save AI settings
    saveAISettings.addEventListener('click', async () => {
        await saveAISettingsToStorage();
    });

    clearBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear all cards? This action cannot be undone.')) {
            await new Promise<void>((resolve) => {
                chrome.storage.local.set({ contextCards: [], collectiveSummary: '' }, () => {
                    resolve();
                });
            });
            await loadCards();
            console.log('✅ All cards cleared');
        }
    });

    exportBtn.addEventListener('click', exportCards);

    async function loadAISettings(): Promise<void> {
        try {
            const result = await new Promise<{ aiSettings?: AISettings }>((resolve) => {
                chrome.storage.local.get(['aiSettings'], (result) => {
                    const settings = result as { aiSettings?: AISettings };
                    resolve(settings);
                });
            });
            
            if (result.aiSettings) {
                currentAISettings = result.aiSettings;
                aiBaseUrl.value = currentAISettings.baseUrl;
                aiApiKey.value = currentAISettings.apiKey;
                aiModel.value = currentAISettings.model;
                
                updateAIStatus();
            }
        } catch (error) {
            console.error('❌ Error loading AI settings:', error);
        }
    }

    async function saveAISettingsToStorage(): Promise<void> {
        currentAISettings = {
            baseUrl: aiBaseUrl.value.trim(),
            apiKey: aiApiKey.value.trim(),
            model: aiModel.value.trim() || 'gemini-pro',
            enabled: aiBaseUrl.value.trim() !== '' && aiApiKey.value.trim() !== ''
        };

        await new Promise<void>((resolve) => {
            chrome.storage.local.set({ aiSettings: currentAISettings }, () => {
                resolve();
            });
        });

        updateAIStatus();
        aiSettings.style.display = 'none';
        console.log('✅ AI settings saved');
    }

    function updateAIStatus(): void {
        if (currentAISettings.enabled) {
            aiStatusText.textContent = 'Ready';
            aiStatusText.style.color = '#10b981';
        } else {
            aiStatusText.textContent = 'Configure settings';
            aiStatusText.style.color = '#ef4444';
        }
    }

    async function loadCards(): Promise<void> {
        try {
            console.log('📚 Loading cards...');
            const result = await new Promise<StorageResult>((resolve) => {
                chrome.storage.local.get(['contextCards', 'collectiveSummary'], (result: StorageResult) => {
                    resolve(result);
                });
            });
            
            const cards: Card[] = result.contextCards || [];
            console.log(`✅ Loaded ${cards.length} cards from storage:`, cards);
            
            renderCards(cards);
            updateCardsCount(cards.length);
            updateGlobalSummary(cards, result.collectiveSummary);
            
        } catch (error) {
            console.error('❌ Error loading cards:', error);
            if (cardsContainer) {
                cardsContainer.innerHTML = '<div class="empty">Error loading cards</div>';
            }
        }
    }

    function renderCards(cards: Card[]): void {
        if (!cardsContainer) return;

        if (cards.length === 0) {
            cardsContainer.innerHTML = '<div class="empty">No cards saved yet. Select text and use right-click → "Save to CardContext" to create cards.</div>';
            return;
        }

        cards.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
            const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
            return dateB - dateA;
        });

        cardsContainer.innerHTML = cards.map(card => `
            <div class="card" data-card-id="${card.id}">
                <div class="card-header">
                    <div class="card-selection">
                        <input type="checkbox" class="card-checkbox" data-card-id="${card.id}" ${card.selected ? 'checked' : ''}>
                        <h3 class="card-title">${escapeHtml(card.title || 'Untitled Card')}</h3>
                    </div>
                    <div class="card-actions">
                        <button class="summary-btn" data-card-id="${card.id}" title="Generate Simple Summary">
                            📝
                        </button>
                        ${currentAISettings.enabled ? `
                        <button class="ai-summary-btn" data-card-id="${card.id}" title="Generate AI Summary">
                            🤖
                        </button>
                        ` : ''}
                    </div>
                </div>
                ${card.description ? `<div class="card-description">${escapeHtml(card.description)}</div>` : ''}
                
                ${card.summary ? `
                <div class="card-summary">
                    <strong>Simple Summary:</strong> ${escapeHtml(card.summary)}
                </div>
                ` : ''}
                
                ${card.aiSummary ? `
                <div class="card-ai-summary">
                    <strong>AI Summary:</strong> ${escapeHtml(card.aiSummary)}
                </div>
                ` : ''}
                
                <div class="card-content">${escapeHtml(card.content)}</div>
                ${card.tags && card.tags.length > 0 ? `
                    <div class="card-tags">
                        ${card.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="card-meta">
                    ${formatDate(card.timestamp || card.createdAt)} • ${getSourceDisplay(card.source || card.sourceUrl)}
                </div>
            </div>
        `).join('');

        // Event listeners for checkboxes
        document.querySelectorAll('.card-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const cardId = (e.target as HTMLInputElement).getAttribute('data-card-id');
                const checked = (e.target as HTMLInputElement).checked;
                
                if (cardId) {
                    await updateCardSelection(cardId, checked);
                }
            });
        });

        // Event listeners for summary buttons
        document.querySelectorAll('.summary-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const cardId = (e.target as HTMLElement).closest('.summary-btn')?.getAttribute('data-card-id');
                if (cardId) {
                    generateIndividualSummary(cardId);
                }
            });
        });

        // Event listeners for AI summary buttons
        if (currentAISettings.enabled) {
            document.querySelectorAll('.ai-summary-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const cardId = (e.target as HTMLElement).closest('.ai-summary-btn')?.getAttribute('data-card-id');
                    if (cardId) {
                        generateAISummaryForCard(cardId);
                    }
                });
            });
        }
    }

    async function updateCardSelection(cardId: string, selected: boolean): Promise<void> {
        try {
            const cards = await getCardsFromStorage();
            const cardIndex = cards.findIndex(c => c.id === cardId);
            
            if (cardIndex !== -1) {
                cards[cardIndex].selected = selected;
                await saveCardsToStorage(cards);
                
                // Update both button states and global summary
                await updateButtonStates();
                await refreshGlobalSummary();
                
                showNotification(`${selected ? 'Selected' : 'Deselected'} card: ${cards[cardIndex].title}`);
            }
        } catch (error) {
            console.error('Error updating card selection:', error);
        }
    }

    function updateSelectionCount(cards: Card[]): void {
        const selectedCount = cards.filter(card => card.selected).length;
        const selectionInfo = document.getElementById('selectionInfo');
        
        if (selectionInfo) {
            if (selectedCount > 0) {
                selectionInfo.textContent = `${selectedCount} card${selectedCount !== 1 ? 's' : ''} selected`;
                selectionInfo.style.display = 'block';
            } else {
                selectionInfo.style.display = 'none';
            }
        }
    }

    function updateCardsCount(count: number): void {
        if (cardsCount) {
            cardsCount.textContent = count.toString();
        }
    }

    function updateGlobalSummary(cards: Card[], collectiveSummary?: string): void {
        if (!aiSummary) return;

        if (cards.length === 0) {
            aiSummary.innerHTML = `
                <div class="summary-header">
                    <h3>Summary</h3>
                </div>
                <div class="summary-placeholder">Select text and use right-click → "Save to CardContext" to create cards</div>
            `;
            return;
        }

        // Show collective summary if it exists
        if (collectiveSummary) {
            aiSummary.innerHTML = `
                <div class="summary-header">
                    <h3>Collective Summary</h3>
                    <button class="refresh-btn" id="clearCollectiveSummary" title="Clear Collective Summary">🗑️</button>
                </div>
                <div class="summary-content">
                    ${escapeHtml(collectiveSummary)}
                </div>
                <div class="summary-actions">
                    <button class="summary-action-btn" id="backToGlobalSummary">← Back to Overview</button>
                </div>
            `;

            document.getElementById('clearCollectiveSummary')?.addEventListener('click', async () => {
                await new Promise<void>((resolve) => {
                    chrome.storage.local.set({ collectiveSummary: '' }, () => {
                        resolve();
                    });
                });
                updateGlobalSummary(cards);
            });

            document.getElementById('backToGlobalSummary')?.addEventListener('click', () => {
                updateGlobalSummary(cards);
            });
            return;
        }

        const selectedCount = cards.filter(card => card.selected).length;
        const summaryContent = generateGlobalSummary(cards);
        
        aiSummary.innerHTML = `
            <div class="summary-header">
                <h3>Summary</h3>
                <button class="refresh-btn" id="refreshGlobalSummary" title="Refresh Summary">↻</button>
            </div>
            <div class="summary-content">
                ${summaryContent}
            </div>
            <div class="selection-info" id="selectionInfo" style="display: ${selectedCount > 0 ? 'block' : 'none'}">
                ${selectedCount} card${selectedCount !== 1 ? 's' : ''} selected
            </div>
            <div class="summary-actions">
                <button class="summary-action-btn" id="generateGroupSummary" ${selectedCount === 0 ? 'disabled' : ''}>
                    Simple Summary of Selected Cards
                </button>
                ${currentAISettings.enabled ? `
                <button class="summary-action-btn" id="generateAIGroupSummary" ${selectedCount === 0 ? 'disabled' : ''}>
                    AI Summary of Selected Cards
                </button>
                ` : ''}
                <button class="summary-action-btn" id="selectAllCards">
                    Select All Cards
                </button>
                <button class="summary-action-btn" id="clearSelection" ${selectedCount === 0 ? 'disabled' : ''}>
                    Clear Selection
                </button>
            </div>
        `;

        document.getElementById('refreshGlobalSummary')?.addEventListener('click', () => {
            updateGlobalSummary(cards);
        });

        document.getElementById('generateGroupSummary')?.addEventListener('click', () => {
            generateGroupSummary(cards);
        });

        if (currentAISettings.enabled) {
            document.getElementById('generateAIGroupSummary')?.addEventListener('click', () => {
                generateAIGroupSummary(cards);
            });
        }

        document.getElementById('selectAllCards')?.addEventListener('click', async () => {
            await selectAllCards(true);
        });

        document.getElementById('clearSelection')?.addEventListener('click', async () => {
            await selectAllCards(false);
        });

        updateSelectionCount(cards);
    }

    async function selectAllCards(selected: boolean): Promise<void> {
        const cards = await getCardsFromStorage();
        
        cards.forEach(card => {
            card.selected = selected;
        });
        
        await saveCardsToStorage(cards);
        renderCards(cards);
        await updateButtonStates(); // Add this line
        updateGlobalSummary(cards);
    }

    // NEW: Add notification function
    function showNotification(message: string, type: 'success' | 'info' | 'error' = 'info'): void {
        // Remove existing notification if any
        const existingNotification = document.getElementById('actionNotification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.id = 'actionNotification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.8em;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add CSS animation
        if (!document.querySelector('#notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // NEW: Add this function to update button states based on selection
    async function updateButtonStates(): Promise<void> {
        try {
            const cards = await getCardsFromStorage();
            const selectedCount = cards.filter(card => card.selected).length;
            
            // Wait a tiny bit for DOM to be ready
            setTimeout(() => {
                const generateGroupSummaryBtn = document.getElementById('generateGroupSummary') as HTMLButtonElement;
                const generateAIGroupSummaryBtn = document.getElementById('generateAIGroupSummary') as HTMLButtonElement;
                const clearSelectionBtn = document.getElementById('clearSelection') as HTMLButtonElement;
                
                if (generateGroupSummaryBtn) {
                    generateGroupSummaryBtn.disabled = selectedCount === 0;
                }
                
                if (generateAIGroupSummaryBtn) {
                    generateAIGroupSummaryBtn.disabled = selectedCount === 0;
                }
                
                if (clearSelectionBtn) {
                    clearSelectionBtn.disabled = selectedCount === 0;
                }
                
                updateSelectionCount(cards);
            }, 10);
        } catch (error) {
            console.error('Error updating button states:', error);
        }
    }

    // NEW: Add this function to track selection changes and update button states
    function setupSelectionTracking(): void {
        const cardsContainer = document.getElementById('cards') as HTMLDivElement;
        if (cardsContainer) {
            // Listen for checkbox changes directly
            cardsContainer.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target && target.classList.contains('card-checkbox')) {
                    // Update button states immediately when any checkbox changes
                    setTimeout(updateButtonStates, 50);
                }
            });
        }
    }

    // NEW: Add this function to force update the global summary when selection changes
    async function refreshGlobalSummary(): Promise<void> {
        const cards = await getCardsFromStorage();
        updateGlobalSummary(cards);
    }

    // SIMPLE SUMMARY FUNCTIONS
    async function generateIndividualSummary(cardId: string): Promise<void> {
        const cards = await getCardsFromStorage();
        const card = cards.find(c => c.id === cardId);
        
        if (!card) {
            console.error('❌ Card not found:', cardId);
            return;
        }

        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
        if (cardElement) {
            const summaryBtn = cardElement.querySelector('.summary-btn') as HTMLButtonElement;
            summaryBtn.textContent = '⏳';
            summaryBtn.disabled = true;
        }

        try {
            const summary = await generateSimpleSummary(card);
            
            card.summary = summary;
            await saveCardsToStorage(cards);
            
            renderCards(cards);
            showNotification(`Simple summary generated for: ${card.title}`, 'success');
            
            console.log('✅ Individual summary generated for card:', cardId);
        } catch (error) {
            console.error('❌ Error generating individual summary:', error);
            showNotification('Failed to generate summary. Please try again.', 'error');
        }
    }

    async function generateSimpleSummary(card: Card): Promise<string> {
        const content = card.content;
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        if (sentences.length <= 2) {
            return content;
        }

        const keySentences = [
            sentences[0],
            ...sentences.filter(s => 
                s.length > 20 && 
                (s.includes(' important') || s.includes(' key') || s.includes(' summary') ||
                 s.length > 50)
            ).slice(0, 2)
        ];

        const uniqueSentences = Array.from(new Set(keySentences));
        let summary = uniqueSentences.join('. ') + '.';
        
        if (summary.length > 300) {
            summary = summary.substring(0, 300) + '...';
        }

        return summary;
    }

    // NEW: Simple Group Summary for Selected Cards
    async function generateGroupSummary(cards: Card[]): Promise<void> {
        const selectedCards = cards.filter(card => card.selected);
        
        if (selectedCards.length === 0) {
            showNotification('Please select cards first by checking the checkboxes.', 'error');
            return;
        }

        const groupSummaryBtn = document.getElementById('generateGroupSummary') as HTMLButtonElement;
        const originalText = groupSummaryBtn.textContent;
        groupSummaryBtn.textContent = 'Generating...';
        groupSummaryBtn.disabled = true;

        try {
            const collectiveSummary = await generateCollectiveSimpleSummary(selectedCards);
            
            // Save collective summary to storage
            await new Promise<void>((resolve) => {
                chrome.storage.local.set({ collectiveSummary }, () => {
                    resolve();
                });
            });
            
            updateGlobalSummary(cards, collectiveSummary);
            showNotification(`Simple collective summary generated for ${selectedCards.length} selected cards`, 'success');
            console.log('✅ Simple collective summary generated for', selectedCards.length, 'selected cards');
        } catch (error) {
            console.error('❌ Error generating simple collective summary:', error);
            showNotification('Failed to generate collective summary.', 'error');
        } finally {
            groupSummaryBtn.textContent = originalText;
            groupSummaryBtn.disabled = false;
        }
    }

    async function generateCollectiveSimpleSummary(selectedCards: Card[]): Promise<string> {
        const allContent = selectedCards.map(card => card.content).join('\n\n');
        const allTitles = selectedCards.map(card => card.title).join(', ');
        
        const commonWords = extractCommonThemes(selectedCards);
        const tagGroups = groupCardsByTags(selectedCards);

        let summary = `## Collective Summary of ${selectedCards.length} Selected Cards\n\n`;
        summary += `**Selected Cards:** ${allTitles}\n\n`;

        if (commonWords.length > 0) {
            summary += `**Key Themes:** ${commonWords.slice(0, 5).join(', ')}\n\n`;
        }

        if (Object.keys(tagGroups).length > 0) {
            summary += `**Content Categories:**\n`;
            Object.entries(tagGroups).forEach(([tag, tagCards]) => {
                summary += `- ${tag}: ${tagCards.length} card${tagCards.length !== 1 ? 's' : ''}\n`;
            });
            summary += `\n`;
        }

        const recentCards = selectedCards.filter(card => {
            const cardDate = new Date(card.timestamp || card.createdAt || '');
            const daysAgo = (Date.now() - cardDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo < 7;
        });

        if (recentCards.length > 0) {
            summary += `**Recent Activity:** ${recentCards.length} cards saved in the last week\n\n`;
        }

        const avgLength = selectedCards.reduce((sum, card) => sum + card.content.length, 0) / selectedCards.length;
        summary += `**Content Insights:** Average card length: ${Math.round(avgLength)} characters\n\n`;

        summary += `**Summary:** This collection of ${selectedCards.length} cards covers `;
        if (commonWords.length > 0) {
            summary += `topics related to ${commonWords.slice(0, 3).join(', ')}. `;
        }
        summary += `Consider organizing these cards into focused groups based on their themes.`;

        return summary;
    }

    // AI-POWERED SUMMARY FUNCTIONS
    async function generateAISummaryForCard(cardId: string): Promise<void> {
        if (!currentAISettings.enabled) {
            showNotification('Please configure AI settings first.', 'error');
            return;
        }

        const cards = await getCardsFromStorage();
        const card = cards.find(c => c.id === cardId);
        
        if (!card) {
            console.error('❌ Card not found:', cardId);
            return;
        }

        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
        if (cardElement) {
            const aiSummaryBtn = cardElement.querySelector('.ai-summary-btn') as HTMLButtonElement;
            aiSummaryBtn.textContent = '⏳';
            aiSummaryBtn.disabled = true;
        }

        try {
            const aiSummary = await callGeminiAI(card);
            
            card.aiSummary = aiSummary;
            await saveCardsToStorage(cards);
            
            renderCards(cards);
            showNotification(`AI summary generated for: ${card.title}`, 'success');
            
            console.log('✅ AI summary generated for card:', cardId);
        } catch (error) {
            console.error('❌ Error generating AI summary:', error);
            showNotification('Failed to generate AI summary. Please check your API settings.', 'error');
            
            // Reset button state
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
            if (cardElement) {
                const aiSummaryBtn = cardElement.querySelector('.ai-summary-btn') as HTMLButtonElement;
                aiSummaryBtn.textContent = '🤖';
                aiSummaryBtn.disabled = false;
            }
        }
    }

    // NEW: AI Group Summary for Selected Cards
    async function generateAIGroupSummary(cards: Card[]): Promise<void> {
        if (!currentAISettings.enabled) {
            showNotification('Please configure AI settings first.', 'error');
            return;
        }

        const selectedCards = cards.filter(card => card.selected);
        
        if (selectedCards.length === 0) {
            showNotification('Please select cards first by checking the checkboxes.', 'error');
            return;
        }

        const groupSummaryBtn = document.getElementById('generateAIGroupSummary') as HTMLButtonElement;
        const originalText = groupSummaryBtn.textContent;
        groupSummaryBtn.textContent = 'Generating AI Summary...';
        groupSummaryBtn.disabled = true;

        try {
            const collectiveSummary = await generateCollectiveAISummary(selectedCards);
            
            // Save collective summary to storage
            await new Promise<void>((resolve) => {
                chrome.storage.local.set({ collectiveSummary }, () => {
                    resolve();
                });
            });
            
            updateGlobalSummary(cards, collectiveSummary);
            showNotification(`AI collective summary generated for ${selectedCards.length} selected cards`, 'success');
            console.log('✅ AI collective summary generated for', selectedCards.length, 'selected cards');
        } catch (error) {
            console.error('❌ Error generating AI collective summary:', error);
            showNotification('Failed to generate AI collective summary. Please check your API settings.', 'error');
        } finally {
            groupSummaryBtn.textContent = originalText;
            groupSummaryBtn.disabled = false;
        }
    }

    async function generateCollectiveAISummary(selectedCards: Card[]): Promise<string> {
        // Combine selected cards content for group analysis
        const combinedContent = selectedCards.map(card => 
            `Title: ${card.title}\nDescription: ${card.description || 'No description'}\nContent: ${card.content}\nTags: ${card.tags?.join(', ') || 'No tags'}\n---`
        ).join('\n\n');

        const prompt = `Analyze this collection of ${selectedCards.length} selected context cards and provide a comprehensive summary identifying key themes, patterns, and insights across all these specific cards. Focus on the relationships between the selected content:\n\n${combinedContent}`;
        
        return await callGeminiAIWithPrompt(prompt);
    }

    async function callGeminiAI(card: Card): Promise<string> {
        const prompt = `Summarize this context card clearly and concisely:\n\nTitle: ${card.title}\nDescription: ${card.description || 'No description'}\nContent: ${card.content}\nTags: ${card.tags?.join(', ') || 'No tags'}`;
        
        return await callGeminiAIWithPrompt(prompt);
    }

    async function callGeminiAIWithPrompt(prompt: string): Promise<string> {
        if (!currentAISettings.enabled) {
            throw new Error('AI settings not configured');
        }

        const apiUrl = `${currentAISettings.baseUrl}/models/${currentAISettings.model}:generateContent?key=${currentAISettings.apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available.';
        
        return summary;
    }

    // Helper functions (keep your existing implementations)
    function generateGlobalSummary(cards: Card[]): string {
        const recentCards = cards.filter(card => {
            const cardDate = new Date(card.timestamp || card.createdAt || '');
            return (Date.now() - cardDate.getTime()) < (24 * 60 * 60 * 1000);
        });

        const cardsWithSummaries = cards.filter(card => card.summary).length;
        const cardsWithAISummaries = cards.filter(card => card.aiSummary).length;
        const selectedCount = cards.filter(card => card.selected).length;

        return `
            You have <strong>${cards.length}</strong> saved cards.<br>
            ${recentCards.length > 0 ? `<strong>${recentCards.length}</strong> added today.` : ''}<br>
            ${cardsWithSummaries > 0 ? `<strong>${cardsWithSummaries}</strong> cards have simple summaries.` : ''}<br>
            ${cardsWithAISummaries > 0 ? `<strong>${cardsWithAISummaries}</strong> cards have AI summaries.` : ''}<br>
            ${selectedCount > 0 ? `<strong>${selectedCount}</strong> cards selected.` : '<br>Use checkboxes to select cards for collective summaries.'}
        `;
    }

    function extractCommonThemes(cards: Card[]): string[] {
        const wordFrequency: { [key: string]: number } = {};
        const commonWords = new Set(['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'on', 'with', 'as', 'by', 'at']);
        
        cards.forEach(card => {
            const words = (card.title + ' ' + card.content).toLowerCase().split(/\W+/);
            words.forEach(word => {
                if (word.length > 4 && !commonWords.has(word)) {
                    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
                }
            });
        });

        return Object.entries(wordFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }

    function groupCardsByTags(cards: Card[]): { [key: string]: Card[] } {
        const groups: { [key: string]: Card[] } = {};
        
        cards.forEach(card => {
            if (card.tags && card.tags.length > 0) {
                card.tags.forEach(tag => {
                    if (!groups[tag]) {
                        groups[tag] = [];
                    }
                    groups[tag].push(card);
                });
            }
        });

        return groups;
    }

    async function getCardsFromStorage(): Promise<Card[]> {
        const result = await new Promise<StorageResult>((resolve) => {
            chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
                resolve(result);
            });
        });
        return result.contextCards || [];
    }

    async function saveCardsToStorage(cards: Card[]): Promise<void> {
        await new Promise<void>((resolve) => {
            chrome.storage.local.set({ contextCards: cards }, () => {
                resolve();
            });
        });
    }

    // Enhanced Export Functions with Collective Summary Support
    function exportCards(): void {
        chrome.storage.local.get(['contextCards', 'collectiveSummary'], (result: StorageResult) => {
            const cards: Card[] = result.contextCards || [];
            const collectiveSummary = result.collectiveSummary || '';
            
            if (cards.length === 0 && !collectiveSummary) {
                showNotification('No cards or collective summary to export.', 'error');
                return;
            }

            const selectedCards = cards.filter(card => card.selected);
            const hasSelectedCards = selectedCards.length > 0;
            const hasCollectiveSummary = collectiveSummary.length > 0;

            let promptMessage = 'Choose export format:\n\n';
            promptMessage += '1 = All Cards (Markdown)\n';
            promptMessage += '2 = All Cards (HTML)\n';
            promptMessage += '3 = All Cards (JSON)\n';
            
            if (hasSelectedCards) {
                promptMessage += '\n--- Selected Cards Only ---\n';
                promptMessage += '4 = Selected Cards Only (Markdown)\n';
                promptMessage += '5 = Selected Cards Only (HTML)\n';
                promptMessage += '6 = Selected Cards Only (JSON)\n';
            }

            if (hasCollectiveSummary) {
                promptMessage += '\n--- Collective Summary Only ---\n';
                promptMessage += '7 = Collective Summary (Markdown)\n';
                promptMessage += '8 = Collective Summary (HTML)\n';
                promptMessage += '9 = Collective Summary (JSON)\n';
            }

            if (hasSelectedCards && hasCollectiveSummary) {
                promptMessage += '\n--- Selected Cards + Collective Summary ---\n';
                promptMessage += '10 = Selected Cards + Collective Summary (Markdown)\n';
                promptMessage += '11 = Selected Cards + Collective Summary (HTML)\n';
                promptMessage += '12 = Selected Cards + Collective Summary (JSON)\n';
            }

            promptMessage += '\nEnter 1-12:';

            const choice = prompt(promptMessage, hasSelectedCards ? '4' : '1');

            let cardsToExport: Card[];
            let summaryToExport: string;
            let exportScope = '';

            switch (choice) {
                case '1':
                case '2':
                case '3':
                    // Export all cards
                    cardsToExport = cards;
                    summaryToExport = '';
                    exportScope = 'All Cards';
                    break;
                case '4':
                case '5':
                case '6':
                    // Export selected cards only
                    if (!hasSelectedCards) {
                        showNotification('No selected cards to export.', 'error');
                        return;
                    }
                    cardsToExport = selectedCards;
                    summaryToExport = '';
                    exportScope = 'Selected Cards Only';
                    break;
                case '7':
                case '8':
                case '9':
                    // Export collective summary only
                    if (!hasCollectiveSummary) {
                        showNotification('No collective summary available to export.', 'error');
                        return;
                    }
                    cardsToExport = [];
                    summaryToExport = collectiveSummary;
                    exportScope = 'Collective Summary Only';
                    break;
                case '10':
                case '11':
                case '12':
                    // Export selected cards + collective summary
                    if (!hasSelectedCards || !hasCollectiveSummary) {
                        showNotification('Need both selected cards and collective summary for this option.', 'error');
                        return;
                    }
                    cardsToExport = selectedCards;
                    summaryToExport = collectiveSummary;
                    exportScope = 'Selected Cards + Collective Summary';
                    break;
                default:
                    cardsToExport = cards;
                    summaryToExport = '';
                    exportScope = 'All Cards';
            }

            switch (choice) {
                case '1':
                case '4':
                case '7':
                case '10':
                    exportAsStructuredDocument(cardsToExport, summaryToExport, exportScope);
                    break;
                case '2':
                case '5':
                case '8':
                case '11':
                    exportAsHTML(cardsToExport, summaryToExport, exportScope);
                    break;
                case '3':
                case '6':
                case '9':
                case '12':
                    exportAsJSON(cardsToExport, summaryToExport, exportScope);
                    break;
                default:
                    exportAsStructuredDocument(cardsToExport, summaryToExport, exportScope);
            }

            showNotification(`Exported ${exportScope}`, 'success');
        });
    }

    function exportAsStructuredDocument(cards: Card[], collectiveSummary: string, exportScope: string): void {
        const documentContent = generateStructuredDocument(cards, collectiveSummary, exportScope);
        const dataBlob = new Blob([documentContent], { type: 'text/markdown' });
        
        const filename = `cardcontext-${exportScope.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.md`;
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Exported ${exportScope}`);
    }

    function exportAsHTML(cards: Card[], collectiveSummary: string, exportScope: string): void {
        const htmlContent = generateHTMLDocument(cards, collectiveSummary, exportScope);
        const dataBlob = new Blob([htmlContent], { type: 'text/html' });
        
        const filename = `cardcontext-${exportScope.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Exported ${exportScope} as HTML`);
    }

    function exportAsJSON(cards: Card[], collectiveSummary: string, exportScope: string): void {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            exportScope: exportScope,
            totalCards: cards.length,
            collectiveSummary: collectiveSummary || null,
            cards: cards
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const filename = `cardcontext-${exportScope.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Exported ${exportScope} as JSON`);
    }

    function generateStructuredDocument(cards: Card[], collectiveSummary: string, exportScope: string): string {
        const sortedCards = [...cards].sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
            const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
            return dateB - dateA;
        });

        let document = `# CardContext Export\n\n`;
        document += `**Export Date:** ${new Date().toLocaleDateString()}\n`;
        document += `**Export Scope:** ${exportScope}\n`;
        
        if (cards.length > 0) {
            document += `**Total Cards:** ${cards.length}\n`;
        }
        
        document += `\n`;

        // Include collective summary at the top if it exists
        if (collectiveSummary) {
            document += `# Collective Summary\n\n`;
            document += `${collectiveSummary}\n\n`;
            document += `---\n\n`;
        }

        // Only show cards section if there are cards
        if (cards.length > 0) {
            document += `---\n\n`;

            sortedCards.forEach((card, index) => {
                document += `## Card ${index + 1}: ${escapeMarkdown(card.title || 'Untitled Card')}\n\n`;
                
                if (card.selected && exportScope.includes('Selected')) {
                    document += `> **✓ Selected for this export**\n\n`;
                }
                
                if (card.description) {
                    document += `**Description:** ${escapeMarkdown(card.description)}\n\n`;
                }
                
                if (card.summary) {
                    document += `**Simple Summary:** ${escapeMarkdown(card.summary)}\n\n`;
                }
                
                if (card.aiSummary) {
                    document += `**AI Summary:** ${escapeMarkdown(card.aiSummary)}\n\n`;
                }
                
                document += `### Content\n`;
                document += `${formatContentForExport(card.content)}\n\n`;
                
                if (card.tags && card.tags.length > 0) {
                    document += `**Tags:** ${card.tags.map(tag => `\`${escapeMarkdown(tag)}\``).join(', ')}\n\n`;
                }
                
                document += `### Metadata\n`;
                document += `- **Source:** ${getSourceDisplay(card.source || card.sourceUrl)}\n`;
                document += `- **Saved:** ${formatDate(card.timestamp || card.createdAt)}\n`;
                document += `- **ID:** ${card.id}\n`;
                
                if (card.metadata) {
                    if (card.metadata.wordCount) {
                        document += `- **Words:** ${card.metadata.wordCount}\n`;
                    }
                    if (card.metadata.characterCount) {
                        document += `- **Characters:** ${card.metadata.characterCount}\n`;
                    }
                }
                
                document += `\n---\n\n`;
            });

            const cardsWithSummaries = cards.filter(card => card.summary).length;
            const cardsWithAISummaries = cards.filter(card => card.aiSummary).length;
            
            if (cardsWithSummaries > 0 || cardsWithAISummaries > 0) {
                document += `# Summary Statistics\n\n`;
                document += `- **Cards with Simple Summaries:** ${cardsWithSummaries} of ${cards.length}\n`;
                document += `- **Cards with AI Summaries:** ${cardsWithAISummaries} of ${cards.length}\n\n`;
            }
        }

        return document;
    }

    function generateHTMLDocument(cards: Card[], collectiveSummary: string, exportScope: string): string {
        const sortedCards = [...cards].sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
            const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
            return dateB - dateA;
        });

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CardContext Export - ${exportScope} - ${new Date().toLocaleDateString()}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6;
        }
        .export-header {
            background: #2563eb;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .card { 
            border: 1px solid #e1e1e1; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            background: #f9f9f9;
        }
        .card-title { 
            color: #2563eb; 
            margin-top: 0; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 10px;
        }
        .card-content { 
            background: white; 
            padding: 15px; 
            border-left: 4px solid #2563eb; 
            margin: 15px 0;
        }
        .card-summary { 
            background: #f0f9ff; 
            padding: 12px; 
            border-radius: 6px; 
            margin: 10px 0; 
            border-left: 3px solid #3b82f6;
        }
        .card-ai-summary { 
            background: #ecfdf5; 
            padding: 12px; 
            border-radius: 6px; 
            margin: 10px 0; 
            border-left: 3px solid #10b981;
        }
        .collective-summary {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
        }
        .tag { 
            display: inline-block; 
            background: #e5e7eb; 
            padding: 4px 12px; 
            border-radius: 16px; 
            margin: 2px 4px 2px 0; 
            font-size: 0.9em;
        }
        .metadata { 
            font-size: 0.9em; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb; 
            padding-top: 10px;
        }
        .summary { 
            background: #f0f9ff; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
        }
        .selected-indicator {
            background: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="export-header">
        <h1>CardContext Export</h1>
        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Export Scope:</strong> ${exportScope}</p>
        ${cards.length > 0 ? `<p><strong>Total Cards:</strong> ${cards.length}</p>` : ''}
    </div>

    ${collectiveSummary ? `
    <div class="collective-summary">
        <h2>Collective Summary</h2>
        ${collectiveSummary.split('\n').map(line => `<p>${escapeHtml(line)}</p>`).join('')}
    </div>
    ` : ''}

    ${cards.length > 0 ? `
    <div class="summary">
        <h2>Cards Export</h2>
        <p><strong>Cards with Simple Summaries:</strong> ${cards.filter(card => card.summary).length}</p>
        <p><strong>Cards with AI Summaries:</strong> ${cards.filter(card => card.aiSummary).length}</p>
    </div>
    ` : ''}

    ${sortedCards.map((card, index) => `
    <div class="card">
        <h2 class="card-title">
            Card ${index + 1}: ${escapeHtml(card.title || 'Untitled Card')}
            ${card.selected && exportScope.includes('Selected') ? `<span class="selected-indicator">SELECTED</span>` : ''}
        </h2>
        
        ${card.description ? `<p><strong>Description:</strong> ${escapeHtml(card.description)}</p>` : ''}
        
        ${card.summary ? `
        <div class="card-summary">
            <strong>Simple Summary:</strong> ${escapeHtml(card.summary)}
        </div>
        ` : ''}
        
        ${card.aiSummary ? `
        <div class="card-ai-summary">
            <strong>AI Summary:</strong> ${escapeHtml(card.aiSummary)}
        </div>
        ` : ''}
        
        <div class="card-content">
            <strong>Content:</strong><br>
            ${card.content.split('\n').map(line => `<div>${escapeHtml(line)}</div>`).join('')}
        </div>
        
        ${card.tags && card.tags.length > 0 ? `
        <div>
            <strong>Tags:</strong><br>
            ${card.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        ` : ''}
        
        <div class="metadata">
            <strong>Source:</strong> ${getSourceDisplay(card.source || card.sourceUrl)}<br>
            <strong>Saved:</strong> ${formatDate(card.timestamp || card.createdAt)}<br>
            <strong>ID:</strong> ${card.id}
            ${card.metadata ? `
            <br><strong>Word Count:</strong> ${card.metadata.wordCount || 'N/A'}
            <br><strong>Character Count:</strong> ${card.metadata.characterCount || 'N/A'}
            ` : ''}
        </div>
    </div>
    `).join('')}

    <div class="summary">
        <h2>Export Information</h2>
        <p>Generated by CardContext Extension</p>
        <p>Includes both simple and AI-generated summaries where available</p>
        ${collectiveSummary ? '<p>Includes collective summary</p>' : ''}
        ${exportScope.includes('Selected') ? '<p>Includes only selected cards</p>' : ''}
        <p><strong>Export Scope:</strong> ${exportScope}</p>
    </div>
</body>
</html>`;
    }

    function formatContentForExport(content: string): string {
        return content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => `> ${line}`)
            .join('\n>\n');
    }

    function escapeMarkdown(text: string): string {
        return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
    }

    function escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(timestamp?: string): string {
        if (!timestamp) return 'Unknown date';
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return 'Invalid date';
        }
    }

    function getSourceDisplay(source?: string): string {
        if (!source) return 'Unknown source';
        try {
            return new URL(source).hostname;
        } catch {
            return source;
        }
    }
});
