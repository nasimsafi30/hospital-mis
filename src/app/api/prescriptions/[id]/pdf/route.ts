import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jsPDF from "jspdf";
import { format } from "date-fns";

export async function GET(r: any, { params }: any) {
  const rx = await db.query.prescriptions.findFirst({
    where: eq(prescriptions.id, parseInt(params.id)),
    with: { patient: true, doctor: true }
  });

  if (!rx) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("PRESCRIPTION", 105, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.text(`Rx #: ${rx.prescriptionNumber}`, 105, y, { align: "center" });
  y += 10;
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Patient: ${rx.patient?.firstName} ${rx.patient?.lastName}`, 20, y); y += 6;
  doc.text(`Doctor: Dr. ${rx.doctor?.firstName} ${rx.doctor?.lastName}`, 20, y); y += 6;
  doc.text(`Date: ${format(new Date(rx.startDate), 'MMM dd, yyyy')}`, 20, y); y += 8;
  doc.setFontSize(12);
  doc.text(rx.medicineName, 20, y); y += 8;
  doc.setFontSize(10);
  doc.text(`Dosage: ${rx.dosage} | Frequency: ${rx.frequency}`, 20, y); y += 6;
  doc.text(`Duration: ${rx.duration} | Quantity: ${rx.quantity}`, 20, y); y += 6;
  if (rx.instructions) {
    doc.text(`Instructions: ${rx.instructions}`, 20, y); y += 6;
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return new NextResponse(pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="rx-${rx.prescriptionNumber}.pdf"` }
  });
}