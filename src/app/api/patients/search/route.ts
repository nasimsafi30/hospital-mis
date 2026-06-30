import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/db/schema";
import { or, like } from "drizzle-orm";

export async function GET(r: any) {
  const q = r.nextUrl.searchParams.get("q") || "";
  const results = await db.query.patients.findMany({
    where: or(
      like(patients.firstName, `%${q}%`),
      like(patients.lastName, `%${q}%`),
      like(patients.patientId, `%${q}%`)
    ),
    limit: 20
  });
  return NextResponse.json(results);
}