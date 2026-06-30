import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(r: any, { params }: any) {
  const admission = await db.query.admissions.findFirst({
    where: eq(admissions.id, parseInt(params.id)),
    with: { patient: true, doctor: true, room: true, bed: true, vitals: true },
  });
  if (!admission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(admission);
}

export async function PUT(r: any, { params }: any) {
  const body = await r.json();
  delete body.id; delete body.admissionId; delete body.createdAt; delete body.updatedAt;
  const [updated] = await db.update(admissions).set(body).where(eq(admissions.id, parseInt(params.id))).returning();
  return NextResponse.json(updated);
}