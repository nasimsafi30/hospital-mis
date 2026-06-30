import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.bills.findMany({ with: { patient: true }, orderBy: [desc(bills.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [bill] = await db.insert(bills).values({ ...body, billNumber: "BILL-" + Date.now().toString(36) }).returning();
  return NextResponse.json(bill, { status: 201 });
}
