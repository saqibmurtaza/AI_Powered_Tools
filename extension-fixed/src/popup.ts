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
}

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

    await loadCards();

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
            updateGlobalSummary(cards);
            
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
                    <h3 class="card-title">${escapeHtml(card.title || 'Untitled Card')}</h3>
                    <div class="card-actions">
                        <button class="summary-btn" data-card-id="${card.id}" title="Generate Summary">
                            📝
                        </button>
                    </div>
                </div>
                ${card.description ? `<div class="card-description">${escapeHtml(card.description)}</div>` : ''}
                
                ${card.summary ? `
                <div class="card-summary">
                    <strong>Summary:</strong> ${escapeHtml(card.summary)}
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

        document.querySelectorAll('.summary-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const cardId = (e.target as HTMLElement).closest('.summary-btn')?.getAttribute('data-card-id');
                if (cardId) {
                    generateIndividualSummary(cardId);
                }
            });
        });
    }

    function updateCardsCount(count: number): void {
        if (cardsCount) {
            cardsCount.textContent = count.toString();
        }
    }

    function updateGlobalSummary(cards: Card[]): void {
        if (!aiSummary) return;

        if (cards.length === 0) {
            aiSummary.innerHTML = `
                <div class="summary-header">
                    <h3>AI Summary</h3>
                    <button class="refresh-btn" disabled>↻</button>
                </div>
                <div class="summary-placeholder">Select text and use right-click → "Save to CardContext" to create cards</div>
            `;
            return;
        }

        const summaryContent = generateGlobalSummary(cards);
        
        aiSummary.innerHTML = `
            <div class="summary-header">
                <h3>AI Summary</h3>
                <button class="refresh-btn" id="refreshGlobalSummary" title="Refresh Summary">↻</button>
            </div>
            <div class="summary-content">
                ${summaryContent}
            </div>
            <div class="summary-actions">
                <button class="summary-action-btn" id="generateGroupSummary">Summarize All Cards</button>
                <button class="summary-action-btn" id="analyzeTags">Analyze Tags</button>
            </div>
        `;

        document.getElementById('refreshGlobalSummary')?.addEventListener('click', () => {
            updateGlobalSummary(cards);
        });

        document.getElementById('generateGroupSummary')?.addEventListener('click', () => {
            generateGroupSummary(cards);
        });

        document.getElementById('analyzeTags')?.addEventListener('click', () => {
            analyzeTags(cards);
        });
    }

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
            const summary = await generateAISummary(card);
            
            card.summary = summary;
            await saveCardsToStorage(cards);
            
            renderCards(cards);
            
            console.log('✅ Individual summary generated for card:', cardId);
        } catch (error) {
            console.error('❌ Error generating individual summary:', error);
            alert('Failed to generate summary. Please try again.');
        }
    }

    async function generateGroupSummary(cards: Card[]): Promise<void> {
        if (cards.length === 0) {
            alert('No cards available for group summary.');
            return;
        }

        const groupSummaryBtn = document.getElementById('generateGroupSummary') as HTMLButtonElement;
        const originalText = groupSummaryBtn.textContent;
        groupSummaryBtn.textContent = 'Generating...';
        groupSummaryBtn.disabled = true;

        try {
            const groupSummary = await generateAIGroupSummary(cards);
            
            if (aiSummary) {
                aiSummary.innerHTML = `
                    <div class="summary-header">
                        <h3>Group Summary</h3>
                        <button class="refresh-btn" id="backToGlobalSummary">← Back</button>
                    </div>
                    <div class="summary-content">
                        <strong>Comprehensive Analysis of ${cards.length} Cards:</strong><br><br>
                        ${escapeHtml(groupSummary)}
                    </div>
                `;

                document.getElementById('backToGlobalSummary')?.addEventListener('click', () => {
                    updateGlobalSummary(cards);
                });
            }
            
            console.log('✅ Group summary generated for', cards.length, 'cards');
        } catch (error) {
            console.error('❌ Error generating group summary:', error);
            alert('Failed to generate group summary. Please try again.');
        } finally {
            groupSummaryBtn.textContent = originalText;
            groupSummaryBtn.disabled = false;
        }
    }

    async function analyzeTags(cards: Card[]): Promise<void> {
        const tagAnalysis = generateTagAnalysis(cards);
        
        if (aiSummary) {
            aiSummary.innerHTML = `
                <div class="summary-header">
                    <h3>Tag Analysis</h3>
                    <button class="refresh-btn" id="backToGlobalSummary">← Back</button>
                </div>
                <div class="summary-content">
                    ${tagAnalysis}
                </div>
            `;

            document.getElementById('backToGlobalSummary')?.addEventListener('click', () => {
                updateGlobalSummary(cards);
            });
        }
    }

    async function generateAISummary(card: Card): Promise<string> {
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

    async function generateAIGroupSummary(cards: Card[]): Promise<string> {
        const allContent = cards.map(card => card.content).join('\n\n');
        const allTitles = cards.map(card => card.title).join(', ');
        
        const commonWords = extractCommonThemes(cards);
        const tagGroups = groupCardsByTags(cards);

        let summary = `Based on analysis of ${cards.length} cards with titles: ${allTitles}\n\n`;

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

        const recentCards = cards.filter(card => {
            const cardDate = new Date(card.timestamp || card.createdAt || '');
            const daysAgo = (Date.now() - cardDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo < 7;
        });

        if (recentCards.length > 0) {
            summary += `**Recent Activity:** ${recentCards.length} cards saved in the last week\n\n`;
        }

        const avgLength = cards.reduce((sum, card) => sum + card.content.length, 0) / cards.length;
        summary += `**Content Insights:** Average card length: ${Math.round(avgLength)} characters\n\n`;

        summary += `**Recommendation:** `;
        if (cards.length < 5) {
            summary += `Continue building your collection. Consider adding more diverse content.`;
        } else if (cards.length < 20) {
            summary += `You're building a solid knowledge base. Consider organizing cards with more specific tags.`;
        } else {
            summary += `You have a comprehensive collection. Consider exporting or creating focused subgroups.`;
        }

        return summary;
    }

    function generateGlobalSummary(cards: Card[]): string {
        const recentCards = cards.filter(card => {
            const cardDate = new Date(card.timestamp || card.createdAt || '');
            return (Date.now() - cardDate.getTime()) < (24 * 60 * 60 * 1000);
        });

        const cardsWithSummaries = cards.filter(card => card.summary).length;

        return `
            You have <strong>${cards.length}</strong> saved cards.<br>
            ${recentCards.length > 0 ? `<strong>${recentCards.length}</strong> added today.` : ''}<br>
            ${cardsWithSummaries > 0 ? `<strong>${cardsWithSummaries}</strong> cards have summaries.` : ''}<br><br>
            <em>Use the buttons below to generate detailed analyses.</em>
        `;
    }

    function generateTagAnalysis(cards: Card[]): string {
        const tagCounts: { [key: string]: number } = {};
        const tagWordCounts: { [key: string]: number } = {};
        
        cards.forEach(card => {
            if (card.tags) {
                card.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    tagWordCounts[tag] = (tagWordCounts[tag] || 0) + (card.content.split(' ').length || 0);
                });
            }
        });

        const sortedTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        let analysis = `<strong>Top Tags Analysis:</strong><br><br>`;
        
        if (sortedTags.length === 0) {
            analysis += `No tags used yet. Consider adding tags to organize your cards.`;
        } else {
            sortedTags.forEach(([tag, count]) => {
                const avgWords = Math.round(tagWordCounts[tag] / count);
                analysis += `• <strong>${escapeHtml(tag)}</strong>: ${count} cards (avg. ${avgWords} words per card)<br>`;
            });
        }

        return analysis;
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

    function exportCards(): void {
        chrome.storage.local.get(['contextCards'], (result: StorageResult) => {
            const cards: Card[] = result.contextCards || [];
            
            if (cards.length === 0) {
                alert('No cards to export.');
                return;
            }

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
                    exportAsStructuredDocument(cards);
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
            
            if (card.summary) {
                document += `**AI Summary:** ${escapeMarkdown(card.summary)}\n\n`;
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
        if (cardsWithSummaries > 0) {
            document += `# Summary\n\n`;
            document += `- **Cards with AI Summaries:** ${cardsWithSummaries} of ${cards.length}\n`;
            document += `- **Summary Coverage:** ${Math.round((cardsWithSummaries / cards.length) * 100)}%\n\n`;
        }

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
        .card-summary { 
            background: #f0f9ff; 
            padding: 12px; 
            border-radius: 6px; 
            margin: 10px 0; 
            border-left: 3px solid #3b82f6;
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
        <p><strong>Cards with AI Summaries:</strong> ${cards.filter(card => card.summary).length}</p>
    </div>

    ${sortedCards.map((card, index) => `
    <div class="card">
        <h2 class="card-title">Card ${index + 1}: ${escapeHtml(card.title || 'Untitled Card')}</h2>
        
        ${card.description ? `<p><strong>Description:</strong> ${escapeHtml(card.description)}</p>` : ''}
        
        ${card.summary ? `
        <div class="card-summary">
            <strong>AI Summary:</strong> ${escapeHtml(card.summary)}
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
        </div>
    </div>
    `).join('')}

    <div class="summary">
        <h2>Export Summary</h2>
        <p>Generated by CardContext Extension</p>
        <p>Includes AI-generated summaries where available</p>
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
