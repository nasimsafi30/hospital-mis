import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jsPDF from "jspdf";
import { format } from "date-fns";

export async function GET(r: any, { params }: any) {
  const bill = await db.query.bills.findFirst({
    where: eq(bills.id, parseInt(params.id)),
    with: { patient: true }
  });

  if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("INVOICE", 105, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.text(`Bill #: ${bill.billNumber}`, 105, y, { align: "center" });
  y += 10;
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Patient: ${bill.patient?.firstName} ${bill.patient?.lastName}`, 20, y); y += 6;
  doc.text(`Date: ${format(bill.billDate ? new Date(bill.billDate) : new Date(), 'MMM dd, yyyy')}`, 20, y); y += 6;
  doc.text(`Due: ${format(bill.dueDate ? new Date(bill.dueDate) : new Date(), 'MMM dd, yyyy')}`, 20, y); y += 8;
  doc.setFontSize(14);
  doc.text(`Total: $${bill.totalAmount}`, 20, y); y += 6;
  doc.setFontSize(10);
  doc.text(`Paid: $${bill.paidAmount} | Status: ${bill.paymentStatus}`, 20, y); y += 6;

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return new NextResponse(pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="invoice-${bill.billNumber}.pdf"` }
  });
}