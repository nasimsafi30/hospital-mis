import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(r: any, { params }: any) {
  const p = await db.query.patients.findFirst({
    where: eq(patients.id, parseInt(params.id)),
    with: { appointments: { with: { doctor: true } }, medicalRecords: true, bills: true }
  });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(r: any, { params }: any) {
  const body = await r.json();
  // Remove fields that should not be updated directly
  delete body.id;
  delete body.patientId;
  delete body.createdAt;
  delete body.updatedAt;
  
  // Convert dateOfBirth to Date if it's a string
  if (body.dateOfBirth && typeof body.dateOfBirth === 'string') {
    body.dateOfBirth = new Date(body.dateOfBirth).toISOString().split('T')[0];
  }
  
  const [updated] = await db.update(patients)
    .set(body)
    .where(eq(patients.id, parseInt(params.id)))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(r: any, { params }: any) {
  try {
    await db.delete(patients).where(eq(patients.id, parseInt(params.id)));
    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    if (e.code === '23503') {
      return NextResponse.json({ error: "Cannot delete: patient has related records" }, { status: 409 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}