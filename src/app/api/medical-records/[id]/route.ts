import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicalRecords } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(r: any, { params }: any) {
  const item = await db.query.medicalRecords.findFirst({
    where: eq(medicalRecords.id, parseInt(params.id)),
    with: { patient: true, doctor: true }
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(r: any, { params }: any) {
  const body = await r.json();
  delete body.id; delete body.recordNumber; delete body.createdAt; delete body.updatedAt;
  const [updated] = await db.update(medicalRecords).set(body).where(eq(medicalRecords.id, parseInt(params.id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(r: any, { params }: any) {
  await db.delete(medicalRecords).where(eq(medicalRecords.id, parseInt(params.id)));
  return NextResponse.json({ message: "Deleted" });
}