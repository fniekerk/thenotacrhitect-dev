import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("__Host-admin_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getAllPostsAdmin();
  return NextResponse.json(posts);
}
