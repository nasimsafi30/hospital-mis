import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, appointments, bills } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
  const [p] = await db.select({ count: count() }).from(patients);
  const [a] = await db.select({ count: count() }).from(appointments);
  
  return NextResponse.json({
    totalPatients: p.count,
    totalAppointments: a.count
  });
}