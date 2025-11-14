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
}

// Storage result interface
interface StorageResult {
    contextCards?: Card[];
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎯 Popup loaded');
    
    const cardsContainer = document.getElementById('cards') as HTMLDivElement;
    const cardsCount = document.getElementById('cardsCount') as HTMLSpanElement;
    const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
    const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
    const aiSummary = document.getElementById('aiSummary') as HTMLDivElement;

    // Load cards when popup opens
    await loadCards();

    // Clear all cards
    clearBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear all cards? This action cannot be undone.')) {
            await new Promise<void>((resolve) => {
                chrome.storage.local.set({ contextCards: [] }, () => {
                    resolve();
                });
            });
            await loadCards();
            console.log('✅ All cards cleared');
        }
    });

    // Export cards
    exportBtn.addEventListener('click', exportCards);

    async function loadCards(): Promise<void> {
        try {
            console.log('📚 Loading cards...');
            const result = await new Promise<StorageResult>((resolve) => {
                chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
                    resolve(result);
                });
            });
            
            const cards: Card[] = result.contextCards || [];
            console.log(`✅ Loaded ${cards.length} cards from storage:`, cards);
            
            renderCards(cards);
            updateCardsCount(cards.length);
            updateSummary(cards);
            
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

        // Sort cards by timestamp (newest first)
        cards.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
            const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
            return dateB - dateA;
        });

        cardsContainer.innerHTML = cards.map(card => `
            <div class="card" data-card-id="${card.id}">
                <div class="card-header">
                    <h3 class="card-title">${escapeHtml(card.title || 'Untitled Card')}</h3>
                </div>
                ${card.description ? `<div class="card-description">${escapeHtml(card.description)}</div>` : ''}
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
    }

    function updateCardsCount(count: number): void {
        if (cardsCount) {
            cardsCount.textContent = count.toString();
        }
    }

    function updateSummary(cards: Card[]): void {
        if (!aiSummary) return;

        if (cards.length === 0) {
            aiSummary.innerHTML = '<div class="summary-placeholder">Select text and use right-click → "Save to CardContext" to create cards</div>';
            return;
        }

        // Simple summary based on card count and recent activity
        const recentCards = cards.filter(card => {
            const cardDate = new Date(card.timestamp || card.createdAt || '');
            const today = new Date();
            return (today.getTime() - cardDate.getTime()) < (24 * 60 * 60 * 1000); // Last 24 hours
        });

        const summaryText = `
            You have ${cards.length} saved card${cards.length !== 1 ? 's' : ''}. 
            ${recentCards.length > 0 ? `${recentCards.length} added in the last 24 hours.` : ''}
            ${cards.length >= 5 ? 'Consider exporting your cards to free up space.' : ''}
        `;

        aiSummary.innerHTML = `
            <div class="summary-content">
                ${summaryText}
            </div>
        `;
    }

    function exportCards(): void {
        chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
            const cards: Card[] = result.contextCards || [];
            
            if (cards.length === 0) {
                alert('No cards to export.');
                return;
            }

            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                totalCards: cards.length,
                cards: cards
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cardcontext-export-${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log(`✅ Exported ${cards.length} cards`);
        });
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