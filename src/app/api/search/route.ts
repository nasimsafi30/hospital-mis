import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, doctors, appointments } from "@/lib/db/schema";
import { or, like } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";

  try {
    let results: any = {};

    if (type === "all" || type === "patients") {
      results.patients = await db.query.patients.findMany({
        where: or(
          like(patients.firstName, `%${q}%`),
          like(patients.lastName, `%${q}%`),
          like(patients.patientId, `%${q}%`)
        ),
        limit: 10,
      });
    }

    if (type === "all" || type === "doctors") {
      results.doctors = await db.query.doctors.findMany({
        where: or(
          like(doctors.firstName, `%${q}%`),
          like(doctors.lastName, `%${q}%`),
          like(doctors.specialization, `%${q}%`)
        ),
        limit: 10,
      });
    }

    if (type === "all" || type === "appointments") {
      results.appointments = await db.query.appointments.findMany({
        where: or(like(appointments.appointmentNumber, `%${q}%`)),
        with: { patient: true, doctor: true },
        limit: 10,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}