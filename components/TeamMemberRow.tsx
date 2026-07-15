"use client";

import { useState, useTransition } from "react";
import { KeyRound, Trash2, Check, X } from "lucide-react";
import { resetTeamUserPassword, deleteTeamUser, updateTeamUserRole } from "@/actions/users";

type Props = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "member";
  createdAt: string;
};

export function TeamMemberRow({ id, email, name, role, createdAt }: Props) {
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [isChangingRole, startRoleChange] = useTransition();

  function handleRoleChange(next: "owner" | "member") {
    setRoleError(null);
    startRoleChange(async () => {
      const res = await updateTeamUserRole(id, next);
      if (!res.success) setRoleError(res.error ?? "Failed to update role.");
    });
  }

  function handleReset() {
    setError(null);
    if (newPassword.length < 8) {
      setError("Min 8 characters");
      return;
    }
    startSave(async () => {
      const res = await resetTeamUserPassword(id, newPassword);
      if (res.success) {
        setResetting(false);
        setNewPassword("");
      } else {
        setError(res.error ?? "Failed");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Remove login for "${email}"? They will no longer be able to sign in.`)) return;
    startDelete(async () => {
      await deleteTeamUser(id);
    });
  }

  return (
    <tr className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
        {name || "—"}
      </td>
      <td className="px-4 py-3 font-mono text-sm break-all text-gray-600 dark:text-gray-400">
        {email}
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        <select
          value={role}
          disabled={isChangingRole}
          onChange={(e) => handleRoleChange(e.target.value as "owner" | "member")}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300"
        >
          <option value="member">Member</option>
          <option value="owner">Owner</option>
        </select>
        {roleError && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{roleError}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-400 dark:text-gray-500">
        {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3">
        {resetting ? (
          <div className="flex items-center justify-end gap-1.5">
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              autoFocus
              className="w-40 rounded-md border border-gray-200 bg-white px-2 py-1 font-mono text-xs text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
            {error && <span className="text-xs text-rose-600 dark:text-rose-400">{error}</span>}
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-200 px-2 py-1 text-xs text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
            >
              <Check className="h-3.5 w-3.5" />
              {isSaving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setResetting(false);
                setNewPassword("");
                setError(null);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => setResetting(true)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Reset password
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "Removing…" : "Remove"}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
