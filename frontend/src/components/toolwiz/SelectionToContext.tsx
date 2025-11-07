// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { isCardContextExtensionActive } from '@/utils/envCheck';

// type Props = {
//   onAdd: (text: string) => void;
//   minLength?: number;
//   offsetY?: number;
//   offsetX?: number;
// };

// export default function SelectionToContext({
//   onAdd,
//   minLength = 3,
//   offsetY = -44,
//   offsetX = 0,
// }: Props) {
//   const [visible, setVisible] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0 });
//   const [text, setText] = useState('');
//   const [extensionActive, setExtensionActive] = useState<boolean | null>(null);
//   const hideTimeout = useRef<number | null>(null);

//   // 1️⃣ Detect whether the CardContext Chrome extension is active
//   useEffect(() => {
//     if (typeof window === 'undefined') {
//       setExtensionActive(false);
//       return;
//     }

//     const checkNow = () => {
//       try {
//         const present = isCardContextExtensionActive();
//         setExtensionActive(present);
//         return present;
//       } catch {
//         setExtensionActive(false);
//         return false;
//       }
//     };

//     const presentNow = checkNow();
//     if (presentNow) return;

//     const t1 = window.setTimeout(checkNow, 250);
//     const t2 = window.setTimeout(checkNow, 1000);

//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//   }, []);

//   // 2️⃣ Attach selection listeners when extension is NOT active
//   useEffect(() => {
//     if (extensionActive === null || extensionActive === true) return;

//     const updateSelection = () => {
//       const sel = window.getSelection?.();
//       if (!sel) {
//         setVisible(false);
//         setText('');
//         return;
//       }

//       const str = sel.toString().trim();
//       if (!str || str.length < minLength) {
//         setVisible(false);
//         setText('');
//         return;
//       }

//       const range = sel.getRangeAt ? sel.getRangeAt(0) : null;
//       if (!range) return;

//       const rect = range.getBoundingClientRect();
//       if (!rect || (rect.width === 0 && rect.height === 0)) {
//         setVisible(false);
//         return;
//       }

//       const scrollY = window.scrollY ?? window.pageYOffset ?? 0;
//       const scrollX = window.scrollX ?? window.pageXOffset ?? 0;
//       const top = rect.top + scrollY + offsetY;
//       const left = rect.left + scrollX + rect.width + offsetX - 40;

//       setPosition({ top, left });
//       setText(str);
//       setVisible(true);

//       if (hideTimeout.current) {
//         window.clearTimeout(hideTimeout.current);
//         hideTimeout.current = null;
//       }
//     };

//     const onMouseUp = () => setTimeout(updateSelection, 10);
//     const onKeyUp = () => setTimeout(updateSelection, 10);
//     const onScrollOrResize = () => setVisible(false);
//     const onSelectionChange = () => {
//       const sel = window.getSelection?.();
//       if (!sel || !sel.toString()) {
//         setVisible(false);
//         setText('');
//       }
//     };

//     document.addEventListener('mouseup', onMouseUp);
//     document.addEventListener('keyup', onKeyUp);
//     document.addEventListener('selectionchange', onSelectionChange);
//     window.addEventListener('scroll', onScrollOrResize, true);
//     window.addEventListener('resize', onScrollOrResize);

//     return () => {
//       document.removeEventListener('mouseup', onMouseUp);
//       document.removeEventListener('keyup', onKeyUp);
//       document.removeEventListener('selectionchange', onSelectionChange);
//       window.removeEventListener('scroll', onScrollOrResize, true);
//       window.removeEventListener('resize', onScrollOrResize);
//       if (hideTimeout.current) {
//         window.clearTimeout(hideTimeout.current);
//         hideTimeout.current = null;
//       }
//     };
//   }, [minLength, offsetX, offsetY, extensionActive]);

//   // 3️⃣ Hide if extension becomes active later
//   useEffect(() => {
//     if (extensionActive === true) {
//       setVisible(false);
//       setText('');
//     }
//   }, [extensionActive]);

//   // const handleClick = () => {
//   //   if (!text) return;
//   //   try {
//   //     onAdd(text);
//   //   } catch (err) {
//   //     console.error('SelectionToContext onAdd error:', err);
//   //   }
//   //   const sel = window.getSelection?.();
//   //   sel?.removeAllRanges();
//   //   setVisible(false);
//   //   setText('');
//   // };

//   const handleClick = () => {
//   if (!text) return;
//   try {
//     // Use AI generation instead of direct add
//     onAdd(text);
//   } catch (err) {
//     console.error('SelectionToContext onAdd error:', err);
//   }
//   const sel = window.getSelection?.();
//   sel?.removeAllRanges();
//   setVisible(false);
//   setText('');
// };


