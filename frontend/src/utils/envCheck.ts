// frontend/src/utils/envCheck.ts

/** A small typed Window extension for the injected flag */
interface CardContextWindow extends Window {
  __CARDCONTEXT_EXTENSION_ACTIVE__?: boolean;
  __CARDCONTEXT_EXTENSION_TIMESTAMP__?: number;
}

/** Checks if extension is present from page-visible signals (page script or DOM marker) */
export function isCardContextExtensionActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const w = window as CardContextWindow;
    if (w.__CARDCONTEXT_EXTENSION_ACTIVE__ === true) return true;
    if (typeof w.__CARDCONTEXT_EXTENSION_TIMESTAMP__ === "number") return true;
    try {
      const domFlag = document.documentElement.getAttribute("data-cardcontext");
      if (domFlag === "1" || domFlag === "true") return true;
    } catch {
      // ignore DOM read errors
    }
    return false;
  } catch {
    return false;
  }
}
