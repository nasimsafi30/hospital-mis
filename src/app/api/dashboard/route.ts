import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, appointments, bills, doctors } from "@/lib/db/schema";
import { count, sum } from "drizzle-orm";

export async function GET() {
  try {
    const [totalPatients] = await db.select({ count: count() }).from(patients);
    const [totalDoctors] = await db.select({ count: count() }).from(doctors);
    const [totalAppointments] = await db.select({ count: count() }).from(appointments);
    const [revenue] = await db.select({ total: sum(bills.totalAmount) }).from(bills);

    return NextResponse.json({
      totalPatients: totalPatients.count,
      totalDoctors: totalDoctors.count,
      totalAppointments: totalAppointments.count,
      totalRevenue: revenue.total || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}