import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admissions, beds, rooms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(r: any, { params }: any) {
  const { roomId, bedId } = await r.json();
  
  const admission = await db.query.admissions.findFirst({
    where: eq(admissions.id, parseInt(params.id))
  });
  
  if (!admission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (admission.bedId) {
    await db.update(beds).set({ isOccupied: false }).where(eq(beds.id, admission.bedId));
  }

  await db.update(beds).set({ isOccupied: true }).where(eq(beds.id, bedId));
  await db.update(rooms).set({ isOccupied: true }).where(eq(rooms.id, roomId));

  const [updated] = await db.update(admissions).set({ roomId, bedId }).where(eq(admissions.id, parseInt(params.id))).returning();
  
  return NextResponse.json(updated);
}