import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { departments } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.departments.findMany({ with: { doctors: true }, orderBy: [desc(departments.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [dept] = await db.insert(departments).values(body).returning();
  return NextResponse.json(dept, { status: 201 });
}
