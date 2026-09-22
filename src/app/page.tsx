"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  Lightbulb,
  MessageCircleQuestion,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";

type Analysis = {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  improvements: string[];
  questions: string[];
  source?: "gemini" | "local";
  fallbackReason?: string;
};

const sampleResume = `Aarav Sharma
Computer Science student with projects in React and Python.

Skills: JavaScript, React, HTML, CSS, Python, SQL, Git, REST APIs
Projects: Built a task manager with React and a sentiment analysis model with Python.
Education: B.Tech Computer Science, 2026`;
const sampleJob = `Frontend Developer Intern
We are looking for a developer who can build accessible, responsive interfaces.

Requirements: React, TypeScript, Next.js, REST APIs, Git, testing, responsive design and communication.`;

function localAnalysis(resume: string, job: string, role: string): Analysis {
  const skills = ["React", "TypeScript", "Next.js", "JavaScript", "Python", "SQL", "Git", "REST APIs", "testing", "responsive design"];
  const resumeLower = resume.toLowerCase();
  const jobLower = job.toLowerCase();
  const requested = skills.filter((skill) => jobLower.includes(skill.toLowerCase()));
  const strengths = requested.filter((skill) => resumeLower.includes(skill.toLowerCase()));
  const gaps = requested.filter((skill) => !resumeLower.includes(skill.toLowerCase()));
  const score = requested.length ? Math.max(35, Math.round((strengths.length / requested.length) * 100)) : 62;

  return {
    source: "local",
    score,
    summary: `Your profile shows a ${score >= 70 ? "strong" : "promising"} starting point for the ${role || "target"} role. Focus on the missing skills below and make your project impact more measurable.`,
    strengths: strengths.length ? strengths : ["Clear technical foundation", "Hands-on project experience", "Relevant computer science education"],
    gaps: gaps.length ? gaps : ["Add role-specific tools from the job description", "Show testing or deployment experience"],
    improvements: ["Add numbers to project outcomes, such as speed, users, or accuracy.", "Put the most relevant skills and project near the top of your resume.", "Create one small project that demonstrates the highest-priority missing skill."],
    questions: [
      `Walk me through a project that best prepares you for this ${role || "role"}.`,
      "How would you build and test a responsive feature for this team?",
      "Tell me about a technical problem you faced and how you debugged it.",
      `How would you improve your experience with ${gaps[0] || "the most important requirement"}?`,
    ],
  };
}

export default function Home() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"resume" | "job" | "">("");
  const [error, setError] = useState("");

  const fillSample = () => {
    setResume(sampleResume);
    setJob(sampleJob);
    setRole("Frontend Developer Intern");
    setResult(null);
    setError("");
  };

  const uploadPdf = async (file: File, target: "resume" | "job") => {
    setUploading(target);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "PDF could not be read");
      if (target === "resume") setResume(data.text);
      else setJob(data.text);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "PDF could not be read");
    } finally {
      setUploading("");
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>, target: "resume" | "job") => {
    const file = event.target.files?.[0];
    if (file) void uploadPdf(file, target);
    event.target.value = "";
  };

  const analyze = async (event: FormEvent) => {
    event.preventDefault();
    if (!resume.trim() || !job.trim()) {
      setError("Add both your resume and the job description before analyzing.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job, role }),
      });
      if (!response.ok) throw new Error("Analysis failed");
      setResult(await response.json());
    } catch {
      setResult(localAnalysis(resume, job, role));
      setError("AI service unavailable. Showing a local analysis instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell r-w">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="PrepMint home"><span className="brand-mark"><Image src="/icon.svg" alt="" width={28} height={28} priority /></span>PrepMint</a>
        <div className="header-context"><span className="live-dot" /> AI placement workspace <span className="header-divider" /> v0.1</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Target size={13} /> Career intelligence</div>
          <h1>Make every application<br /><span>feel intentional.</span></h1>
          <p>See how your resume fits a role, what needs work, and exactly how to prepare for the conversation that follows.</p>
        </div>
        <div className="hero-actions">
          <div className="hero-signal"><span>01</span><p>Resume + role<br />in one focused view</p></div>
          <button className="sample-button" type="button" onClick={fillSample}><RefreshCw size={15} /> Try sample data</button>
        </div>
      </section>

      <form className="workbench" onSubmit={analyze}>
        <section className="editor-panel" aria-labelledby="editor-title">
          <div className="panel-heading">
            <div className="panel-number">01</div>
            <div><p className="panel-kicker">YOUR MATERIAL</p><h2 id="editor-title">Build your match brief</h2></div>
            <span className="panel-status">Draft</span>
          </div>

          <div className="role-field">
            <label htmlFor="role"><BriefcaseBusiness size={15} /> Target role <span>Optional</span></label>
            <input id="role" value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Backend Developer" />
          </div>

          <div className="document-grid">
            <DocumentField
              label="Your resume"
              helper="PDF or pasted text"
              icon={<FileText size={17} />}
              value={resume}
              placeholder="Paste your resume here, or upload a text-based PDF."
              uploading={uploading === "resume"}
              onChange={setResume}
              onFileChange={(event) => handleFile(event, "resume")}
            />
            <DocumentField
              label="Company requirements"
              helper="Job post or JD"
              icon={<BriefcaseBusiness size={17} />}
              value={job}
              placeholder="Paste the complete job description, responsibilities and required skills."
              uploading={uploading === "job"}
              onChange={setJob}
              onFileChange={(event) => handleFile(event, "job")}
            />
          </div>

          <div className="editor-footer">
            <div className="privacy-copy"><ShieldCheck size={16} /><span>Private session. Your files are only used to create this analysis.</span></div>
            <button className="analyze-button" disabled={loading || Boolean(uploading)}>
              {loading ? <><RefreshCw className="spin" size={17} /> Reading your profile</> : <>Analyze my fit <ArrowRight size={17} /></>}
            </button>
          </div>
          {error && <p className="notice"><CircleAlert size={15} /> {error}</p>}
        </section>

        <section className="analysis-panel" aria-labelledby="analysis-title">
          <div className="panel-heading analysis-heading">
            <div className="panel-number">02</div>
            <div><p className="panel-kicker">ROLE ANALYSIS</p><h2 id="analysis-title">Your readiness report</h2></div>
            {result && <SourcePill result={result} />}
          </div>
          <div className="analysis-scroll">
            {loading ? <LoadingState /> : result ? <Results result={result} /> : <EmptyState />}
          </div>
        </section>
      </form>

      <footer><span>PrepMint</span><span>Made for sharper placement prep</span><span>Local demo</span></footer>
    </main>
  );
}

