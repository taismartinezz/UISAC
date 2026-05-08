import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { isAdminEmail } from "@/config/admins";
import { runQuery } from "@/lib/firestore-rest";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = await verifyToken(token);
  if (!decoded?.email || !isAdminEmail(decoded.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const events = await runQuery(
      "events",
      [{ field: "status", op: "EQUAL", value: "pending" }],
      undefined,
      token,
    );
    // Sort in-memory — avoids needing a Firestore composite index
    events.sort((a, b) => {
      const ta = a.submittedAt as string ?? "";
      const tb = b.submittedAt as string ?? "";
      return tb.localeCompare(ta);
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error("Failed to fetch pending events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
