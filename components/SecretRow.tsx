"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Copy, Check, Trash2 } from "lucide-react";
import { maskValue } from "@/lib/crypto";
import { deleteSecret } from "@/actions/secrets";

type Props = {
  id: string;
  secretKey: string;
  value: string;
  appId: string;
  addedAt: string;
};

export function SecretRow({ id, secretKey, value, addedAt }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail on insecure origins; ignore silently.
    }
  }

  function handleDelete() {
    if (!confirm(`Delete "${secretKey}"? This cannot be undone.`)) return;
    startDelete(async () => {
      await deleteSecret(id);
    });
  }

  return (
    <tr className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
      <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
        {secretKey}
      </td>
      <td className="px-4 py-3 font-mono text-sm break-all text-gray-600 dark:text-gray-400">
        {revealed ? value : maskValue(value)}
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-400 dark:text-gray-500">
        {addedAt ? new Date(addedAt).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {revealed ? "Hide" : "Reveal"}
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
