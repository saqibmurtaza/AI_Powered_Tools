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
  // detection: null = pending, true = extension active, false = extension absent
  const [extensionActive, setExtensionActive] = useState<boolean | null>(null);
  const mounted = useRef(true);
  const hideTimeout = useRef<number | null>(null);

  // 1) Detect extension presence (synchronous + retries)
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

    // immediate check
    const presentNow = checkNow();
    if (presentNow) return; // extension active — we keep state = true

    // schedule retries (cover delayed injection cases)
    const t1 = window.setTimeout(checkNow, 250);
    const t2 = window.setTimeout(checkNow, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 2) Attach selection listeners ONLY when extensionActive === false
  useEffect(() => {
    mounted.current = true;

    if (extensionActive === null || extensionActive === true) {
      // either still detecting or extension present — do not attach listeners
      // But we still return a cleanup closure to keep hook ordering stable
      return () => {
        mounted.current = false;
      };
    }

    function updateSelectionFromWindow() {
      if (typeof window === 'undefined') return;
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
      if (!range) {
        setVisible(false);
        return;
      }
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
    }

    function onMouseUp() {
      setTimeout(updateSelectionFromWindow, 10);
    }
    function onKeyUp() {
      setTimeout(updateSelectionFromWindow, 10);
    }
    function onScrollOrResize() {
      setVisible(false);
    }
    function onSelectionChange() {
      const sel = window.getSelection?.();
      if (!sel || !sel.toString()) {
        setVisible(false);
        setText('');
      }
    }

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
      mounted.current = false;
    };
  }, [minLength, offsetX, offsetY, extensionActive]);

  // 3) If extension becomes active later, ensure we hide/cleanup
  useEffect(() => {
    if (extensionActive === true) {
      setVisible(false);
      setText('');
    }
  }, [extensionActive]);

  function handleClick() {
    if (!text) return;
    try {
      onAdd(text);
    } catch (e) {
      console.error('SelectionToContext onAdd threw', e);
    }
    const sel = window.getSelection?.();
    sel?.removeAllRanges();
    setVisible(false);
    setText('');
  }

  // safe conditional render (hooks always declared above)
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
