import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(r: any, { params }: any) {
  const body = await r.json();
  const { status } = body;
  
  const [updated] = await db.update(appointments)
    .set({ status })
    .where(eq(appointments.id, parseInt(params.id)))
    .returning();
  
  return NextResponse.json(updated);
}