import { useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContextCaptureProvider';

export const useTextSelection = () => {
  const { saveSelection } = useGlobalContext();

  useEffect(() => {
    const handleMouseUp = () => {
      const text = window.getSelection()?.toString().trim();
      if (text && text.length > 0) {
        saveSelection(text);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [saveSelection]);

  return null;
};
