import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { isAdminEmail } from "@/config/admins";
import { getDocument, updateDocument } from "@/lib/firestore-rest";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = await verifyToken(token);
  if (!decoded?.email || !isAdminEmail(decoded.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
  }

  try {
    const existing = await getDocument("events", id, token);
    if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    await updateDocument(
      "events",
      id,
      {
        status: action === "approve" ? "approved" : "rejected",
        reviewedAt: new Date().toISOString(),
        reviewedBy: decoded.uid,
      },
      token,
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update event:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
