import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(r: any, { params }: any) {
  const item = await db.query.rooms.findFirst({
    where: eq(rooms.id, parseInt(params.id)),
    with: { beds: true }
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(r: any, { params }: any) {
  const body = await r.json();
  delete body.id; delete body.createdAt; delete body.updatedAt;
  const [updated] = await db.update(rooms).set(body).where(eq(rooms.id, parseInt(params.id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(r: any, { params }: any) {
  await db.delete(rooms).where(eq(rooms.id, parseInt(params.id)));
  return NextResponse.json({ message: "Deleted" });
}