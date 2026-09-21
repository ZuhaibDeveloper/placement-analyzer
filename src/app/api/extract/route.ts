import { NextResponse } from "next/server";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse/lib/pdf-parse.js") as (data: Buffer) => Promise<{ text: string }>;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.type !== "application/pdf") return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "PDF must be smaller than 5 MB." }, { status: 400 });
  try {
    const result = await pdf(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ text: result.text.trim() });
  } catch (error) {
    console.error("PDF extraction failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Could not read this PDF. Try a text-based PDF." }, { status: 422 });
  }
}
