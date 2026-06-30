import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inventory } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.inventory.findMany({ orderBy: [desc(inventory.createdAt)] });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [item] = await db.insert(inventory).values({ ...body, itemCode: "INV-" + Date.now().toString(36) }).returning();
  return NextResponse.json(item, { status: 201 });
}
