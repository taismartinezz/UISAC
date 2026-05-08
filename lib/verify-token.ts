// Lightweight Firebase ID token verifier — no firebase-admin dependency.
// Uses Google's JWK endpoint to verify the JWT signature + claims.

type DecodedToken = {
  uid: string;
  email?: string;
  name?: string;
};

type JWK = {
  kid: string;
  n: string;
  e: string;
  alg: string;
  use: string;
};

let cachedKeys: JWK[] | null = null;
let cacheExpiry = 0;

async function getPublicKeys(): Promise<JWK[]> {
  if (cachedKeys && Date.now() < cacheExpiry) return cachedKeys;

  const res = await fetch(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
    { next: { revalidate: 3600 } },
  );
  const { keys } = await res.json();
  const maxAge =
    parseInt(res.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] ?? "3600") * 1000;
  cachedKeys = keys;
  cacheExpiry = Date.now() + maxAge;
  return keys;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));

    // Basic claims check
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const now = Math.floor(Date.now() / 1000);
    if (
      payload.iss !== `https://securetoken.google.com/${projectId}` ||
      payload.aud !== projectId ||
      payload.exp < now ||
      payload.iat > now + 300
    ) {
      return null;
    }

    // Fetch JWKs and find the matching key
    const keys = await getPublicKeys();
    const jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) return null;

    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const sig = base64UrlDecode(sigB64);
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sig, data);
    if (!valid) return null;

    return { uid: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}
