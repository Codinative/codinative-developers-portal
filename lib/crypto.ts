import CryptoJS from "crypto-js";

// ----------------------------------------------------------------------------
// AES encrypt/decrypt for the secrets vault. CryptoJS.AES derives a key from
// ENCRYPTION_KEY using OpenSSL's salted KDF, so every ciphertext is salted and
// self-describing. Values are only ever decrypted server-side, inside Server
// Actions — the plaintext never travels to the browser in encrypted form.
// ----------------------------------------------------------------------------

function getKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is not set in environment variables");
  if (key.length < 32) throw new Error("ENCRYPTION_KEY must be at least 32 characters");
  return key;
}

export function encrypt(plainText: string): string {
  if (!plainText) throw new Error("Cannot encrypt empty value");
  return CryptoJS.AES.encrypt(plainText, getKey()).toString();
}

export function decrypt(cipherText: string): string {
  if (!cipherText) throw new Error("Cannot decrypt empty value");
  const bytes = CryptoJS.AES.decrypt(cipherText, getKey());
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error("Decryption failed — wrong key or corrupted data");
  return decrypted;
}

/** Mask a value for display — shows only the last 4 characters. */
export function maskValue(value: string): string {
  if (value.length <= 4) return "●".repeat(value.length);
  return "●".repeat(Math.min(value.length - 4, 24)) + value.slice(-4);
}
