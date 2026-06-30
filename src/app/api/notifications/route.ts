import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.query.notifications.findMany({
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
    });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isRead } = await request.json();
    if (id) {
      await db.update(notifications).set({ isRead }).where(eq(notifications.id, id));
    } else {
      await db.update(notifications).set({ isRead: true }).where(eq(notifications.isRead, false));
    }
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      await db.delete(notifications).where(eq(notifications.id, parseInt(id)));
    } else {
      await db.delete(notifications).where(eq(notifications.isRead, true));
    }
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}