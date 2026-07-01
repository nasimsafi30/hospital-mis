import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeTransactions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const transactions = await db.query.financeTransactions.findMany({
      orderBy: [desc(financeTransactions.date), desc(financeTransactions.id)],
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [transaction] = await db.insert(financeTransactions).values({
      type: body.type,
      category: body.category,
      amount: body.amount.toString(),
      description: body.description || "",
      date: body.date,
    }).returning();
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    const body = await request.json();

    const [updated] = await db.update(financeTransactions).set({
      type: body.type,
      category: body.category,
      amount: body.amount.toString(),
      description: body.description || "",
      date: body.date,
    }).where(eq(financeTransactions.id, id)).returning();

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    await db.delete(financeTransactions).where(eq(financeTransactions.id, id));
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}