function DocumentField({ label, helper, icon, value, placeholder, uploading, onChange, onFileChange }: { label: string; helper: string; icon: React.ReactNode; value: string; placeholder: string; uploading: boolean; onChange: (value: string) => void; onFileChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <div className="document-field">
    <div className="document-label"><div className="document-icon">{icon}</div><div><strong>{label}</strong><span>{helper}</span></div></div>
    <label className={`upload-control ${uploading ? "is-uploading" : ""}`}><Upload size={15} /><span>{uploading ? "Extracting text..." : "Upload PDF"}</span><input type="file" accept="application/pdf,.pdf" onChange={onFileChange} /></label>
    <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    <div className="field-meta"><span>{value.trim() ? `${value.trim().length.toLocaleString()} characters` : "Awaiting content"}</span><span>Text editable</span></div>
  </div>;
}

function SourcePill({ result }: { result: Analysis }) {
  const isAi = result.source === "gemini";
  return <span className={`source-pill ${isAi ? "ai" : "local"}`}>{isAi ? <Sparkles size={13} /> : <CircleAlert size={13} />}{isAi ? "Gemini AI" : "Local fallback"}</span>;
}

function EmptyState() {
  return <div className="empty-state"><div className="empty-orbit"><div><Sparkles size={25} /></div></div><p className="empty-eyebrow">YOUR NEXT MOVE</p><h3>Turn uncertainty into a plan.</h3><p>Add your resume and a complete job description. Your score, strengths, gaps and interview prep will stay right here.</p><div className="empty-checks"><span><Check size={14} /> Skill match</span><span><Check size={14} /> Gap map</span><span><Check size={14} /> Interview prep</span></div></div>;
}

function LoadingState() {
  return <div className="loading-state"><div className="loading-mark"><Sparkles size={25} /></div><h3>Finding the important signals</h3><p>Comparing skills, experience and role expectations.</p><div className="loading-lines"><i /><i /><i /></div></div>;
}

function Results({ result }: { result: Analysis }) {
  const scoreLabel = result.score >= 75 ? "Strong match" : result.score >= 55 ? "Good foundation" : "Growth opportunity";
  return <div className="results-content">
    <div className="score-card">
      <div className="score-ring" style={{ "--score": `${result.score * 3.6}deg` } as React.CSSProperties}><div><strong>{result.score}</strong><span>/100</span></div></div>
      <div><p className="score-eyebrow">MATCH SNAPSHOT</p><h3>{scoreLabel}</h3><p>{result.summary}</p></div>
    </div>
    {result.fallbackReason && <p className="fallback-note"><CircleAlert size={14} /> AI is temporarily unavailable. This is a local estimate.</p>}
    <div className="insight-grid"><InsightBlock title="Already in your corner" icon={<Check size={15} />} tone="positive" items={result.strengths} /><InsightBlock title="Worth strengthening" icon={<Target size={15} />} tone="warning" items={result.gaps} /></div>
    <InsightBlock title="Your next three moves" icon={<Lightbulb size={15} />} tone="action" items={result.improvements} numbered />
    <div className="questions-block"><div className="result-title"><span className="title-icon question"><MessageCircleQuestion size={15} /></span><div><h3>Interview rehearsal</h3><p>Practice these before you apply.</p></div></div>{result.questions.map((question, index) => <div className="question-row" key={question}><span>{String(index + 1).padStart(2, "0")}</span><p>{question}</p><ChevronRight size={16} /></div>)}</div>
  </div>;
}

function InsightBlock({ title, icon, tone, items, numbered = false }: { title: string; icon: React.ReactNode; tone: "positive" | "warning" | "action"; items: string[]; numbered?: boolean }) {
  return <div className={`insight-block ${tone}`}><div className="result-title"><span className="title-icon">{icon}</span><h3>{title}</h3></div><ul>{items.map((item, index) => <li key={item}>{numbered ? <span className="list-number">{index + 1}</span> : <span className="list-mark">{tone === "positive" ? <Check size={14} /> : "+"}</span>}<span>{item}</span></li>)}</ul></div>;
}
