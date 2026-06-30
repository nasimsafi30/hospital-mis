import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.rooms.findMany({ with: { beds: true }, orderBy: [desc(rooms.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [room] = await db.insert(rooms).values(body).returning();
  return NextResponse.json(room, { status: 201 });
}
