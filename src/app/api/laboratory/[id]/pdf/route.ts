import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labTests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jsPDF from "jspdf";
import { format } from "date-fns";

export async function GET(r: any, { params }: any) {
  const test = await db.query.labTests.findFirst({
    where: eq(labTests.id, parseInt(params.id)),
    with: { patient: true, doctor: true }
  });

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("LABORATORY REPORT", 105, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.text(`Test #: ${test.testNumber}`, 105, y, { align: "center" });
  y += 10;
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Patient: ${test.patient?.firstName} ${test.patient?.lastName}`, 20, y); y += 6;
  doc.text(`Doctor: Dr. ${test.doctor?.firstName} ${test.doctor?.lastName}`, 20, y); y += 6;
  doc.text(`Test: ${test.testName}`, 20, y); y += 6;
  doc.text(`Category: ${test.category || 'N/A'}`, 20, y); y += 8;

  if (test.result) {
    doc.setFontSize(12);
    doc.text(`Result: ${test.result} ${test.unit || ''}`, 20, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Normal Range: ${test.normalRange || 'N/A'}`, 20, y); y += 6;
  } else {
    doc.text(`Status: ${test.status}`, 20, y); y += 6;
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return new NextResponse(pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="lab-${test.testNumber}.pdf"` }
  });
}