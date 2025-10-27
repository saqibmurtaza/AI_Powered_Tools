// // frontend/src/app/tools/contextcards/page.tsx
// "use client";

// import SelectionToContext from "@/components/toolwiz/SelectionToContext";
// import React, { useEffect, useMemo, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Plus, Upload, Download, X, Search, Tag, FileText, Calendar, Zap } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// // ... (keep all the type definitions and interfaces the same)
// // ----------------------
// // 🧠 Type Definitions
// // ----------------------
// interface ContextCard {
//   id: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdAt?: string;
// }

// type UpsertPayload = Omit<ContextCard, "id" | "createdAt"> & { id?: string };

// // Chrome storage types
// interface ChromeStorageChange {
//   newValue?: ContextCard[];
//   oldValue?: ContextCard[];
// }

// interface ChromeStorageArea {
//   get: (keys: string[], callback: (result: { [key: string]: unknown }) => void) => void;
// }

// interface ChromeStorage {
//   local: ChromeStorageArea;
//   onChanged: {
//     addListener: (callback: (changes: { [key: string]: ChromeStorageChange }) => void) => void;
//   };
// }

// interface ExtendedWindow extends Window {
//   chrome?: {
//     storage: ChromeStorage;
//   };
// }

// export default function ContextCardsPage(): JSX.Element {

//   const [cards, setCards] = useState<ContextCard[]>([]);
//     const [search, setSearch] = useState("");
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
//     const [showEditor, setShowEditor] = useState(false);
//     const [editingCard, setEditingCard] = useState<ContextCard | null>(null);

//   const features = [
//     {
//       icon: <FileText className="w-6 h-6" />,
//       title: "Smart Organization",
//       description: "Organize your thoughts, research, and ideas with customizable tags and categories."
//     },
//     {
//       icon: <Zap className="w-6 h-6" />,
//       title: "Quick Capture",
//       description: "Instantly capture text from any webpage using our browser extension integration."
//     },
//     {
//       icon: <Tag className="w-6 h-6" />,
//       title: "Flexible Tagging",
//       description: "Categorize your cards with custom tags for easy filtering and retrieval."
//     },
//     {
//       icon: <Calendar className="w-6 h-6" />,
//       title: "Auto-Save",
//       description: "Your cards are automatically saved locally and sync with browser storage."
//     }
//   ];

//   const benefits = [
//     {
//       title: "For Research",
//       items: ["Capture research notes", "Organize sources", "Track key findings"]
//     },
//     {
//       title: "For Learning", 
//       items: ["Create study notes", "Summarize articles", "Build knowledge base"]
//     },
//     {
//       title: "For Productivity",
//       items: ["Track project ideas", "Manage tasks", "Store important information"]
//     }
//   ];

//   // ... (keep all the existing useEffect, useMemo, and CRUD functions exactly the same)

//   // ... (keep the EditorModal component exactly the same)
//     // ----------------------
//     // 📦 Load from storage
//     // ----------------------
//     useEffect(() => {
//       let mounted = true;
  
//       async function loadCards() {
//         try {
//           const extendedWindow = window as ExtendedWindow;
//           if (
//             typeof window !== "undefined" &&
//             typeof extendedWindow.chrome !== "undefined" &&
//             extendedWindow.chrome?.storage?.local
//           ) {
//             // ✅ Read from extension storage
//             extendedWindow.chrome.storage.local.get(
//               ["contextCards"],
//               (res: { contextCards?: ContextCard[] }) => {
//                 if (!mounted) return;
//                 const fromExt = Array.isArray(res?.contextCards)
//                   ? res.contextCards
//                   : [];
  
//                 if (fromExt.length > 0) {
//                   try {
//                     const rawLocal = localStorage.getItem("context-cards");
//                     const local = rawLocal
//                       ? (JSON.parse(rawLocal) as ContextCard[])
//                       : [];
//                     const byId = new Map<string, ContextCard>();
//                     [...fromExt, ...local].forEach((c) =>
//                       byId.set(String(c.id), c)
//                     );
//                     const merged = Array.from(byId.values());
//                     setCards(merged);
//                     localStorage.setItem("context-cards", JSON.stringify(merged));
//                   } catch (e) {
//                     console.warn(
//                       "Failed merging extension + local storage",
//                       e
//                     );
//                     setCards(fromExt);
//                   }
//                 } else {
//                   const raw = localStorage.getItem("context-cards");
//                   if (raw) setCards(JSON.parse(raw));
//                 }
//               }
//             );
  
