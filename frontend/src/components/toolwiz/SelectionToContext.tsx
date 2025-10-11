'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onAdd: (text: string) => void;
  // minimum length of selection to show button
  minLength?: number;
  // optional: offset from selection rect
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
  const mounted = useRef(true);
  const hideTimeout = useRef<number | null>(null);

  useEffect(() => {
    mounted.current = true;
    function update() {
      // run only in browser
      if (typeof window === 'undefined') return;
      const sel = window.getSelection?.();
      if (!sel) {
        setVisible(false);
        return;
      }
      const str = sel.toString().trim();
      if (!str || str.length < minLength) {
        // don't show if too small
        setVisible(false);
        setText('');
        return;
      }
      // compute bounding rect
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
      // set position relative to viewport + scroll
      const scrollY = window.scrollY ?? window.pageYOffset ?? 0;
      const scrollX = window.scrollX ?? window.pageXOffset ?? 0;
      const top = rect.top + scrollY + offsetY;
      // place near right edge of selection (but keep it from overflowing)
      const left = rect.left + scrollX + rect.width + offsetX - 40;
      setPosition({ top, left });
      setText(str);
      setVisible(true);

      // optionally auto-hide after a bit if selection changes? (we'll clear on selection change)
      if (hideTimeout.current) {
        window.clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    }

    function onMouseUp() {
      // small delay to allow selection to settle
      setTimeout(update, 10);
    }
    function onKeyUp() {
      setTimeout(update, 10);
    }
    function onScrollOrResize() {
      // hide while scrolling/resizing
      setVisible(false);
    }

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    // Also listen to selectionchange to quickly hide when deselected
    document.addEventListener('selectionchange', () => {
      const sel = window.getSelection?.();
      if (!sel || !sel.toString()) {
        setVisible(false);
        setText('');
      }
    });

    return () => {
      mounted.current = false;
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      if (hideTimeout.current) {
        window.clearTimeout(hideTimeout.current);
      }
    };
  }, [minLength, offsetX, offsetY]);

  // click handler: call onAdd, clear selection and hide
  function handleClick() {
    if (!text) return;
    try {
      onAdd(text);
    } catch (e) {
      // swallow errors from consumer
      // eslint-disable-next-line no-console
      console.error('SelectionToContext onAdd threw', e);
    }
    // clear selection and hide
    const sel = window.getSelection?.();
    sel?.removeAllRanges();
    setVisible(false);
    setText('');
  }

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
        <span className="truncate max-w-[220px]">{text.length > 60 ? text.slice(0, 57) + '…' : text}</span>
      </button>
    </div>
  );
}
