import { PDFParse } from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.type !== "application/pdf") return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "PDF must be smaller than 5 MB." }, { status: 400 });
  try {
    const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });
    const result = await parser.getText();
    await parser.destroy();
    return NextResponse.json({ text: result.text.trim() });
  } catch {
    return NextResponse.json({ error: "Could not read this PDF. Try a text-based PDF." }, { status: 422 });
  }
}
