import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicalRecords } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const all = await db.query.medicalRecords.findMany({
            with: { patient: true, doctor: true },
            orderBy: [desc(medicalRecords.createdAt)],
        });
        return NextResponse.json(all);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const recordNumber = "REC-" + Date.now().toString(36).toUpperCase();

        const [record] = await db.insert(medicalRecords).values({
            recordNumber,
            patientId: body.patientId,
            doctorId: body.doctorId,
            diagnosis: body.diagnosis || "",
            symptoms: body.symptoms || "",
            treatment: body.treatment || "",
            notes: body.notes || "",
            prescription: body.prescription || "",
        }).returning();

        return NextResponse.json(record, { status: 201 });
    } catch (error: any) {
        console.error("Create record error:", error);
        return NextResponse.json({ error: error.message || "Failed to create record" }, { status: 500 });
    }
}