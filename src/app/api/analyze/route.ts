import { NextResponse } from "next/server";

const fallback = (resume: string, job: string, role: string) => {
  const skills = ["React", "TypeScript", "Next.js", "JavaScript", "Python", "SQL", "Git", "REST APIs", "testing", "responsive design"];
  const r = resume.toLowerCase(), j = job.toLowerCase();
  const requested = skills.filter((s) => j.includes(s.toLowerCase()));
  const strengths = requested.filter((s) => r.includes(s.toLowerCase()));
  const gaps = requested.filter((s) => !r.includes(s.toLowerCase()));
  const score = requested.length ? Math.max(35, Math.round((strengths.length / requested.length) * 100)) : 62;
  return { source: "local", score, summary: `Your profile shows a ${score >= 70 ? "strong" : "promising"} starting point for the ${role || "target"} role. Focus on the missing skills below and make your project impact more measurable.`, strengths: strengths.length ? strengths : ["Clear technical foundation", "Hands-on project experience", "Relevant education"], gaps: gaps.length ? gaps : ["Add role-specific tools from the job description", "Show testing or deployment experience"], improvements: ["Add numbers to project outcomes, such as speed, users, or accuracy.", "Put the most relevant skills and project near the top of your resume.", "Create one small project that demonstrates the highest-priority missing skill."], questions: [`Walk me through a project that best prepares you for this ${role || "role"}.`, "How would you build and test a responsive feature for this team?", "Tell me about a technical problem you faced and how you debugged it.", `How would you improve your experience with ${gaps[0] || "the most important requirement"}?`] };
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const resume = String(body.resume || "").slice(0, 18000), job = String(body.job || "").slice(0, 12000), role = String(body.role || "").slice(0, 120);
  if (!resume.trim() || !job.trim()) return NextResponse.json({ error: "Resume and job description are required." }, { status: 400 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json(fallback(resume, job, role));
  const prompt = `You are a career placement analyst. Compare this resume with this job description. Return ONLY valid JSON with exactly these keys: score (integer 0-100), summary (string), strengths (array of 3-5 short strings), gaps (array of 3-5 short strings), improvements (array of 3 short actionable strings), questions (array of exactly 4 role-specific interview questions). Be practical and honest. Target role: ${role || "not provided"}\nRESUME:\n${resume}\nJOB DESCRIPTION:\n${job}`;
  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const response = await fetch(`https://generaq+tivelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.3 } }) });
    if (!response.ok) { console.error("Gemini request failed with status", response.status, await response.text()); throw new Error("Gemini request failed"); }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json({ ...JSON.parse(text), source: "gemini" });
  } catch (error) { console.error("Gemini analysis failed; using local fallback.", error instanceof Error ? error.message : "Unknown error"); return NextResponse.json(fallback(resume, job, role)); }
}