//             // ✅ Subscribe to extension updates
//             try {
//               extendedWindow.chrome.storage.onChanged.addListener(
//                 (
//                   changes: { [key: string]: ChromeStorageChange }
//                 ): void => {
//                   if (!mounted) return;
//                   if (changes.contextCards?.newValue) {
//                     const newCards = Array.isArray(
//                       changes.contextCards.newValue
//                     )
//                       ? changes.contextCards.newValue
//                       : [];
//                     setCards((prev) => {
//                       const byId = new Map<string, ContextCard>();
//                       [...newCards, ...prev].forEach((c) =>
//                         byId.set(String(c.id), c)
//                       );
//                       const merged = Array.from(byId.values());
//                       try {
//                         localStorage.setItem(
//                           "context-cards",
//                           JSON.stringify(merged)
//                         );
//                       } catch {}
//                       return merged;
//                     });
//                   }
//                 }
//               );
//             } catch {
//               // ignore if listener not supported
//             }
  
//             return;
//           }
//         } catch (e) {
//           console.warn("chrome.storage access failed, falling back to localStorage", e);
//         }
  
//         // ❌ fallback: localStorage only
//         try {
//           const raw = localStorage.getItem("context-cards");
//           if (raw) setCards(JSON.parse(raw));
//         } catch (e) {
//           console.warn("Failed to load context-cards from localStorage", e);
//         }
//       }
  
//       loadCards();
//       return () => {
//         mounted = false;
//       };
//     }, []);
  
//     // ----------------------
//     // 💾 Persist locally
//     // ----------------------
//     useEffect(() => {
//       try {
//         localStorage.setItem("context-cards", JSON.stringify(cards));
//       } catch (e) {
//         console.warn("Failed to save context-cards", e);
//       }
//     }, [cards]);
  
//     // ----------------------
//     // 🏷️ Tags & Filters
//     // ----------------------
//     const tags = useMemo(() => {
//       const s = new Set<string>();
//       cards.forEach((c) => (c.tags || []).forEach((t) => s.add(t)));
//       return Array.from(s).sort();
//     }, [cards]);
  
//     const filtered = useMemo(() => {
//       const q = search.trim().toLowerCase();
//       return cards.filter((c) => {
//         if (selectedTag && !(c.tags || []).includes(selectedTag)) return false;
//         if (!q) return true;
//         return (
//           c.title.toLowerCase().includes(q) ||
//           (c.description || "").toLowerCase().includes(q) ||
//           (c.tags || []).join(" ").toLowerCase().includes(q)
//         );
//       });
//     }, [cards, search, selectedTag]);
  
//     // ----------------------
//     // ✏️ CRUD Helpers
//     // ----------------------
//     function upsertCard(payload: UpsertPayload): void {
//       if (payload.id) {
//         setCards((s) =>
//           s.map((c) =>
//             c.id === payload.id ? { ...c, ...payload } : c
//           )
//         );
//       } else {
//         const newCard: ContextCard = {
//           id:
//             (window.crypto as Crypto).randomUUID?.() ??
//             Date.now().toString(),
//           createdAt: new Date().toISOString(),
//           title: payload.title,
//           description: payload.description,
//           tags: payload.tags || [],
//         };
//         setCards((s) => [newCard, ...s]);
//       }
//     }
  
//     function removeCard(id: string): void {
//       if (!confirm("Delete this card?")) return;
//       setCards((s) => s.filter((c) => c.id !== id));
//     }
  
//     function exportJSON(): void {
//       const payload = JSON.stringify(cards, null, 2);
//       const blob = new Blob([payload], { type: "application/json" });
//       const href = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = href;
//       a.download = `context-cards-${new Date().toISOString()}.json`;
//       a.click();
//       URL.revokeObjectURL(href);
//     }
  
//     function importJSON(file: File | null): void {
//       if (!file) return;
//       const reader = new FileReader();
//       reader.onload = () => {
//         try {
//           const parsed = JSON.parse(String(reader.result || "[]")) as ContextCard[];
//           const byId = new Map(cards.map((c) => [c.id, c]));
//           parsed.forEach((p) => byId.set(p.id, p));
//           setCards(Array.from(byId.values()));
//         } catch (e) {
//           console.error("Invalid JSON import", e);
//           alert("Failed to import — invalid JSON");
//         }
//       };
//       reader.readAsText(file);
//     }
  
