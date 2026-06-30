import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vitals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(r: any, { params }: any) {
  const records = await db.query.vitals.findMany({
    where: eq(vitals.admissionId, parseInt(params.id)),
    orderBy: (v, { desc }) => [desc(v.recordedAt)]
  });
  return NextResponse.json(records);
}

export async function POST(r: any, { params }: any) {
  const body = await r.json();
  const [record] = await db.insert(vitals).values({
    ...body,
    admissionId: parseInt(params.id)
  }).returning();
  return NextResponse.json(record, { status: 201 });
}