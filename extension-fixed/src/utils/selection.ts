// File: extension-fixed/src/utils/selection.ts
/**
 * Utility functions for detecting and managing text selections.
 * Used by content_script and floatingButton.
 */

export interface SelectionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Returns the normalized currently selected text.
 * Collapses extra spaces and trims whitespace.
 */
export function getSelectedText(): string {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return "";

  const text = selection.toString().trim().replace(/\s+/g, " ");
  return text;
}

/**
 * Returns the bounding rectangle of the current selection.
 * Used to position the floating button near the selected text.
 */
export function getSelectionRect(): SelectionRect | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Handle collapsed or empty selection
  if (!rect || rect.width === 0 || rect.height === 0) return null;

  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Determines if selected text is too short or trivial to process.
 */
export function isTrivialSelection(text: string): boolean {
  if (!text) return true;
  if (text.length < 3) return true; // Avoid accidental clicks
  const isWhitespace = !/\S/.test(text);
  return isWhitespace;
}

/**
 * Utility: detect if the current selection changed compared to the previous one.
 * Returns true if different.
 */
export function hasSelectionChanged(prevText: string): boolean {
  const current = getSelectedText();
  return current !== prevText;
}
