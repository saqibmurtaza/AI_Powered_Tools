import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[var(--brand)] text-white text-center py-4 mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} ToolWiz. All rights reserved.
      </p>
    </footer>
  );
}
