import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, appointments, bills } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { entity, ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    switch (entity) {
      case "patients":
        await db.delete(patients).where(inArray(patients.id, ids));
        break;
      case "appointments":
        await db.delete(appointments).where(inArray(appointments.id, ids));
        break;
      case "bills":
        await db.delete(bills).where(inArray(bills.id, ids));
        break;
      default:
        return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
    }

    return NextResponse.json({ message: `${ids.length} records deleted` });
  } catch (error) {
    return NextResponse.json({ error: "Bulk operation failed" }, { status: 500 });
  }
}
