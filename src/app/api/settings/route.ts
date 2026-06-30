import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const s = await db.query.settings.findFirst();
    return NextResponse.json(s || {});
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = await db.query.settings.findFirst();
    
    if (existing) {
      const [updated] = await db.update(settings).set(body).where(eq(settings.id, existing.id)).returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db.insert(settings).values(body).returning();
      return NextResponse.json(created);
    }
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
