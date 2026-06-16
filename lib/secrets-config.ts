// Shared constants/types for the secrets vault. Kept out of actions/secrets.ts
// because that file is a "use server" module, which may only export async
// functions.

export type Secret = {
  id: string;
  appId: string;
  key: string;
  value: string; // decrypted — only returned server-side to the authed session
  addedAt: string;
  addedBy: string;
};

// The appId used by the standalone "general" vault (the /secrets page). Secrets
// tied to a manual project use that project's id as the appId instead.
export const GENERAL_SCOPE = "general";
