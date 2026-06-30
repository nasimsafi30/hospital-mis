import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(r: any, { params }: any) {
  const bill = await db.query.bills.findFirst({
    where: eq(bills.id, parseInt(params.id))
  });
  
  if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.update(bills).set({
    paymentStatus: "refunded",
    paidAmount: "0"
  }).where(eq(bills.id, parseInt(params.id)));

  return NextResponse.json({ message: "Refund processed" });
}