"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload, Download, X, Search, Tag, FileText, Calendar, Zap, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Load SelectionToContext only on client
const SelectionToContext = dynamic(() => import("@/components/toolwiz/SelectionToContext"), { ssr: false });

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

type UpsertPayload = Omit<ContextCard, "id" | "createdAt"> & { id?: string };

interface ChromeStorageChange {
  newValue?: ContextCard[];
  oldValue?: ContextCard[];
}

interface ChromeStorageArea {
  get: (keys: string[], callback: (result: { [key: string]: unknown }) => void) => void;
}

interface ChromeStorage {
  local: ChromeStorageArea;
  onChanged: {
    addListener: (callback: (changes: { [key: string]: ChromeStorageChange }) => void) => void;
  };
}

interface ExtendedWindow extends Window {
  chrome?: {
    storage: ChromeStorage;
  };
}

// ----------------------
// ✅ Main Page
// ----------------------
export default function ContextCardsPage(): JSX.Element {
  const [cards, setCards] = useState<ContextCard[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCard, setEditingCard] = useState<ContextCard | null>(null);

  // ----------------------
  // 📦 Load from storage
  // ----------------------
  useEffect(() => {
    let mounted = true;

    async function loadCards() {
      try {
        const extendedWindow = window as ExtendedWindow;
        if (extendedWindow.chrome?.storage?.local) {
          extendedWindow.chrome.storage.local.get(["contextCards"], (res: { contextCards?: ContextCard[] }) => {
            if (!mounted) return;
            const fromExt = Array.isArray(res?.contextCards) ? res.contextCards : [];

            if (fromExt.length > 0) {
              try {
                const rawLocal = localStorage.getItem("context-cards");
                const local = rawLocal ? (JSON.parse(rawLocal) as ContextCard[]) : [];
                const byId = new Map<string, ContextCard>();
                [...fromExt, ...local].forEach((c) => byId.set(String(c.id), c));
                const merged = Array.from(byId.values());
                setCards(merged);
                localStorage.setItem("context-cards", JSON.stringify(merged));
              } catch (e) {
                console.warn("Failed merging extension + local storage", e);
                setCards(fromExt);
              }
            } else {
              const raw = localStorage.getItem("context-cards");
              if (raw) setCards(JSON.parse(raw));
            }
          });

          // ✅ Listen for updates
          try {
            extendedWindow.chrome.storage.onChanged.addListener((changes: { [key: string]: ChromeStorageChange }) => {
              if (!mounted) return;
              if (changes.contextCards?.newValue) {
                const newCards = Array.isArray(changes.contextCards.newValue) ? changes.contextCards.newValue : [];
                setCards((prev) => {
                  const byId = new Map<string, ContextCard>();
                  [...newCards, ...prev].forEach((c) => byId.set(String(c.id), c));
                  const merged = Array.from(byId.values());
                  localStorage.setItem("context-cards", JSON.stringify(merged));
                  return merged;
                });
              }
            });
          } catch {
            /* ignore */
          }
          return;
        }
      } catch (e) {
        console.warn("chrome.storage access failed, using localStorage", e);
      }

      const raw = localStorage.getItem("context-cards");
      if (raw) setCards(JSON.parse(raw));
    }

    loadCards();
    return () => {
      mounted = false;
    };
  }, []);

  // 💾 Persist locally
  useEffect(() => {
    try {
      localStorage.setItem("context-cards", JSON.stringify(cards));
    } catch {}
  }, [cards]);

  // 🏷️ Tags & Filters
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

  // ✏️ CRUD
  function upsertCard(payload: UpsertPayload): void {
    if (payload.id) {
      setCards((s) => s.map((c) => (c.id === payload.id ? { ...c, ...payload } : c)));
    } else {
      const newCard: ContextCard = {
        id: crypto.randomUUID(),
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
  }

  function exportJSON(): void {
    const payload = JSON.stringify(cards, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `context-cards-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(href);
  }

  function importJSON(file: File | null): void {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "[]")) as ContextCard[];
        const byId = new Map(cards.map((c) => [c.id, c]));
        parsed.forEach((p) => byId.set(p.id, p));
        setCards(Array.from(byId.values()));
      } catch {
        alert("Failed to import — invalid JSON");
      }
    };
    reader.readAsText(file);
  }

  // 🧰 Modal
  function EditorModal({ card, onClose }: { card?: ContextCard | null; onClose: () => void }) {
    const [title, setTitle] = useState(card?.title || "");
    const [description, setDescription] = useState(card?.description || "");
    const [tagsInput, setTagsInput] = useState((card?.tags || []).join(", "));

    function save() {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      upsertCard({ id: card?.id, title: title || "Untitled", description, tags });
      onClose();
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="relative z-10 w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{card ? "Edit Card" : "New Card"}</h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3"
          />
          <input
            placeholder="Tags (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="border px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button onClick={save} className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white px-4 py-2 rounded-lg">
              Save
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------
  // 🎨 UI
  // ----------------------
  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="w-px h-6 bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">🧩 Context Cards</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <SelectionToContext
          onAdd={(selectedText: string) => {
            setEditingCard({
              id: "",
              title: "Captured Highlight",
              description: selectedText,
              tags: ["highlight"],
              createdAt: new Date().toISOString(),
            });
            setShowEditor(true);
          }}
        />

        {/* Search + Actions */}
        <Card className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center bg-white border rounded-lg px-3 py-2 w-full md:w-2/3">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCard(null);
                    setShowEditor(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add Card
                </button>
                <button onClick={exportJSON} className="px-4 py-2 rounded-lg border bg-white text-gray-700">
                  <Download className="w-4 h-4 inline mr-1" /> Export
                </button>
                <label className="px-4 py-2 rounded-lg border bg-white text-gray-700 cursor-pointer">
                  <Upload className="w-4 h-4 inline mr-1" /> Import
                  <input type="file" accept="application/json" className="hidden" onChange={(e) => importJSON(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor Modal */}
        <AnimatePresence>
          {showEditor && <EditorModal card={editingCard} onClose={() => setShowEditor(false)} />}
        </AnimatePresence>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filtered.map((c) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-3">{c.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(c.tags || []).map((t) => (
                      <span key={t} className="text-xs border rounded-full px-2 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setEditingCard(c)} className="text-sm border px-2 py-1 rounded">
                    ✏️
                  </button>
                  <button onClick={() => removeCard(c.id)} className="text-sm border px-2 py-1 rounded">
                    🗑️
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No context cards found</h3>
            <p className="text-gray-600">Create your first card to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
