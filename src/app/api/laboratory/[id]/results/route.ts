import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labTests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(r: any, { params }: any) {
  const body = await r.json();
  const [updated] = await db.update(labTests).set({
    result: body.result,
    resultValue: body.resultValue,
    resultNotes: body.resultNotes,
    status: "completed",
    performedAt: new Date()
  }).where(eq(labTests.id, parseInt(params.id))).returning();
  
  return NextResponse.json(updated);
}