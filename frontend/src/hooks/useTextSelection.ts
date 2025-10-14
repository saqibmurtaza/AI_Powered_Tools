import { useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContextCaptureProvider'; // Assuming this is the correct path


export const useTextSelection = () => {

  const { saveSelection } = useGlobalContext();

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      const text = window.getSelection()?.toString().trim();

      if (text && text.length > 0) {
        // Use the global saveSelection to update the context state with the selected text
        saveSelection(text);
      }
      
    };

    // Use 'mouseup' to capture the text after the selection is complete
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [saveSelection]);


  // For now, based on the provider, we assume the provider's saveSelection is the desired action.
  return {}; // Return an empty object as the primary utility is the side-effect now.
};