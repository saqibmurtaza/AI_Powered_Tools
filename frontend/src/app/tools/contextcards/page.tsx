"use client";

import SelectionToContext from '@/components/toolwiz/SelectionToContext';
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ContextCard = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt?: string;
};

export default function ContextCardsPage() {
  // --- state (no localStorage reads during SSR) ---
  const [cards, setCards] = useState<ContextCard[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingCard, setEditingCard] = useState<ContextCard | null>(null);

  // --- load saved cards after mount (client only) ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem("context-cards");
      if (raw) setCards(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load context-cards", e);
    }
  }, []);

  // --- persist cards ---
  useEffect(() => {
    try {
      localStorage.setItem("context-cards", JSON.stringify(cards));
    } catch (e) {
      console.warn("Failed to save context-cards", e);
    }
  }, [cards]);

  // Derived tags
  const tags = useMemo(() => {
    const s = new Set<string>();
    cards.forEach((c) => (c.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [cards]);

  // Filtered cards for display
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

  // CRUD helpers
  function upsertCard(payload: Omit<ContextCard, "id" | "createdAt"> & { id?: string }) {
    if (payload.id) {
      // update existing
      setCards((s) => s.map((c) => (c.id === payload.id ? { ...c, ...payload } as ContextCard : c)));
    } else {
      // create new
      const newCard: ContextCard = {
        id: typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Date.now().toString(),
        createdAt: new Date().toISOString(),
        title: payload.title,
        description: payload.description,
        tags: payload.tags || [],
      };
      setCards((s) => [newCard, ...s]);
    }
  }

  function removeCard(id: string) {
    if (!confirm("Delete this card?")) return;
    setCards((s) => s.filter((c) => c.id !== id));
  }

  function exportJSON() {
    const payload = JSON.stringify(cards, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `context-cards-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(href);
  }

  function importJSON(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "[]")) as ContextCard[];
        // merge by id
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

  // Editor open for new card
  function openNewCardEditor() {
    setEditingCard(null);
    setShowEditor(true);
  }

  // Editor open for edit
  function openEditCardEditor(card: ContextCard) {
    setEditingCard(card);
    setShowEditor(true);
  }

  // --- Editor component (modal) ---
  function EditorModal({ card, onClose }: { card?: ContextCard | null; onClose: () => void }) {
    const isNew = !card;
    const [title, setTitle] = useState(card?.title || "");
    const [description, setDescription] = useState(card?.description || "");
    const [tagsInput, setTagsInput] = useState((card?.tags || []).join(", "));

    function save() {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      upsertCard({
        id: card?.id,
        title: title || "Untitled",
        description: description || "",
        tags,
      });
      onClose();
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.995 }}
          className="relative z-10 w-full max-w-2xl bg-[#0f1724] border border-white/6 rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{isNew ? "New Context Card" : "Edit Context Card"}</h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-white/6">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#061021] border border-white/6 rounded-md px-3 py-2 outline-none"
            />
            <textarea
              placeholder="Description / context"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-[#061021] border border-white/6 rounded-md px-3 py-2 outline-none resize-none"
            />

            <input
              placeholder="tags — comma separated"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#061021] border border-white/6 rounded-md px-3 py-2 outline-none"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-md border bg-transparent hover:bg-white/6"
              >
                Cancel
              </button>
              <button onClick={save} className="px-3 py-1 rounded-md bg-violet-600 hover:bg-violet-700">
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- UI ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white py-12">
      <SelectionToContext
  onAdd={(selectedText) => {
    // open the existing editor modal and prefill values
    setEditingCard({
      id: '', // new card (no id) indicates new in upsert flow
      title: 'Captured Highlight',
      description: selectedText,
      tags: ['highlight'],
      createdAt: new Date().toISOString(),
    });
    setShowEditor(true);
  }}
/>
      <div className="max-w-7xl mx-auto px-6">
        <SelectionToContext
  onAdd={(selectedText) => {
    // open the existing editor modal and prefill values
    setEditingCard({
      id: '', // new card (no id) indicates new in upsert flow
      title: 'Captured Highlight',
      description: selectedText,
      tags: ['highlight'],
      createdAt: new Date().toISOString(),
    });
    setShowEditor(true);
  }}
/>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          ToolWiz — Context Cards
        </h1>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl mb-8">
          <CardContent className="p-6">
            {/* Toolbar row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-2/3">
                <div className="flex items-center bg-white/6 rounded-full px-3 py-2 w-full">
                  <span className="opacity-70 mr-2"><SearchIcon /></span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search title, description, tags..."
                    className="flex-1 bg-transparent outline-none placeholder:text-white/60"
                  />
                </div>
              </div>

              <div className="flex gap-2 items-center justify-end">
                <button
                  onClick={openNewCardEditor}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-violet-600 hover:bg-violet-700"
                >
                  <PlusIcon /> Add
                </button>

                <button
                  onClick={exportJSONButton}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/2"
                >
                  <DownloadIcon /> Export
                </button>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/2 cursor-pointer">
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
                  />
                  <UploadIcon /> Import
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 opacity-80">
                <TagIcon />
                <span className="text-sm">Tags</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full border ${selectedTag === null ? "bg-white/8" : "bg-transparent"}`}
                >
                  All
                </button>
                {tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTag((s) => (s === t ? null : t))}
                    className={`px-3 py-1 rounded-full border ${selectedTag === t ? "bg-white/8" : "bg-transparent"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor modal */}
        <AnimatePresence>{showEditor && <EditorModal card={editingCard || undefined} onClose={() => { setShowEditor(false); setEditingCard(null); }} />}</AnimatePresence>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <motion.article
              key={c.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl p-4 shadow-md border bg-white/4 bg-opacity-6 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center bg-white/12">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                  </div>

                  <p className="mt-2 text-sm opacity-80 line-clamp-3">{c.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(c.tags || []).length > 0 ? (
                      (c.tags || []).map((t) => (
                        <span key={t} className="px-2 py-1 rounded-full text-xs border bg-white/6 text-white/80">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-white/60">No tags</span>
                    )}
                  </div>

                  <div className="mt-3 text-xs opacity-60">Created: {new Date(c.createdAt ?? "").toLocaleString()}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    title="Edit"
                    onClick={() => {
                      setEditingCard(c);
                      setShowEditor(true);
                    }}
                    className="p-2 rounded-lg border bg-white/4 text-white"
                  >
                    <EditIcon />
                  </button>

                  <button
                    title="Delete"
                    onClick={() => {
                      if (confirm("Delete this card?")) removeCard(c.id);
                    }}
                    className="p-2 rounded-lg border bg-white/4 text-white"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 text-center opacity-80 text-white">
            No context cards match your search — create one to get started.
          </div>
        )}

        <div className="mt-6 text-right text-sm opacity-70 text-white">Tech-savvy, extendable, and ready to integrate.</div>
      </div>
    </main>
  );

  // -------------------------
  // small inline icon components (keeps imports compact and avoids missing-icon issues)
  // -------------------------
  function SearchIcon() {
    return <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="white" strokeWidth="1.5" /></svg>;
  }
  function PlusIcon() { return <Plus className="w-4 h-4" />; }
  function DownloadIcon() { return <Download className="w-4 h-4" />; }
  function UploadIcon() { return <Upload className="w-4 h-4" />; }
  function TagIcon() { return <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none"><path d="M20 10v6a2 2 0 0 1-2 2h-6l-8-8 6-6 8 8z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
  function EditIcon() { return <EditIconInner />; }
  function TrashIcon() { return <TrashIconInner />; }

  // small wrappers for icons (local to avoid extra imports miss)
  function EditIconInner() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 21v-3.6L14.6 5.8l3.6 3.6L6.6 21H3z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
  function TrashIconInner() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6v13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6M10 4h4l1 2H9l1-2z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

  // small wrappers to call existing functions from within JSX
  function exportJSONButton() { exportJSON(); }
  function exportJSONInner() { exportJSON(); }

  // adaptors to avoid naming collisions used above
  function importJSONInner(file: File | null) { importJSON(file); }
}
