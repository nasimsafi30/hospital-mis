import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ticket = {
      id: "TKT-" + Date.now().toString(36).toUpperCase(),
      subject: body.subject,
      message: body.message,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ message: "Ticket created", ticket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
