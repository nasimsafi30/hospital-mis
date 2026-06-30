import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inventory, inventoryTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(r: any, { params }: any) {
  try {
    const { quantity } = await r.json();

    const item = await db.query.inventory.findFirst({
      where: eq(inventory.id, parseInt(params.id))
    });

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (item.quantity < quantity) return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });

    // Update inventory
    await db.update(inventory)
      .set({ quantity: item.quantity - quantity })
      .where(eq(inventory.id, parseInt(params.id)));

    // Record transaction
    await db.insert(inventoryTransactions).values({
      transactionNumber: "TXN-" + Date.now().toString(36).toUpperCase(),
      itemId: item.id,
      type: "out",
      quantity: quantity,
      unitPrice: item.unitPrice,
      totalAmount: (quantity * parseFloat(item.unitPrice || "0")).toFixed(2),
      referenceType: "dispense",
      notes: "Dispensed from pharmacy"
    });

    return NextResponse.json({ message: "Dispensed successfully", remaining: item.quantity - quantity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}