//     // ----------------------
//     // 🧰 Editor Modal
//     // ----------------------
//     function openEditCardEditor(card: ContextCard): void {
//       setEditingCard(card);
//       setShowEditor(true);
//     }
  
//     function EditorModal({
//       card,
//       onClose,
//     }: {
//       card?: ContextCard | null;
//       onClose: () => void;
//     }): JSX.Element {
//       const isNew = !card;
//       const [title, setTitle] = useState(card?.title || "");
//       const [description, setDescription] = useState(card?.description || "");
//       const [tagsInput, setTagsInput] = useState((card?.tags || []).join(", "));
  
//       function save(): void {
//         const tags = tagsInput
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean);
//         upsertCard({
//           id: card?.id,
//           title: title || "Untitled",
//           description: description || "",
//           tags,
//         });
//         onClose();
//       }
  
//       return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={onClose}
//           />
//           <motion.div
//             initial={{ opacity: 0, y: 8, scale: 0.995 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 8, scale: 0.995 }}
//             className="relative z-10 w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-6"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {isNew ? "New Context Card" : "Edit Context Card"}
//               </h3>
//               <button 
//                 onClick={onClose} 
//                 className="p-1 rounded-md hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
  
//             <div className="space-y-4">
//               <input
//                 placeholder="Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//               <textarea
//                 placeholder="Description / context"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={5}
//                 className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//               <input
//                 placeholder="Tags — comma separated"
//                 value={tagsInput}
//                 onChange={(e) => setTagsInput(e.target.value)}
//                 className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
  
//               <div className="flex justify-end gap-3 mt-4">
//                 <button
//                   onClick={onClose}
//                   className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={save}
//                   className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
//                 >
//                   Save Card
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       );
//     }
  
//     // ----------------------
//     // 🎨 UI
//     // ----------------------

//   return (
//     <div className="min-h-screen bg-white font-poppins">
//       {/* Header */}
//       <header className="border-b">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/"
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Tools
//             </Link>
//             <div className="w-px h-6 bg-gray-300"></div>
//             <span className="text-2xl">🧩</span>
//             <h1 className="text-2xl font-bold text-gray-900">Context Cards</h1>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-12">
//         {/* Hero Section */}
//         <div className="text-center mb-12">
//           <div className="text-6xl mb-4">🧩</div>
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Context Cards</h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             AI-powered contextual note cards for enhanced productivity and organization
//           </p>
//         </div>

//         {/* Main Tool Section */}
//         <div className="mb-12">
//           <SelectionToContext
//             onAdd={(selectedText: string) => {
//               setEditingCard({
//                 id: "",
//                 title: "Captured Highlight",
//                 description: selectedText,
//                 tags: ["highlight"],
//                 createdAt: new Date().toISOString(),
//               });
//               setShowEditor(true);
//             }}
//           />

//           {/* 🔍 Search + Actions */}
//           <Card className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm mb-8">
//             <CardContent className="p-6">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="flex items-center gap-3 w-full md:w-2/3">
//                   <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 w-full">
//                     <Search className="w-4 h-4 text-gray-400 mr-2" />
//                     <input
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       placeholder="Search title, description, tags..."
//                       className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-2 items-center justify-end">
//                   <button
//                     onClick={() => {
//                       setEditingCard(null);
//                       setShowEditor(true);
//                     }}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
//                   >
//                     <Plus className="w-4 h-4" /> Add Card
//                   </button>

//                   <button
//                     onClick={exportJSON}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <Download className="w-4 h-4" /> Export
//                   </button>

//                   <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//                     <input
//                       type="file"
//                       accept="application/json"
//                       className="hidden"
//                       onChange={(e) =>
//                         importJSON(e.target.files?.[0] ?? null)
//                       }
//                     />
//                     <Upload className="w-4 h-4" /> Import
//                   </label>
//                 </div>
//               </div>

//               {/* 🏷️ Tags */}
//               <div className="mt-4 flex items-center gap-3">
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Tag className="w-4 h-4" />
//                   <span className="text-sm font-medium">Filter by Tags</span>
//                 </div>

