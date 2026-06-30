import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.patients.findMany({ orderBy: [desc(patients.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const patientId = "PAT-" + Date.now().toString(36).toUpperCase();
  const [patient] = await db.insert(patients).values({ ...body, patientId }).returning();
  return NextResponse.json(patient, { status: 201 });
}
