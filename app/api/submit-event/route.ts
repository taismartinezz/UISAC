import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { addDocument } from "@/lib/firestore-rest";

const VALID_TYPES = ["Social", "Academic", "Advocacy", "Career"] as const;

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = await verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description, date, startTime, endTime, location, type } =
    body as Record<string, string>;

  if (!title || !description || !date || !startTime || !endTime || !location || !type) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  try {
    const id = await addDocument(
      "events",
      {
        title,
        description,
        date,
        startTime,
        endTime,
        location,
        type,
        status: "pending",
        submittedBy: decoded.uid,
        submitterEmail: decoded.email ?? "",
        submitterName: decoded.name ?? "",
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
      },
      token,
    );
    return NextResponse.json({ success: true, id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Firestore write error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
