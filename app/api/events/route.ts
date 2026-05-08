import { NextResponse } from "next/server";
import { runQuery } from "@/lib/firestore-rest";

export async function GET() {
  try {
    const events = await runQuery(
      "events",
      [{ field: "status", op: "EQUAL", value: "approved" }],
    );
    events.sort((a, b) => {
      const da = a.date as string ?? "";
      const db = b.date as string ?? "";
      return da.localeCompare(db);
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
