'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, Download, Trash2, Edit3, Tag } from 'lucide-react';

// ContextCards
// A compact, production-ready React component (single-file) implementing a
// "Context Cards" tool suited for a tech-savvy product UI.
// - TailwindCSS utility classes for styling
// - Framer Motion for smooth micro-interactions
// - lucide-react for crisp icons
// - Features: add/edit/delete cards, search/filter by tag, drag handle (visual),
//   export/import JSON, keyboard accessible controls

export type ContextCard = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  color?: string; // tailwind hue or custom
  createdAt: string;
};

type Props = {
  initial?: ContextCard[];
  onChange?: (cards: ContextCard[]) => void;
};

export default function ContextCards({ initial = [], onChange }: Props) {
  const [cards, setCards] = useState<ContextCard[]>(() => {
    // dedupe incoming
    const map = new Map<string, ContextCard>();
    initial.forEach((c) => map.set(c.id, c));
    return Array.from(map.values());
  });

  // load from localStorage on mount
useEffect(() => {
  try {
    const saved = localStorage.getItem('context-cards');
    if (saved) {
      setCards(JSON.parse(saved) as ContextCard[]);
    }
  } catch (err) {
    // fail safe — don't block the UI
    console.warn('Failed to load context-cards from localStorage', err);
  }
}, []);

// persist to localStorage whenever cards change
useEffect(() => {
  try {
    localStorage.setItem('context-cards', JSON.stringify(cards));
  } catch (err) {
    console.warn('Failed to save context-cards to localStorage', err);
  }
}, [cards]);

  const [query, setQuery] = useState('');
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

  function pushAndNotify(newCards: ContextCard[]) {
    setCards(newCards);
    onChange?.(newCards);
  }

  function addCard(payload: Partial<ContextCard>) {
    const card: ContextCard = {
      id: (Math.random() + 1).toString(36).substring(2, 9),
      title: payload.title || 'Untitled',
      description: payload.description || '',
      tags: payload.tags || [],
      color: payload.color || 'bg-slate-700',
      createdAt: new Date().toISOString(),
    };
    pushAndNotify([card, ...cards]);
  }

  function updateCard(id: string, patch: Partial<ContextCard>) {
    const updated = cards.map((c) => (c.id === id ? { ...c, ...patch } : c));
    pushAndNotify(updated);
  }

  function removeCard(id: string) {
    const updated = cards.filter((c) => c.id !== id);
    pushAndNotify(updated);
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
        pushAndNotify(Array.from(byId.values()));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Invalid JSON import', e);
        alert('Failed to import — invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  // Small Editor inner component
  function Editor({ card }: { card?: ContextCard | null }) {
    const isNew = !card;
    const [title, setTitle] = useState(card?.title || '');
    const [description, setDescription] = useState(card?.description || '');
    const [tagsInput, setTagsInput] = useState((card?.tags || []).join(', '));
    const [color, setColor] = useState(card?.color || 'bg-slate-700');

    function save() {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (isNew) {
        addCard({ title, description, tags, color });
      } else if (card) {
        updateCard(card.id, { title, description, tags, color });
      }
      setShowEditor(false);
      setEditing(null);
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="w-full max-w-2xl mx-auto p-4 bg-white/6 backdrop-blur rounded-2xl shadow-lg border border-white/6"
      >
        <div className="flex items-center gap-3 mb-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            className="flex-1 bg-transparent outline-none text-lg font-semibold"
          />
          <div className="flex gap-2 items-center">
            <button
              className="btn px-3 py-1 rounded-lg border"
              onClick={() => {
                setShowEditor(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
            <button className="btn px-3 py-1 rounded-lg bg-white/6" onClick={save}>
              Save
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description / context"
          className="w-full bg-transparent outline-none resize-none mb-3"
        />

        <div className="flex gap-3 items-center">
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tags — comma separated"
            className="flex-1 bg-transparent outline-none"
          />

          <select value={color} onChange={(e) => setColor(e.target.value)} className="bg-transparent">
            <option value="bg-slate-700">Slate</option>
            <option value="bg-emerald-600">Emerald</option>
            <option value="bg-rose-600">Rose</option>
            <option value="bg-amber-600">Amber</option>
            <option value="bg-violet-600">Violet</option>
          </select>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold">Context Cards</h2>

        <div className="flex items-center gap-2">
          <label className="relative flex items-center gap-2 bg-white/6 rounded-full px-3 py-1">
            <Search className="w-4 h-4 opacity-80" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, description, tags..."
              className="bg-transparent outline-none w-64"
            />
          </label>

          <div className="flex gap-2 items-center">
            <button
              aria-label="Add card"
              title="Add card"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/6"
              onClick={() => {
                setEditing(null);
                setShowEditor(true);
              }}
            >
              <PlusCircle className="w-5 h-5" />
              Add
            </button>

            <button
              aria-label="Export"
              title="Export JSON"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/6"
              onClick={exportJSON}
            >
              <Download className="w-4 h-4" />
            </button>

            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/6 cursor-pointer">
              <input
                aria-label="Import JSON"
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
              />
              Import
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 opacity-80" />
          <span className="text-sm opacity-80">Tags</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full border ${selectedTag === null ? 'bg-white/8' : 'bg-transparent'}`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag((s) => (s === t ? null : t))}
              className={`px-3 py-1 rounded-full border ${selectedTag === t ? 'bg-white/8' : 'bg-transparent'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4"
          >
            <Editor card={editing} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <motion.article
            key={c.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`rounded-2xl p-4 shadow-md border ${c.color} bg-opacity-10 backdrop-blur`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center bg-white/12">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                  </div>
                </div>

                <p className="mt-2 text-sm opacity-80 line-clamp-3">{c.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(c.tags || []).map((t) => (
                    <span key={t} className="px-2 py-1 rounded-full text-xs border bg-white/4">
                      {t}
                    </span>
                  ))}
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
                    className="p-2 rounded-lg border bg-white/4"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    title="Delete"
                    onClick={() => {
                      if (confirm('Delete this card?')) removeCard(c.id);
                    }}
                    className="p-2 rounded-lg border bg-white/4"
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
        <div className="mt-8 text-center opacity-80">No context cards match your search — create one to get started.</div>
      )}

      <div className="mt-6 text-right text-sm opacity-70">Tech-savvy, extendable, and ready to integrate.</div>
    </div>
  );
}
