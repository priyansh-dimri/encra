import argon2 from "argon2-browser/dist/argon2-bundled.min";

export function initializeSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem("encraSalt", JSON.stringify(Array.from(salt)));
}

export async function deriveKey(password) {
  const raw = localStorage.getItem("encraSalt");
  if (!raw) throw new Error("No salt in localStorage - call initializeSalt()");
  const salt = new Uint8Array(JSON.parse(raw));

  const { hash: rawBytes } = await argon2.hash({
    pass: password,
    salt,
    time: 3,
    mem: 2 ** 16,
    parallelism: 1,
    hashLen: 32,
    type: argon2.ArgonType.Argon2id,
  });
  if (rawBytes.byteLength !== 32) {
    throw new Error(
      `Expected a 256-bit key but got ${rawBytes.byteLength * 8} bits`
    );
  }

  return crypto.subtle.importKey("raw", rawBytes, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function hashSharedSecret(sharedSecret) {
  const enc = new TextEncoder().encode(sharedSecret);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function encryptData(data, aesKey) {
  const payload =
    data instanceof Uint8Array
      ? { __enc__: true, __type__: "uint8array", payload: Array.from(data) }
      : { __enc__: true, payload: data };

  const pt = new TextEncoder().encode(JSON.stringify(payload));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, pt);

  const buf = new Uint8Array(iv.length + ct.byteLength);
  buf.set(iv);
  buf.set(new Uint8Array(ct), iv.length);

  return btoa(String.fromCharCode(...buf));
}

export async function decryptData(base64, aesKey) {
  const combined = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ct = combined.slice(12);

  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ct);
  const txt = new TextDecoder().decode(pt);
  const parsed = JSON.parse(txt);

  if (parsed.__enc__) {
    return parsed.__type__ === "uint8array"
      ? new Uint8Array(parsed.payload)
      : parsed.payload;
  }
  return txt;
}
