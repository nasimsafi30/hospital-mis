import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(r: any, { params }: any) {
  const { amount, method, notes } = await r.json();
  
  const bill = await db.query.bills.findFirst({
    where: eq(bills.id, parseInt(params.id))
  });
  
  if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const paymentNumber = "PAY-" + Date.now().toString(36).toUpperCase();
  
  await db.insert(payments).values({
    paymentNumber,
    billId: bill.id,
    amount,
    paymentMethod: method || "cash",
    notes: notes || ""
  });

  const newPaid = (parseFloat(bill.paidAmount || "0") + parseFloat(amount)).toFixed(2);
  const total = parseFloat(bill.totalAmount || "0");
  const newStatus = parseFloat(newPaid) >= total ? "paid" : "partial";

  const [updated] = await db.update(bills).set({
    paidAmount: newPaid,
    paymentStatus: newStatus,
    paymentDate: new Date()
  }).where(eq(bills.id, parseInt(params.id))).returning();

  return NextResponse.json({ message: "Payment processed", bill: updated });
}