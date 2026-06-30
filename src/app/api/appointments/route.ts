import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.appointments.findMany({ with: { patient: true, doctor: true }, orderBy: [desc(appointments.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [apt] = await db.insert(appointments).values({ ...body, appointmentNumber: "APT-" + Date.now().toString(36) }).returning();
  return NextResponse.json(apt, { status: 201 });
}