//   // 4️⃣ Conditional rendering
//   if (extensionActive === null || extensionActive === true) return null;
//   if (!visible) return null;

//   return (
//     <div
//       role="dialog"
//       aria-label="Add selection to context"
//       style={{
//         position: 'absolute',
//         top: position.top,
//         left: position.left,
//         zIndex: 9999,
//         transform: 'translateY(-6px)',
//       }}
//     >
//       <button
//         onClick={handleClick}
//         className="flex items-center gap-2 rounded-full px-3 py-2 shadow-lg backdrop-blur bg-violet-600 hover:bg-violet-500 text-white text-sm transition"
//       >
//         <span className="text-lg leading-none">➕</span>
//         <span className="truncate max-w-[220px]">
//           {text.length > 60 ? `${text.slice(0, 57)}…` : text}
//         </span>
//       </button>
//     </div>
//   );
// }


'use client';

import React, { useEffect, useRef, useState } from 'react';
import { isCardContextExtensionActive } from '@/utils/envCheck';

type Props = {
  onAdd: (text: string) => void;
  minLength?: number;
  offsetY?: number;
  offsetX?: number;
};

export default function SelectionToContext({
  onAdd,
  minLength = 3,
  offsetY = -44,
  offsetX = 0,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [text, setText] = useState('');
  const [extensionActive, setExtensionActive] = useState<boolean | null>(null);
  const hideTimeout = useRef<number | null>(null);

  // 1️⃣ Detect whether the CardContext Chrome extension is active
  useEffect(() => {
    if (typeof window === 'undefined') {
      setExtensionActive(false);
      return;
    }

    const checkNow = () => {
      try {
        const present = isCardContextExtensionActive();
        setExtensionActive(present);
        return present;
      } catch {
        setExtensionActive(false);
        return false;
      }
    };

    const presentNow = checkNow();
    if (presentNow) return;

    const t1 = window.setTimeout(checkNow, 250);
    const t2 = window.setTimeout(checkNow, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 2️⃣ Attach selection listeners when extension is NOT active
  useEffect(() => {
    if (extensionActive === null || extensionActive === true) return;

    const updateSelection = () => {
      const sel = window.getSelection?.();
      if (!sel) {
        setVisible(false);
        setText('');
        return;
      }

      const str = sel.toString().trim();
      if (!str || str.length < minLength) {
        setVisible(false);
        setText('');
        return;
      }

      const range = sel.getRangeAt ? sel.getRangeAt(0) : null;
      if (!range) return;

      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setVisible(false);
        return;
      }

      const scrollY = window.scrollY ?? window.pageYOffset ?? 0;
      const scrollX = window.scrollX ?? window.pageXOffset ?? 0;
      const top = rect.top + scrollY + offsetY;
      const left = rect.left + scrollX + rect.width + offsetX - 40;

      setPosition({ top, left });
      setText(str);
      setVisible(true);

      if (hideTimeout.current) {
        window.clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    };

    const onMouseUp = () => setTimeout(updateSelection, 10);
    const onKeyUp = () => setTimeout(updateSelection, 10);
    const onScrollOrResize = () => setVisible(false);
    const onSelectionChange = () => {
      const sel = window.getSelection?.();
      if (!sel || !sel.toString()) {
        setVisible(false);
        setText('');
      }
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('selectionchange', onSelectionChange);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('selectionchange', onSelectionChange);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      if (hideTimeout.current) {
        window.clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    };
  }, [minLength, offsetX, offsetY, extensionActive]);

  // 3️⃣ Hide if extension becomes active later
  useEffect(() => {
    if (extensionActive === true) {
      setVisible(false);
      setText('');
    }
  }, [extensionActive]);

  const handleClick = () => {
    if (!text) return;
    try {
      // This now calls generateCardFromText via the onAdd prop
      onAdd(text);
    } catch (err) {
      console.error('SelectionToContext onAdd error:', err);
    }
    const sel = window.getSelection?.();
    sel?.removeAllRanges();
    setVisible(false);
    setText('');
  };

  // 4️⃣ Conditional rendering
  if (extensionActive === null || extensionActive === true) return null;
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Add selection to context"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 9999,
        transform: 'translateY(-6px)',
      }}
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-full px-3 py-2 shadow-lg backdrop-blur bg-violet-600 hover:bg-violet-500 text-white text-sm transition"
      >
        <span className="text-lg leading-none">➕</span>
        <span className="truncate max-w-[220px]">
          {text.length > 60 ? `${text.slice(0, 57)}…` : text}
        </span>
      </button>
    </div>
  );
}
