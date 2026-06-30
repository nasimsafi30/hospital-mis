import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Notification preferences updated", preferences: body });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
