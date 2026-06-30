import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.query.prescriptions.findMany({
      with: { patient: true, doctor: true },
      orderBy: [desc(prescriptions.createdAt)],
    });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prescriptionNumber = "PRX-" + Date.now().toString(36).toUpperCase();
    
    const [rx] = await db.insert(prescriptions).values({
      prescriptionNumber,
      patientId: body.patientId,
      doctorId: body.doctorId,
      medicineName: body.medicineName,
      dosage: body.dosage,
      frequency: body.frequency,
      duration: body.duration,
      instructions: body.instructions || "",
      quantity: body.quantity || 30,
      refills: body.refills || 0,
      isActive: true,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
    }).returning();

    return NextResponse.json(rx, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create prescription" }, { status: 500 });
  }
}