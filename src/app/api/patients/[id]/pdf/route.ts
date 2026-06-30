import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jsPDF from "jspdf";
import { format } from "date-fns";

export async function GET(r: any, { params }: any) {
  const patient = await db.query.patients.findFirst({
    where: eq(patients.id, parseInt(params.id)),
    with: { appointments: { with: { doctor: true } }, medicalRecords: true }
  });

  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("PATIENT REPORT", 105, y, { align: "center" });
  y += 10;
  doc.setFontSize(12);
  doc.text(`${patient.firstName} ${patient.lastName}`, 105, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.text(`ID: ${patient.patientId} | Type: ${patient.patientType}`, 105, y, { align: "center" });
  y += 10;
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Date of Birth: ${format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}`, 20, y); y += 6;
  doc.text(`Gender: ${patient.gender} | Blood: ${patient.bloodGroup || 'N/A'}`, 20, y); y += 6;
  doc.text(`Phone: ${patient.phone} | Email: ${patient.email || 'N/A'}`, 20, y); y += 6;
  doc.text(`Address: ${patient.address || 'N/A'}, ${patient.city || ''} ${patient.state || ''}`, 20, y); y += 6;

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return new NextResponse(pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="patient-${patient.patientId}.pdf"` }
  });
}