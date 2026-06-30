import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inventory } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.query.inventory.findMany({
      orderBy: [desc(inventory.createdAt)],
    });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Creating medicine:", body);
    
    const itemCode = "MED-" + Date.now().toString(36).toUpperCase();
    
    const [item] = await db.insert(inventory).values({
      itemCode,
      itemName: body.itemName,
      category: body.category || "Medicine",
      description: body.description || "",
      quantity: parseInt(body.quantity) || 0,
      unit: body.unit || "tablets",
      unitPrice: body.unitPrice || "0",
      supplier: body.supplier || "",
      reorderLevel: body.reorderLevel || 10,
      expiryDate: body.expiryDate || null,
      batchNumber: body.batchNumber || "",
      location: body.location || "",
      isActive: true,
    }).returning();

    console.log("Created:", item);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Create error:", error);
    return NextResponse.json({ error: error.message || "Failed to create" }, { status: 500 });
  }
}