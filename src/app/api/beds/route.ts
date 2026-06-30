import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { beds } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.beds.findMany({ with: { room: true }, orderBy: [desc(beds.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [bed] = await db.insert(beds).values(body).returning();
  return NextResponse.json(bed, { status: 201 });
}
