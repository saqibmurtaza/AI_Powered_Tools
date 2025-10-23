// File: extension-fixed/src/utils/debounce.ts
/**
 * Simple debounce utility.
 * Delays execution of the function until after `delay` ms have elapsed
 * since the last time it was invoked.
 */

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };

  // Attach a cancel method (non-enumerable to keep it clean)
  (debounced as any).cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced as ((
    ...args: Parameters<T>
  ) => void) & { cancel: () => void };
}
