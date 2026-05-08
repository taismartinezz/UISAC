// Firestore REST API helpers — used in API routes instead of the client SDK,
// which has no auth context server-side and gets blocked by security rules.

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { booleanValue: boolean }
  | { nullValue: "NULL_VALUE" }
  | { timestampValue: string }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

type FirestoreDoc = { name: string; fields: Record<string, FirestoreValue> };

/** Convert a plain JS object to Firestore REST field format. */
function toFields(obj: Record<string, unknown>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) {
      fields[k] = { nullValue: "NULL_VALUE" };
    } else if (typeof v === "boolean") {
      fields[k] = { booleanValue: v };
    } else if (typeof v === "number") {
      fields[k] = { integerValue: String(v) };
    } else if (v instanceof Date) {
      fields[k] = { timestampValue: v.toISOString() };
    } else {
      fields[k] = { stringValue: String(v) };
    }
  }
  return fields;
}

/** Convert Firestore REST fields back to a plain JS object. */
function fromFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if ("stringValue" in v) obj[k] = v.stringValue;
    else if ("integerValue" in v) obj[k] = Number(v.integerValue);
    else if ("booleanValue" in v) obj[k] = v.booleanValue;
    else if ("nullValue" in v) obj[k] = null;
    else if ("timestampValue" in v) obj[k] = v.timestampValue;
    else if ("mapValue" in v) obj[k] = fromFields(v.mapValue.fields);
    else obj[k] = null;
  }
  return obj;
}

function docId(name: string) {
  return name.split("/").pop()!;
}

/** Add a document to a collection. Returns the new document ID. */
export async function addDocument(
  collection: string,
  data: Record<string, unknown>,
  token?: string,
): Promise<string> {
  const res = await fetch(`${BASE}/${collection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ fields: toFields(data) }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore addDocument failed (${res.status}): ${text}`);
  }
  const doc: FirestoreDoc = await res.json();
  return docId(doc.name);
}

/** Run a structured query. Returns array of { id, ...fields }. */
export async function runQuery(
  collection: string,
  filters: Array<{ field: string; op: string; value: unknown }>,
  orderBy?: { field: string; direction?: "ASCENDING" | "DESCENDING" },
  token?: string,
): Promise<Array<Record<string, unknown>>> {
  const body = {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: {
        compositeFilter: {
          op: "AND",
          filters: filters.map(({ field, op, value }) => ({
            fieldFilter: {
              field: { fieldPath: field },
              op,
              value: toFields({ v: value }).v,
            },
          })),
        },
      },
      ...(orderBy
        ? {
            orderBy: [
              {
                field: { fieldPath: orderBy.field },
                direction: orderBy.direction ?? "ASCENDING",
              },
            ],
          }
        : {}),
    },
  };

  const res = await fetch(`${BASE}:runQuery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore runQuery failed (${res.status}): ${text}`);
  }

  const results: Array<{ document?: FirestoreDoc }> = await res.json();
  return results
    .filter((r) => r.document)
    .map((r) => ({ id: docId(r.document!.name), ...fromFields(r.document!.fields) }));
}

/** Get a single document. Returns null if not found. */
export async function getDocument(
  collection: string,
  id: string,
  token?: string,
): Promise<(Record<string, unknown> & { id: string }) | null> {
  const res = await fetch(`${BASE}/${collection}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore getDocument failed (${res.status}): ${text}`);
  }
  const doc: FirestoreDoc = await res.json();
  return { id, ...fromFields(doc.fields) };
}

/** Update specific fields on a document. */
export async function updateDocument(
  collection: string,
  id: string,
  data: Record<string, unknown>,
  token?: string,
): Promise<void> {
  const maskParams = Object.keys(data)
    .map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`)
    .join("&");
  const res = await fetch(
    `${BASE}/${collection}/${id}?${maskParams}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ fields: toFields(data) }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore updateDocument failed (${res.status}): ${text}`);
  }
}
