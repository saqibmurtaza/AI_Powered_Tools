import { useEffect, useState } from 'react';
import { useContextCards } from '@/context/ContextCardsContext';

export const useTextSelection = () => {
  const [selection, setSelection] = useState<string | null>(null);
  const { addCard } = useContextCards();

  useEffect(() => {
    const handleMouseUp = () => {
      const text = window.getSelection()?.toString().trim();
      setSelection(text && text.length > 0 ? text : null);
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const saveSelection = () => {
    if (selection) {
      addCard({
        title: 'Captured Text',
        description: selection,
        tags: ['captured'],
      });
      setSelection(null);
    }
  };

  return { selection, saveSelection };
};
