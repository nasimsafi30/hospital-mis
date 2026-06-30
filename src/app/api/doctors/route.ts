import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { doctors } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.doctors.findMany({ with: { department: true }, orderBy: [desc(doctors.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [doctor] = await db.insert(doctors).values(body).returning();
  return NextResponse.json(doctor, { status: 201 });
}
