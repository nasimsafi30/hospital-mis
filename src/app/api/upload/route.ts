import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Too large" }, { status: 400 });

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const dir = join(process.cwd(), "public", "uploads");
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(join(dir, filename), Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${filename}`, filename }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    if (!filename) return NextResponse.json({ error: "Filename required" }, { status: 400 });

    const { unlink } = await import("fs/promises");
    const filepath = join(process.cwd(), "public", "uploads", filename);
    if (existsSync(filepath)) await unlink(filepath);
    
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}