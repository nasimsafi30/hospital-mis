import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === "admin@hospital.com" && password === "Password@123") {
    return NextResponse.json({
      success: true,
      token: "admin-token-123",
      user: {
        id: 1,
        email: "admin@hospital.com",
        firstName: "System",
        lastName: "Administrator",
        role: "admin",
      },
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}