"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus, Upload, Download, X, Search, Tag, FileText, Calendar, Zap, Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Load SelectionToContext only on client (avoid SSR/hydration issues)
const SelectionToContext = dynamic(() => import("@/components/toolwiz/SelectionToContext"), {
  ssr: false,
  loading: () => null,
});

// ----------------------
// 🧠 Type Definitions
// ----------------------
interface ContextCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt?: string;
}

interface CollectiveSummary {
  id: string;
  content: string;
  cardIds: string[];
  cardTitles: string[];
  createdAt: string;
}

type UpsertPayload = Omit<ContextCard, "id" | "createdAt"> & { id?: string };

// Client-only hook for localStorage
function useClientStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Client-only ID generator
function useClientId() {
  const generateId = () => {
    if (typeof window !== 'undefined' && window.crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  return generateId;
}

export default function ClientPage(): JSX.Element {
  const [cards, setCards] = useClientStorage<ContextCard[]>("context-cards", []);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCard, setEditingCard] = useState<ContextCard | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const generateId = useClientId();

  // --- AI summary state (updated)
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  
  // Updated state for collective summaries (now an array to retain multiple)
  const [collectiveSummaries, setCollectiveSummaries] = useClientStorage<CollectiveSummary[]>("collective-summaries", []);
  const [loadingCollectiveSummary, setLoadingCollectiveSummary] = useState(false);

  // Set mounted state to prevent SSR mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const features = [
    { icon: <FileText className="w-6 h-6" />, title: "Smart Organization", description: "Organize your thoughts, research, and ideas with customizable tags and categories." },
    { icon: <Zap className="w-6 h-6" />, title: "Quick Capture", description: "Instantly capture text from any webpage using our browser extension integration." },
    { icon: <Tag className="w-6 h-6" />, title: "Flexible Tagging", description: "Categorize your cards with custom tags for easy filtering and retrieval." },
    { icon: <Calendar className="w-6 h-6" />, title: "Auto-Save", description: "Your cards are automatically saved locally and sync with browser storage." }
  ];

  const benefits = [
    { title: "For Research", items: ["Capture research notes", "Organize sources", "Track key findings"] },
    { title: "For Learning", items: ["Create study notes", "Summarize articles", "Build knowledge base"] },
    { title: "For Productivity", items: ["Track project ideas", "Manage tasks", "Store important information"] }
  ];

  // Tags
  const tags = useMemo(() => {
    const s = new Set<string>();
    cards.forEach((c) => (c.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [cards]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (selectedTag && !(c.tags || []).includes(selectedTag)) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.tags || []).join(" ").toLowerCase().includes(q)
      );
    });
  }, [cards, search, selectedTag]);

  // Get selected card data
  const selectedCardData = useMemo(() => {
    return cards.filter(card => selectedCards.has(card.id));
  }, [cards, selectedCards]);

  // CRUD
  function upsertCard(payload: UpsertPayload): void {
    if (payload.id) {
      setCards((s) => s.map((c) => (c.id === payload.id ? { ...c, ...payload } : c)));
    } else {
      const newCard: ContextCard = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        title: payload.title,
        description: payload.description,
        tags: payload.tags || [],
      };
      setCards((s) => [newCard, ...s]);
    }
  }

  function removeCard(id: string): void {
    if (!confirm("Delete this card?")) return;
    setCards((s) => s.filter((c) => c.id !== id));
    // Remove from selected cards if present
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }

  // Updated export functions
  function exportJSON(): void {
    if (!isMounted) return;
    
    // Export selected cards if any are selected, otherwise export all cards
    const cardsToExport = selectedCards.size > 0 
      ? cards.filter(card => selectedCards.has(card.id))
      : cards;
    
    const payload = JSON.stringify(cardsToExport, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = selectedCards.size > 0 
      ? `selected-context-cards-${new Date().toISOString()}.json`
      : `all-context-cards-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(href);
  }

  function exportCollectiveSummary(summary: CollectiveSummary): void {
    if (!isMounted) return;
    
    const content = `COLLECTIVE SUMMARY
Generated: ${new Date(summary.createdAt).toLocaleString()}
Number of Cards: ${summary.cardIds.length}
Cards Included: ${summary.cardTitles.join(', ')}

SUMMARY:
${summary.content}

---
Generated by MemorAI App`;

    const blob = new Blob([content], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `collective-summary-${new Date(summary.createdAt).toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(href);
  }

  function importJSON(file: File | null): void {
    if (!file || !isMounted) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "[]")) as ContextCard[];
        const byId = new Map(cards.map((c) => [c.id, c]));
        parsed.forEach((p) => byId.set(p.id, p));
        setCards(Array.from(byId.values()));
      } catch (e) {
        console.error("Invalid JSON import", e);
        alert("Failed to import — invalid JSON");
      }
    };
    reader.readAsText(file);
  }

  // --- Card selection functions
  function toggleCardSelection(cardId: string): void {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }

  function clearSelection(): void {
    setSelectedCards(new Set());
  }

  function selectAllVisible(): void {
    const allVisibleIds = new Set(filtered.map(card => card.id));
    setSelectedCards(allVisibleIds);
  }

  // --- AI summary functions (updated)
  async function summarizeCard(cardId: string, text: string) {
    try {
      setLoadingSummaries((s) => ({ ...s, [cardId]: true }));
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        console.error("AI summarize response not ok", res.status);
        setSummaries((s) => ({ ...s, [cardId]: "AI failed to generate a summary." }));
        return;
      }
      const data = await res.json();
      const summary = data?.summary || "No summary returned.";
      setSummaries((s) => ({ ...s, [cardId]: summary }));
    } catch (err) {
      console.error("summarizeCard error", err);
      setSummaries((s) => ({ ...s, [cardId]: "Error generating summary." }));
    } finally {
      setLoadingSummaries((s) => ({ ...s, [cardId]: false }));
    }
  }

  async function summarizeSelectedCards() {
    if (selectedCards.size === 0) {
      alert("Please select at least one card to summarize.");
      return;
    }

    try {
      setLoadingCollectiveSummary(true);
      
      // Combine all selected card content with proper structure
      const combinedText = selectedCardData
        .map(card => `CARD: "${card.title}"\nCONTENT: ${card.description}\n${card.tags.length > 0 ? `TAGS: ${card.tags.join(', ')}` : ''}`)
        .join('\n\n---\n\n');

      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: combinedText,
          context: `Create a unified summary that synthesizes the key themes and insights from these ${selectedCardData.length} related cards. Identify common patterns, main topics, and overall conclusions.`
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        alert("Failed to generate collective summary. Please try again.");
        return;
      }
      
      const data = await res.json();
      const summary = data?.summary || "No collective summary returned.";
      
      // Create and save new collective summary
      const newCollectiveSummary: CollectiveSummary = {
        id: generateId(),
        content: summary,
        cardIds: Array.from(selectedCards),
        cardTitles: selectedCardData.map(card => card.title),
        createdAt: new Date().toISOString(),
      };
      
      setCollectiveSummaries(prev => [newCollectiveSummary, ...prev]);
      
    } catch (err) {
      console.error("summarizeSelectedCards error", err);
      alert("Error generating collective summary. Please check your connection and try again.");
    } finally {
      setLoadingCollectiveSummary(false);
    }
  }

  function removeCollectiveSummary(id: string): void {
    if (!confirm("Delete this collective summary?")) return;
    setCollectiveSummaries(prev => prev.filter(summary => summary.id !== id));
  }

  function EditorModal({ card, onClose }: { card?: ContextCard | null; onClose: () => void }) {
    const isNew = !card;
    const [title, setTitle] = useState(card?.title || "");
    const [description, setDescription] = useState(card?.description || "");
    const [tagsInput, setTagsInput] = useState((card?.tags || []).join(", "));

    function save(): void {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      upsertCard({
        id: card?.id,
        title: title || "Untitled",
        description: description || "",
        tags,
      });
      onClose();
    }

    if (!isMounted) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 8, scale: 0.995 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.995 }} className="relative z-10 w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{isNew ? "New Context Card" : "Edit Context Card"}</h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-600" /></button>
          </div>

          <div className="space-y-4">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <textarea placeholder="Description / context" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none resize-none" />
            <input placeholder="Tags — comma separated" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold">Save Card</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Don't render interactive content until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white font-poppins">
        <Header />
        
        <main className="pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🧩</div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">MemorAI</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">AI-powered contextual note cards for enhanced productivity and organization</p>
            </div>
            <div className="text-center py-12">
              <div className="animate-pulse">Loading MemorAI Cards...</div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-6xl mb-4">🧩</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">MemorAI</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              MemorAI doesn&quot;t just store your highlights — it understands them, turning every snippet into intelligent, AI-summarized notes you&quot;ll actually remember
            </p>
          </div>

          <div className="mb-8 sm:mb-12">
            <SelectionToContext onAdd={(selectedText: string) => { setEditingCard({ id: "", title: "Captured Highlight", description: selectedText, tags: ["highlight"], createdAt: new Date().toISOString() }); setShowEditor(true); }} />

            {/* Main Tool Card - Enhanced Responsiveness */}
            <Card className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm mb-6 sm:mb-8">
              <CardContent className="p-4 sm:p-6">
                {/* Search and Actions Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Search Input - Full width on mobile, 2/3 on desktop */}
                  <div className="flex items-center w-full lg:w-2/3">
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 w-full">
                      <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Search title, description, tags..." 
                        className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-gray-900 text-sm sm:text-base" 
                      />
                    </div>
                  </div>

                  {/* Action Buttons - Enhanced mobile layout */}
                  <div className="flex flex-col xs:flex-row gap-2 items-stretch xs:items-center justify-end w-full lg:w-auto">
                    {/* Primary Actions Row */}
                    <div className="flex gap-2 justify-between xs:justify-start">
                      <button 
                        onClick={() => { setEditingCard(null); setShowEditor(true); }} 
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base flex-1 xs:flex-none"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden xs:inline">Add Card</span>
                        <span className="xs:hidden">Add</span>
                      </button>

                      {/* AI Summary Button - Responsive text */}
                      <button
                        onClick={summarizeSelectedCards}
                        disabled={loadingCollectiveSummary || selectedCards.size === 0}
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#4D0682] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 xs:flex-none"
                      >
                        <Wand2 className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">
                          {loadingCollectiveSummary 
                            ? `Generating...` 
                            : `AI Summary (${selectedCards.size})`}
                        </span>
                        <span className="sm:hidden">
                          {loadingCollectiveSummary ? `...` : `AI (${selectedCards.size})`}
                        </span>
                      </button>
                    </div>

                    {/* Secondary Actions Row */}
                    <div className="flex gap-2 justify-between xs:justify-start">
                      {/* Selection Controls - Show only when cards are selected */}
                      {selectedCards.size > 0 && (
                        <>
                          <button 
                            onClick={clearSelection}
                            className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm flex-1 xs:flex-none"
                          >
                            <X className="w-3 h-3" />
                            <span className="hidden sm:inline">Clear</span>
                          </button>
                          <button 
                            onClick={selectAllVisible}
                            className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm flex-1 xs:flex-none"
                          >
                            <span className="hidden sm:inline">Select All</span>
                            <span className="sm:hidden">All</span>
                          </button>
                        </>
                      )}

                      {/* Export/Import Buttons */}
                      <button 
                        onClick={exportJSON} 
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base flex-1 xs:flex-none"
                      >
                        <Download className="w-4 h-4" /> 
                        <span className="hidden sm:inline">
                          {selectedCards.size > 0 ? `Export (${selectedCards.size})` : 'Export All'}
                        </span>
                        <span className="sm:hidden">Export</span>
                      </button>

                      <label className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base flex-1 xs:flex-none">
                        <input type="file" accept="application/json" className="hidden" onChange={(e) => importJSON(e.target.files?.[0] ?? null)} />
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Import</span>
                        <span className="sm:hidden">Import</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tag Filters - Improved mobile layout */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium whitespace-nowrap">Filter by Tags</span>
                  </div>

                  <div className="flex gap-1 sm:gap-2 flex-wrap">
                    <button 
                      onClick={() => setSelectedTag(null)} 
                      className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm ${selectedTag === null ? "bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white border-transparent" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"} transition-colors whitespace-nowrap`}
                    >
                      All
                    </button>
                    {tags.map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setSelectedTag((s) => (s === t ? null : t))} 
                        className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm ${selectedTag === t ? "bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white border-transparent" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"} transition-colors whitespace-nowrap`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {showEditor && <EditorModal card={editingCard || undefined} onClose={() => { setShowEditor(false); setEditingCard(null); }} />}
            </AnimatePresence>

            {/* Collective Summaries Display - Improved mobile layout */}
            {collectiveSummaries.length > 0 && (
              <div className="mb-6 sm:mb-8 space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Collective Summaries
                </h3>
                {collectiveSummaries.map((summary) => (
                  <motion.div 
                    key={summary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-bold text-purple-900">
                              🧠 Collective Summary ({summary.cardIds.length} Cards)
                            </h3>
                            <p className="text-xs sm:text-sm text-purple-700">
                              Generated: {new Date(summary.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2 self-end sm:self-auto">
                            <button 
                              onClick={() => exportCollectiveSummary(summary)}
                              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1 rounded-lg bg-purple-600 text-white text-xs sm:text-sm hover:bg-purple-700 transition-colors"
                              title="Export this collective summary"
                            >
                              <Download className="w-3 h-3" />
                              <span className="hidden xs:inline">Export</span>
                            </button>
                            <button 
                              onClick={() => removeCollectiveSummary(summary.id)}
                              className="p-1 sm:p-1 rounded-md hover:bg-purple-100 transition-colors"
                              title="Delete this collective summary"
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                            </button>
                          </div>
                        </div>
                        <div className="prose prose-purple max-w-none">
                          <div className="text-gray-700 whitespace-pre-line bg-white/50 rounded-lg p-3 sm:p-4 border border-purple-100 text-sm sm:text-base">
                            {summary.content}
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
                          {summary.cardTitles.map((title, index) => (
                            <span 
                              key={index}
                              className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm border border-purple-200 truncate max-w-[120px] sm:max-w-none"
                              title={title}
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Cards Grid - Enhanced mobile layout */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filtered.map((c) => (
                <motion.article 
                  key={c.id} 
                  layout 
                  initial={{ opacity: 0, y: 8 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 8 }} 
                  className={`bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1 ${
                    selectedCards.has(c.id) ? 'ring-2 ring-purple-500 ring-opacity-50 border-purple-300' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                      <div className="flex items-center gap-3 mb-3">
                        {/* Selection checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedCards.has(c.id)}
                          onChange={() => toggleCardSelection(c.id)}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 flex-shrink-0"
                        />
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <FileText className="w-3 h-3 sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate" title={c.title}>
                          {c.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{c.description}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                        {(c.tags || []).length > 0 ? 
                          (c.tags || []).map((t) => (
                            <span key={t} className="px-2 py-1 rounded-full text-xs border border-gray-300 bg-gray-50 text-gray-700 whitespace-nowrap">
                              {t}
                            </span>
                          )) : 
                          (<span className="text-xs text-gray-500">No tags</span>)
                        }
                      </div>
                      <div className="text-xs text-gray-500">Created: {new Date(c.createdAt ?? "").toLocaleDateString()}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {/* AI Summary Button - Compact on mobile */}
                      <button
                        title="AI Summary"
                        onClick={() => summarizeCard(c.id, c.description)}
                        disabled={!!loadingSummaries[c.id]}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4D0682] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">
                          {loadingSummaries[c.id] ? "..." : "AI"}
                        </span>
                      </button>

                      <div className="flex gap-1 sm:gap-2">
                        <button 
                          title="Edit" 
                          onClick={() => { setEditingCard(c); setShowEditor(true); }} 
                          className="p-1 sm:p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                        >
                          ✏️
                        </button>
                        <button 
                          title="Delete" 
                          onClick={() => removeCard(c.id)} 
                          className="p-1 sm:p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Individual AI Summary Display */}
                  {summaries[c.id] && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                      <div className="text-xs font-semibold text-purple-700 mb-1">AI Summary</div>
                      <div className="text-sm text-gray-700 whitespace-pre-line">{summaries[c.id]}</div>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No MemorAI cards found</h3>
                <p className="text-gray-600 text-sm sm:text-base">Create your first card to get started with organized note-taking.</p>
              </div>
            )}
          </div>

          {/* ----------------------------------- */}
          {/* 🧩 INSTALL SECTION - Made Responsive */}
          {/* ----------------------------------- */}
          <section className="mt-8 sm:mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Install the MemorAI Chrome Extension
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                Add the MemorAI Chrome Extension to save text from any webpage — and let 
                AI instantly summarize and organize your insights in one intelligent workspace.
              </p>

              {/* Adsterra AD Button */}
              <div className="flex flex-col items-center gap-4 mb-3">
                <div className="adsterra-monetization flex flex-col items-center gap-4 bg-purple-200 border border-gray-300 rounded-xl p-4 sm:p-6 shadow-md mt-4 sm:mt-6 text-left max-w-2xl w-full">
                  <p className="monetization-note text-gray-600 text-sm max-w-sm text-center mx-auto">
                    &quot;We monetise this site with non-intrusive ads via Adsterra, which helps keep the tool free and maintained&quot;
                  </p>
                  <button
                    className="smartlink-btn inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base w-full sm:w-auto"
                    onClick={() => window.open('https://www.effectivegatecpm.com/y83y6xhhp?key=7438c8e0613e1d38069c5df5f868a451')}
                    title="Clicking supports our free service through non-intrusive ads"
                  >
                    Continue to Content
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <a
                  href="/downloads/contextcards-extension-v1.zip"
                  download
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Extension (.zip)
                </a>

                <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm mt-4 sm:mt-6 text-left max-w-2xl w-full">
                  <h3 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Manual Installation Guide</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-xs sm:text-sm">
                    <li>Download and unzip the <strong>contextcards-extension-v1.zip</strong> file.</li>
                    <li>Open <strong>chrome://extensions/</strong> in your Chrome browser.</li>
                    <li>Turn on <strong>Developer mode</strong> (top-right toggle).</li>
                    <li>Click <strong>Load unpacked</strong> and select the dist folder inside the extracted files.</li>
                    <li>Once loaded, you&apos;ll see the <strong>🧩 CardContext</strong> icon appear in your toolbar.</li>
                  </ol>
                </div>

                <p className="text-gray-500 text-xs sm:text-sm mt-4">
                  💡 Tip: Pin the extension for quick access from your Chrome toolbar.
                </p>
              </div>
            </div>
          </section>

          {/* Features and Benefits Section - Improved mobile layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Why Use MemorAI Cards?</h2>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">{feature.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Perfect For</h2>
              <div className="space-y-4 sm:space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1">
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-lg flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-full mr-3" />
                      {benefit.title}
                    </h3>
                    <ul className="space-y-1 sm:space-y-2">
                      {benefit.items.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <span className="text-[#7C3AED] mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works Section - Improved mobile layout */}
          <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-6 sm:p-8 text-white mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="space-y-2 sm:space-y-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-sm sm:text-lg font-bold">
                    {step}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">{
                    ['Capture Text', 'Add Context', 'Organize', 'Access Anywhere'][step - 1]
                  }</h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-tight">
                    {[
                      'Select text on any webpage or create manually',
                      'Add title, description, and tags for organization',
                      'Use tags and search to find cards instantly',
                      'Your cards sync across browser and local storage'
                    ][step - 1]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-8 sm:my-16 border-gray-200" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