//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={() => setSelectedTag(null)}
//                     className={`px-3 py-1 rounded-full border text-sm ${
//                       selectedTag === null 
//                         ? "bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white border-transparent" 
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                     } transition-colors`}
//                   >
//                     All
//                   </button>
//                   {tags.map((t) => (
//                     <button
//                       key={t}
//                       onClick={() =>
//                         setSelectedTag((s) => (s === t ? null : t))
//                       }
//                       className={`px-3 py-1 rounded-full border text-sm ${
//                         selectedTag === t 
//                           ? "bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white border-transparent" 
//                           : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                       } transition-colors`}
//                     >
//                       {t}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <AnimatePresence>
//             {showEditor && (
//               <EditorModal
//                 card={editingCard || undefined}
//                 onClose={() => {
//                   setShowEditor(false);
//                   setEditingCard(null);
//                 }}
//               />
//             )}
//           </AnimatePresence>

//           {/* 🗂️ Cards List */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             {filtered.map((c) => (
//               <motion.article
//                 key={c.id}
//                 layout
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 8 }}
//                 className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-10 h-10 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white">
//                         <FileText className="w-5 h-5" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
//                     </div>

//                     <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
//                       {c.description}
//                     </p>

//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {(c.tags || []).length > 0 ? (
//                         (c.tags || []).map((t) => (
//                           <span
//                             key={t}
//                             className="px-2 py-1 rounded-full text-xs border border-gray-300 bg-gray-50 text-gray-700"
//                           >
//                             {t}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-xs text-gray-500">No tags</span>
//                       )}
//                     </div>

//                     <div className="text-xs text-gray-500">
//                       Created: {new Date(c.createdAt ?? "").toLocaleDateString()}
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     <button
//                       title="Edit"
//                       onClick={() => openEditCardEditor(c)}
//                       className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
//                     >
//                       ✏️
//                     </button>

//                     <button
//                       title="Delete"
//                       onClick={() => removeCard(c.id)}
//                       className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
//                     >
//                       🗑️
//                     </button>
//                   </div>
//                 </div>
//               </motion.article>
//             ))}
//           </div>

//           {filtered.length === 0 && (
//             <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
//               <div className="text-4xl mb-4">📝</div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No context cards found</h3>
//               <p className="text-gray-600">Create your first card to get started with organized note-taking.</p>
//             </div>
//           )}
//         </div>

//         {/* Benefits Section - MOVED TO BOTTOM */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Features Card */}
//           <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Use Context Cards?</h2>
            
//             <div className="grid grid-cols-1 gap-6">
//               {features.map((feature, index) => (
//                 <div 
//                   key={index}
//                   className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white">
//                       {feature.icon}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                       <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Use Cases Card */}
//           <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfect For</h2>
            
//             <div className="space-y-6">
//               {benefits.map((benefit, index) => (
//                 <div 
//                   key={index}
//                   className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1"
//                 >
//                   <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
//                     <div className="w-2 h-2 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-full mr-3"></div>
//                     {benefit.title}
//                   </h3>
//                   <ul className="space-y-2">
//                     {benefit.items.map((item, itemIndex) => (
//                       <li key={itemIndex} className="flex items-start text-sm text-gray-600">
//                         <span className="text-[#7C3AED] mr-2">•</span>
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* How It Works Section */}
//         <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white mt-8">
//           <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
//             <div className="space-y-3">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">1</div>
//               <h3 className="font-semibold">Capture Text</h3>
//               <p className="text-white/80 text-sm">Select text on any webpage or create manually</p>
//             </div>
            
//             <div className="space-y-3">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">2</div>
//               <h3 className="font-semibold">Add Context</h3>
//               <p className="text-white/80 text-sm">Add title, description, and tags for organization</p>
//             </div>
            
//             <div className="space-y-3">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">3</div>
//               <h3 className="font-semibold">Organize</h3>
//               <p className="text-white/80 text-sm">Use tags and search to find cards instantly</p>
//             </div>
            
//             <div className="space-y-3">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">4</div>
//               <h3 className="font-semibold">Access Anywhere</h3>
//               <p className="text-white/80 text-sm">Your cards sync across browser and local storage</p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



"use client";

import React from "react";
import ContextCards from "@/components/toolwiz/ContextCards";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ContextCardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/tools"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
            <div className="w-px h-6 bg-gray-600"></div>
            <span className="text-2xl">📋</span>
            <h1 className="text-2xl font-bold text-white">Context Cards</h1>
          </div>
        </div>
      </header>
      
      <ContextCards />
    </div>
  );
}