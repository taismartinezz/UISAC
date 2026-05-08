import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/config/admins";
import { verifyToken } from "@/lib/verify-token";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ isAdmin: false }, { status: 401 });

  const decoded = await verifyToken(token);
  if (!decoded?.email) return NextResponse.json({ isAdmin: false });

  return NextResponse.json({ isAdmin: isAdminEmail(decoded.email) });
}
