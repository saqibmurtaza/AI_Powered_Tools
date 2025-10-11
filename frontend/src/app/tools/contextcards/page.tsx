'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Download, Upload, Tag as TagIcon, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Self-contained context-card page.
// - Does NOT rely on any global capture/provider.
// - Persists to localStorage.
// - Search, tag filter, add/import/export, edit/delete.

type ContextCard = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
};

export default function ContextCardsPage() {
  const [cards, setCards] = useState<ContextCard[]>(() => {
    try {
      const raw = localStorage.getItem('context-cards');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persist cards
  useEffect(() => {
    try {
      localStorage.setItem('context-cards', JSON.stringify(cards));
    } catch (e) {
      console.warn('Failed to save context-cards', e);
    }
  }, [cards]);

  const [query, setQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editing, setEditing] = useState<ContextCard | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // derived tags
  const tags = useMemo(() => {
    const s = new Set<string>();
    cards.forEach((c) => (c.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [cards]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (selectedTag && !(c.tags || []).includes(selectedTag)) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.tags || []).join(' ').toLowerCase().includes(q)
      );
    });
  }, [cards, query, selectedTag]);

  function addCard(payload?: Partial<ContextCard>) {
    const card: ContextCard = {
      id: Date.now().toString(),
      title: payload?.title || 'Untitled',
      description: payload?.description || '',
      tags: payload?.tags || [],
      createdAt: new Date().toISOString(),
    };
    setCards((s) => [card, ...s]);
  }

  function updateCard(id: string, patch: Partial<ContextCard>) {
    setCards((s) => s.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCard(id: string) {
    if (!confirm('Delete this card?')) return;
    setCards((s) => s.filter((c) => c.id !== id));
  }

  function exportJSON() {
    const payload = JSON.stringify(cards, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
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
        const parsed = JSON.parse(String(reader.result || '[]')) as ContextCard[];
        // merge but prefer incoming
        const byId = new Map(cards.map((c) => [c.id, c]));
        parsed.forEach((p) => byId.set(p.id, p));
        setCards(Array.from(byId.values()));
      } catch (e) {
        console.error('Invalid JSON import', e);
        alert('Failed to import — invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  // Simple editor component (inline)
  function Editor({ card }: { card?: ContextCard | null }) {
    const isNew = !card;
    const [title, setTitle] = useState(card?.title || '');
    const [description, setDescription] = useState(card?.description || '');
    const [tagsInput, setTagsInput] = useState((card?.tags || []).join(', '));

    function save() {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (isNew) {
        addCard({ title, description, tags });
      } else if (card) {
        updateCard(card.id, { title, description, tags });
      }
      setShowEditor(false);
      setEditing(null);
    }

    return (
      <div className="w-full max-w-2xl mx-auto p-4 bg-white/6 backdrop-blur rounded-2xl shadow-lg border border-white/6">
        <div className="flex items-center gap-3 mb-3">
          <input
            autoFocus
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Card title"
            className="flex-1 bg-transparent outline-none text-lg font-semibold text-white"
          />
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 rounded-lg border bg-white/4 text-white"
              onClick={() => {
                setShowEditor(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
            <button className="px-3 py-1 rounded-lg bg-violet-600 text-white" onClick={save}>
              Save
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Description / context"
          className="w-full bg-transparent outline-none resize-none mb-3 text-white"
        />

        <div className="flex gap-3 items-center">
          <input
            value={tagsInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value)}
            placeholder="tags — comma separated"
            className="flex-1 bg-transparent outline-none text-white"
          />

          <select
            value={''}
            onChange={() => {}}
            className="bg-transparent text-white"
            aria-hidden
            style={{ display: 'none' }}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          ToolWiz — Context Cards
        </h1>

        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex items-center gap-2 bg-white/6 rounded-full px-3 py-1 w-full max-w-lg">
              <Search className="w-4 h-4 opacity-80" />
              <input
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder="Search title, description, tags..."
                className="bg-transparent outline-none w-full text-white"
              />
            </div>

            <div className="flex gap-2 items-center">
              <button
                aria-label="Add card"
                title="Add card"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/6 text-white"
                onClick={() => {
                  setEditing(null);
                  setShowEditor(true);
                }}
              >
                <Plus className="w-5 h-5" />
                Add
              </button>

              <button
                aria-label="Export"
                title="Export JSON"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/6 text-white"
                onClick={exportJSON}
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/6 cursor-pointer text-white">
                <input
                  aria-label="Import JSON"
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => importJSON(e.target.files?.[0] ?? null)}
                />
                <Upload className="w-4 h-4" />
                Import
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-80">Tags</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full border ${selectedTag === null ? 'bg-white/8' : 'bg-transparent'} text-white`}
              >
                All
              </button>
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag((s) => (s === t ? null : t))}
                  className={`px-3 py-1 rounded-full border ${selectedTag === t ? 'bg-white/8' : 'bg-transparent'} text-white`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showEditor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4">
            <Editor card={editing} />
          </motion.div>
        )}

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
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-white">
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

                  <div className="mt-3 text-xs opacity-60">Created: {new Date(c.createdAt).toLocaleString()}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col gap-2">
                    <button
                      title="Edit"
                      onClick={() => {
                        setEditing(c);
                        setShowEditor(true);
                      }}
                      className="p-2 rounded-lg border bg-white/4 text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      title="Delete"
                      onClick={() => removeCard(c.id)}
                      className="p-2 rounded-lg border bg-white/4 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
}

