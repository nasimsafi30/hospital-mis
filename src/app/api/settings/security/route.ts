import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Security settings updated", settings: body });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
