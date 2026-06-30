import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labTests } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.labTests.findMany({ with: { patient: true, doctor: true }, orderBy: [desc(labTests.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [test] = await db.insert(labTests).values({ ...body, testNumber: "LAB-" + Date.now().toString(36), status: "pending" }).returning();
  return NextResponse.json(test, { status: 201 });
}
