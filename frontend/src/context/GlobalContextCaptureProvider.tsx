'use client';
import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';

type GlobalContextType = {
  selection: string | null;
  saveSelection: (text: string) => void;
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
  const [addToContextHandler, setAddToContextHandler] = useState<((text: string) => void) | null>(null);

  const saveSelection = useCallback((text: string) => {
    setSelection(text);
    if (addToContextHandler) {
      addToContextHandler(text);
    }
  }, [addToContextHandler]);

  const triggerAddToContext = useCallback((handler: (text: string) => void) => {
    setAddToContextHandler(() => handler);
  }, []);

  return (
    <GlobalContext.Provider value={{ selection, saveSelection, triggerAddToContext }}>
      {children}
    </GlobalContext.Provider>
  );
}
