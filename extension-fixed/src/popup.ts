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
// }

// // Storage result interface
// interface StorageResult {
//     contextCards?: Card[];
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     console.log('🎯 Popup loaded');
    
//     const cardsContainer = document.getElementById('cards') as HTMLDivElement;
//     const cardsCount = document.getElementById('cardsCount') as HTMLSpanElement;
//     const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
//     const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
//     const aiSummary = document.getElementById('aiSummary') as HTMLDivElement;

//     // Load cards when popup opens
//     await loadCards();

//     // Clear all cards
//     clearBtn.addEventListener('click', async () => {
//         if (confirm('Are you sure you want to clear all cards? This action cannot be undone.')) {
//             await new Promise<void>((resolve) => {
//                 chrome.storage.local.set({ contextCards: [] }, () => {
//                     resolve();
//                 });
//             });
//             await loadCards();
//             console.log('✅ All cards cleared');
//         }
//     });

//     // Export cards
//     exportBtn.addEventListener('click', exportCards);

//     async function loadCards(): Promise<void> {
//         try {
//             console.log('📚 Loading cards...');
//             const result = await new Promise<StorageResult>((resolve) => {
//                 chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
//                     resolve(result);
//                 });
//             });
            
//             const cards: Card[] = result.contextCards || [];
//             console.log(`✅ Loaded ${cards.length} cards from storage:`, cards);
            
//             renderCards(cards);
//             updateCardsCount(cards.length);
//             updateSummary(cards);
            
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

//         // Sort cards by timestamp (newest first)
//         cards.sort((a, b) => {
//             const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
//             const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
//             return dateB - dateA;
//         });

//         cardsContainer.innerHTML = cards.map(card => `
//             <div class="card" data-card-id="${card.id}">
//                 <div class="card-header">
//                     <h3 class="card-title">${escapeHtml(card.title || 'Untitled Card')}</h3>
//                 </div>
//                 ${card.description ? `<div class="card-description">${escapeHtml(card.description)}</div>` : ''}
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
//     }

//     function updateCardsCount(count: number): void {
//         if (cardsCount) {
//             cardsCount.textContent = count.toString();
//         }
//     }

//     function updateSummary(cards: Card[]): void {
//         if (!aiSummary) return;

//         if (cards.length === 0) {
//             aiSummary.innerHTML = '<div class="summary-placeholder">Select text and use right-click → "Save to CardContext" to create cards</div>';
//             return;
//         }

//         // Simple summary based on card count and recent activity
//         const recentCards = cards.filter(card => {
//             const cardDate = new Date(card.timestamp || card.createdAt || '');
//             const today = new Date();
//             return (today.getTime() - cardDate.getTime()) < (24 * 60 * 60 * 1000); // Last 24 hours
//         });

//         const summaryText = `
//             You have ${cards.length} saved card${cards.length !== 1 ? 's' : ''}. 
//             ${recentCards.length > 0 ? `${recentCards.length} added in the last 24 hours.` : ''}
//             ${cards.length >= 5 ? 'Consider exporting your cards to free up space.' : ''}
//         `;

//         aiSummary.innerHTML = `
//             <div class="summary-content">
//                 ${summaryText}
//             </div>
//         `;
//     }

//     function exportCards(): void {
//         chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
//             const cards: Card[] = result.contextCards || [];
            
//             if (cards.length === 0) {
//                 alert('No cards to export.');
//                 return;
//             }

//             const exportData = {
//                 version: '1.0',
//                 exportDate: new Date().toISOString(),
//                 totalCards: cards.length,
//                 cards: cards
//             };

//             const dataStr = JSON.stringify(exportData, null, 2);
//             const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
//             const url = URL.createObjectURL(dataBlob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `cardcontext-export-${new Date().toISOString().split('T')[0]}.json`;
            
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(url);
            
//             console.log(`✅ Exported ${cards.length} cards`);
//         });
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
            return (today.getTime() - cardDate.getTime()) < (24 * 60 * 60 * 1000);
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

    // ENHANCED EXPORT FUNCTIONALITY
    function exportCards(): void {
        chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
            const cards: Card[] = result.contextCards || [];
            
            if (cards.length === 0) {
                alert('No cards to export.');
                return;
            }

            // Ask user for preferred format
            const choice = prompt(
                'Choose export format:\n\n1 = Structured Document (Markdown)\n2 = Web Page (HTML)\n3 = Raw Data (JSON)\n\nEnter 1, 2, or 3:',
                '1'
            );

            switch (choice) {
                case '1':
                    exportAsStructuredDocument(cards);
                    break;
                case '2':
                    exportAsHTML(cards);
                    break;
                case '3':
                    exportAsJSON(cards);
                    break;
                default:
                    exportAsStructuredDocument(cards); // Default to markdown
            }
        });
    }

    function exportAsStructuredDocument(cards: Card[]): void {
        const documentContent = generateStructuredDocument(cards);
        const dataBlob = new Blob([documentContent], { type: 'text/markdown' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cardcontext-document-${new Date().toISOString().split('T')[0]}.md`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Exported ${cards.length} cards as structured document`);
    }

    function exportAsHTML(cards: Card[]): void {
        const htmlContent = generateHTMLDocument(cards);
        const dataBlob = new Blob([htmlContent], { type: 'text/html' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cardcontext-export-${new Date().toISOString().split('T')[0]}.html`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Exported ${cards.length} cards as HTML document`);
    }

    function exportAsJSON(cards: Card[]): void {
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
        
        console.log(`✅ Exported ${cards.length} cards as JSON`);
    }

    function generateStructuredDocument(cards: Card[]): string {
        const sortedCards = [...cards].sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || '').getTime();
            const dateB = new Date(b.timestamp || b.createdAt || '').getTime();
            return dateB - dateA;
        });

        let document = `# CardContext Export\n\n`;
        document += `**Export Date:** ${new Date().toLocaleDateString()}\n`;
        document += `**Total Cards:** ${cards.length}\n\n`;
        document += `---\n\n`;

        sortedCards.forEach((card, index) => {
            document += `## Card ${index + 1}: ${escapeMarkdown(card.title || 'Untitled Card')}\n\n`;
            
            if (card.description) {
                document += `**Description:** ${escapeMarkdown(card.description)}\n\n`;
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

        return document;
    }

    function generateHTMLDocument(cards: Card[]): string {
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
    <title>CardContext Export - ${new Date().toLocaleDateString()}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6;
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
    </style>
</head>
<body>
    <h1>CardContext Export</h1>
    <div class="summary">
        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Total Cards:</strong> ${cards.length}</p>
    </div>

    ${sortedCards.map((card, index) => `
    <div class="card">
        <h2 class="card-title">Card ${index + 1}: ${escapeHtml(card.title || 'Untitled Card')}</h2>
        
        ${card.description ? `<p><strong>Description:</strong> ${escapeHtml(card.description)}</p>` : ''}
        
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
        </div>
    </div>
    `).join('')}

    <div class="summary">
        <h2>Export Summary</h2>
        <p>Generated by CardContext Extension</p>
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
