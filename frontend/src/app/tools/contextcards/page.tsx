// frontend/src/app/tools/contextcards/page.tsx
// Server component: renders static shell and mounts the client page.
import React from "react";
import ClientPage from "./ClientPage"; // import client component directly

export default function ContextCardsPage() {
  // Keep the server-side render minimal. The actual interactive UI is inside ClientPage.
  return <ClientPage />;
}
