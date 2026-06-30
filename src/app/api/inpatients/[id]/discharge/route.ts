import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admissions, beds, rooms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(r: any, { params }: any) {
  const admission = await db.query.admissions.findFirst({
    where: eq(admissions.id, parseInt(params.id))
  });
  
  if (!admission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.update(admissions).set({
    status: "discharged",
    dischargeDate: new Date()
  }).where(eq(admissions.id, parseInt(params.id)));

  if (admission.bedId) {
    await db.update(beds).set({ isOccupied: false }).where(eq(beds.id, admission.bedId));
  }
  if (admission.roomId) {
    await db.update(rooms).set({ isOccupied: false }).where(eq(rooms.id, admission.roomId));
  }

  return NextResponse.json({ message: "Discharged" });
}