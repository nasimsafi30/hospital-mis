import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpires = new Date(Date.now() + 3600000);
      await db.update(users).set({ resetToken, resetTokenExpires }).where(eq(users.id, user.id));
      console.log("Reset link:", `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`);
    }

    return NextResponse.json({ message: "If email exists, reset link sent" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}