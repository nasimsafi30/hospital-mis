import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { beds } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(r: any, { params }: any) {
  const item = await db.query.beds.findFirst({
    where: eq(beds.id, parseInt(params.id)),
    with: { room: true }
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(r: any, { params }: any) {
  const body = await r.json();
  delete body.id; delete body.createdAt; delete body.updatedAt;
  const [updated] = await db.update(beds).set(body).where(eq(beds.id, parseInt(params.id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(r: any, { params }: any) {
  await db.delete(beds).where(eq(beds.id, parseInt(params.id)));
  return NextResponse.json({ message: "Deleted" });
}