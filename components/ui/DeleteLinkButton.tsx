"use client";

import { Trash2 } from "lucide-react";

export function DeleteLinkButton({ code }: { code: string }) {
  async function handleDelete() {
    if (!confirm(`Delete link "${code}"?`)) return;
    await fetch(`https://shortlink.core47.xyz/api/shortlink/${code}`, {
      method: "DELETE",
      credentials: "include",
    });
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      aria-label="Delete link"
      className="text-[rgb(var(--muted))] hover:text-red-600"
    >
      <Trash2 size={14} />
    </button>
  );
}