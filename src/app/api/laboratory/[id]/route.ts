import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labTests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(r: any, { params }: any) {
  const item = await db.query.labTests.findFirst({
    where: eq(labTests.id, parseInt(params.id)),
    with: { patient: true, doctor: true }
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(r: any, { params }: any) {
  const body = await r.json();
  delete body.id; delete body.testNumber; delete body.createdAt; delete body.updatedAt;
  const [updated] = await db.update(labTests).set(body).where(eq(labTests.id, parseInt(params.id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(r: any, { params }: any) {
  await db.delete(labTests).where(eq(labTests.id, parseInt(params.id)));
  return NextResponse.json({ message: "Deleted" });
}