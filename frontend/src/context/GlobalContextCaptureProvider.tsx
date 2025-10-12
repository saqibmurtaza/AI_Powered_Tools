'use client';
import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';

type GlobalContextType = {
  selection: string | null;
  selectionPosition: { x: number; y: number } | null;
  saveSelection: (text: string) => void;
  addToContextHandler: ((text: string) => void) | null;
  triggerAddToContext: (handler: (text: string) => void) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  return context;
};

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<string | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [addToContextHandler, setAddToContextHandler] = useState<((text: string) => void) | null>(null);

  const saveSelection = useCallback((text: string) => {
    setSelection(text);
    const sel = window.getSelection();
    const range = sel?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    if (rect) {
      setSelectionPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY - 40 });
    } else {
      setSelectionPosition(null);
    }
  }, []);

  const triggerAddToContext = useCallback((handler: (text: string) => void) => {
    setAddToContextHandler(() => handler);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        selection,
        selectionPosition,
        saveSelection,
        addToContextHandler,
        triggerAddToContext,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
