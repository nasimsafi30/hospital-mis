import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicalRecords } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jsPDF from "jspdf";
import { format } from "date-fns";

export async function GET(r: any, { params }: any) {
  const record = await db.query.medicalRecords.findFirst({
    where: eq(medicalRecords.id, parseInt(params.id)),
    with: { patient: true, doctor: true }
  });
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(18);
  doc.text("MEDICAL RECORD", 105, y, { align: "center" }); y += 10;
  doc.line(20, y, 190, y); y += 10;
  doc.setFontSize(10);
  doc.text(`Record #: ${record.recordNumber}`, 20, y); y += 6;
  doc.text(`Patient: ${record.patient?.firstName} ${record.patient?.lastName}`, 20, y); y += 6;
  doc.text(`Doctor: Dr. ${record.doctor?.firstName} ${record.doctor?.lastName}`, 20, y); y += 6;
  doc.text(`Date: ${format(record.createdAt ? new Date(record.createdAt) : new Date(), 'MMM dd, yyyy')}`, 20, y); y += 6;
  doc.text(`Diagnosis: ${record.diagnosis || 'N/A'}`, 20, y); y += 6;
  
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return new NextResponse(pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="record-${record.recordNumber}.pdf"` }
  });
}