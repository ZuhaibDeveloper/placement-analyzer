const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const output = path.join(__dirname, "..", "AI-Placement-Analyzer-Project-Report.pdf");
const doc = new PDFDocument({ size: "A4", margins: { top: 58, bottom: 58, left: 58, right: 58 }, bufferPages: true });
doc.pipe(fs.createWriteStream(output));

const colors = { ink: "#17211d", green: "#1e7d58", muted: "#66736d", line: "#dfe5df", pale: "#f3f7f1", orange: "#9a6818" };
const pageWidth = 595.28 - 116;

function header() {
  doc.save().strokeColor(colors.line).lineWidth(0.6).moveTo(58, 38).lineTo(537, 38).stroke().restore();
  doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.green).text("CAREERLENS  /  AI PLACEMENT ANALYZER", 58, 24);
}
function footer() {
  const range = doc.bufferedPageRange();
  const bottomMargin = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.save().strokeColor(colors.line).lineWidth(0.6).moveTo(58, 754).lineTo(537, 754).stroke().restore();
    doc.font("Helvetica").fontSize(8).fillColor(colors.muted).text("College Project Documentation", 58, 764, { lineBreak: false });
    doc.text(`${i + 1}`, 520, 764, { width: 17, align: "right", lineBreak: false });
  }
  doc.page.margins.bottom = bottomMargin;
}
function newPage() { doc.addPage(); header(); }
function title(text, subtitle) {
  doc.font("Helvetica-Bold").fontSize(20).fillColor(colors.ink).text(text, 58, doc.y, { width: pageWidth });
  if (subtitle) doc.moveDown(0.35).font("Helvetica").fontSize(10).fillColor(colors.muted).text(subtitle, { width: pageWidth, lineGap: 3 });
  doc.moveDown(0.9);
}
function section(text) {
  doc.moveDown(0.35).font("Helvetica-Bold").fontSize(13).fillColor(colors.green).text(text, { width: pageWidth });
  doc.moveDown(0.25).strokeColor(colors.line).lineWidth(0.7).moveTo(58, doc.y).lineTo(537, doc.y).stroke().moveDown(0.5);
}
function paragraph(text) {
  doc.font("Helvetica").fontSize(10.3).fillColor(colors.ink).text(text, { width: pageWidth, lineGap: 4, paragraphGap: 8 });
}
function bullets(items) {
  items.forEach((item) => {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.green).text("•", 64, doc.y, { continued: true });
    doc.font("Helvetica").fillColor(colors.ink).text(`  ${item}`, { width: pageWidth - 12, lineGap: 3, paragraphGap: 4 });
  });
}
function numbered(items) {
  items.forEach((item, index) => {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.green).text(`${index + 1}.`, 62, doc.y, { continued: true });
    doc.font("Helvetica").fillColor(colors.ink).text(`  ${item}`, { width: pageWidth - 14, lineGap: 3, paragraphGap: 5 });
  });
}
function callout(label, text) {
  const y = doc.y;
  doc.roundedRect(58, y, pageWidth, 62, 3).fill(colors.pale);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.green).text(label.toUpperCase(), 72, y + 12);
  doc.font("Helvetica-Oblique").fontSize(10.5).fillColor(colors.ink).text(text, 72, y + 28, { width: pageWidth - 28, lineGap: 3 });
  doc.y = y + 78;
}

// Cover
doc.rect(0, 0, 595.28, 841.89).fill("#f7f8f5");
doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.green).text("COLLEGE PROJECT DOCUMENTATION", 58, 112, { characterSpacing: 1.4 });
doc.moveDown(4.2);
doc.font("Helvetica-Bold").fontSize(38).fillColor(colors.ink).text("AI Placement", 58, doc.y, { width: 430, lineGap: -4 });
doc.font("Helvetica").fontSize(38).fillColor(colors.green).text("Analyzer", 58, doc.y, { width: 430, lineGap: -4 });
doc.moveDown(1.2);
doc.font("Helvetica").fontSize(14).fillColor(colors.muted).text("An intelligent resume and job description analysis tool for focused placement preparation.", 58, doc.y, { width: 380, lineGap: 4 });
doc.roundedRect(58, 540, 479, 1, 0).fill(colors.line);
doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.ink).text("Prepared by", 58, 575);
doc.font("Helvetica").fontSize(11).fillColor(colors.muted).text("Zuhair Ansari and Team", 58, 595);
doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.ink).text("Project Type", 300, 575);
doc.font("Helvetica").fontSize(11).fillColor(colors.muted).text("AI-enabled web application", 300, 595);
doc.font("Helvetica").fontSize(9).fillColor(colors.muted).text("Local demonstration version  |  2026", 58, 748);

newPage();
title("1. Project Overview", "A concise description of the problem, solution and purpose of the application.");
paragraph("AI Placement Analyzer is a web-based application that compares a student's resume with a target job description. It uses artificial intelligence to identify relevant strengths, missing skills and practical areas for improvement. The application also generates role-specific interview questions so that the student can prepare with a clear direction.");
section("Why We Selected This Project");
paragraph("Students often apply for different roles using the same resume. They may not know whether their resume contains the skills mentioned in a job description, which areas require improvement or how to prepare for the specific interview. This creates a gap between the student's current profile and the expectations of recruiters.");
paragraph("We selected this project because it addresses a practical placement problem faced by college students and combines web development with a useful AI application. It is simple enough to demonstrate in a college project while also having meaningful real-world relevance.");
section("Real-World Problem Solved");
bullets([
  "Students cannot easily identify which resume skills match a particular job description.",
  "Important skills may be missing or hidden inside a poorly structured resume.",
  "Resume improvement is often based on guesswork instead of job-specific requirements.",
  "Interview preparation is usually generic and not focused on the selected role.",
  "Manual comparison of a resume and job description takes time and effort."
]);
callout("Project idea", "The application converts a resume and a job description into an actionable placement preparation plan.");

newPage();
title("2. Proposed Solution", "How the application works from input to result.");
section("Application Workflow");
numbered([
  "The user enters the target role, such as Backend Developer or Frontend Developer.",
  "The user pastes resume and job description text or uploads PDF files.",
  "The application extracts text from uploaded PDFs.",
  "The resume and job description are sent to the analysis API.",
  "Gemini AI compares both inputs and generates structured insights.",
  "The user receives a match score, strengths, skill gaps, improvements and interview questions."
]);
section("Main Output");
bullets([
  "Resume fit score out of 100.",
  "Relevant skills already present in the resume.",
  "Skills required by the job but missing from the resume.",
  "Actionable resume and preparation recommendations.",
  "Four role-specific interview questions for practice.",
  "A visible source indicator showing whether the result came from Gemini AI or local fallback logic."
]);
section("Important Design Decision");
paragraph("The application includes a local fallback analyzer. If the Gemini API is unavailable, the application still provides a basic keyword-based result instead of failing completely. This is useful during a local college demonstration. The source badge makes the difference between the AI response and the fallback response clear to the user.");

newPage();
title("3. Features Implemented", "Current project scope completed in the working prototype.");
section("User Features");
bullets([
  "Resume text input through a textarea.",
  "Job description text input through a textarea.",
  "Optional target role input.",
  "Resume PDF upload with automatic text extraction.",
  "Job description PDF upload with automatic text extraction.",
  "Sample data button for quick demonstration.",
  "Loading, validation and error states.",
  "Responsive interface for desktop and mobile screens."
]);
section("AI and Analysis Features");
bullets([
  "Google Gemini Flash integration through a secure server-side API route.",
  "Structured JSON response for consistent result rendering.",
  "Resume fit score generation.",
  "Strength and skill gap detection.",
  "Resume improvement suggestions.",
  "Role-specific interview question generation.",
  "Local keyword-based fallback when the API is not available.",
  "Gemini AI and Local fallback source badges."
]);
section("Privacy and Practicality");
paragraph("The current version is designed for local demonstration. No database or login system is required. The Gemini API key is stored in a local environment file and is not exposed in the frontend code. Uploaded PDF text is processed for analysis and is not saved as permanent application history in the current version.");

newPage();
title("4. Technology Stack", "Technologies used to build the current version.");
const rows = [
  ["Frontend", "Next.js, React, TypeScript", "Interactive user interface and application structure"],
  ["Styling", "CSS and Tailwind CSS", "Responsive layout and visual design"],
  ["Backend", "Next.js Route Handlers", "Secure server-side analysis and PDF extraction endpoints"],
  ["AI Model", "Google Gemini Flash", "Resume and job description reasoning"],
  ["PDF Processing", "pdf-parse", "Text extraction from text-based PDF files"],
  ["Runtime", "Node.js and npm", "Local development and package management"],
  ["Deployment Option", "Vercel", "Possible future hosting for a small personal demonstration"]
];
let y = doc.y;
doc.rect(58, y, pageWidth, 25).fill(colors.ink);
doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff").text("Layer", 68, y + 8).text("Technology", 170, y + 8).text("Purpose", 325, y + 8);
y += 25;
rows.forEach((row, i) => { const h = 35; if (i % 2 === 0) doc.rect(58, y, pageWidth, h).fill(colors.pale); doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.ink).text(row[0], 68, y + 10, { width: 92 }); doc.font("Helvetica").text(row[1], 170, y + 10, { width: 145 }); doc.text(row[2], 325, y + 10, { width: 200 }); y += h; });
doc.y = y + 25;
section("Why This Stack Was Chosen");
paragraph("The selected stack is fast, modern and suitable for a small college project. Next.js provides both the frontend and backend API routes in one application. TypeScript improves code reliability, while Gemini Flash provides fast AI responses. The project does not require a database for the current scope, which keeps local setup simple and free.");
section("Local Run Instructions");
numbered(["Open the project folder in a terminal.", "Run npm install if dependencies are not installed.", "Create .env.local and add the Gemini API key.", "Run npm run dev.", "Open http://localhost:3000 in a browser."]);

newPage();
title("5. Benefits and Current Limitations", "What value the prototype provides and where it can be improved.");
section("Benefits");
bullets([
  "Provides personalized placement preparation.",
  "Helps students understand job-specific expectations.",
  "Saves time spent manually comparing documents.",
  "Identifies skills that should be learned or highlighted.",
  "Improves interview preparation with role-specific questions.",
  "Can be demonstrated locally without paid hosting or a database."
]);
section("Current Limitations");
bullets([
  "Scanned image-only PDFs may not produce extractable text.",
  "The quality of the output depends on the quality of the resume and job description.",
  "The score is an AI-based estimate and is not an official ATS score.",
  "The current version does not save previous analyses.",
  "There is currently no login, user profile or progress tracking system.",
  "AI output should support career preparation, not replace human review."
]);
callout("Demonstration note", "For the best demo, use a detailed job description with specific technologies, responsibilities and requirements.");

newPage();
title("6. Future Scope", "Features that can expand the prototype into a complete placement platform.");
section("Planned Enhancements");
bullets([
  "Advanced ATS analysis with keyword matching and resume formatting checks.",
  "Multiple resume versions customized for different job roles.",
  "AI-powered resume builder and resume rewriting.",
  "Personalized cover letter generation.",
  "Interactive mock interview mode with AI follow-up questions.",
  "Answer evaluation based on technical accuracy, clarity and communication.",
  "Skill-based learning roadmap with topics, courses and practice projects.",
  "User accounts and saved analysis history.",
  "Progress dashboard to track improvement over time.",
  "Job recommendation based on the user's resume and skills.",
  "Multilingual support for Hindi and other regional languages.",
  "OCR support for scanned PDF resumes."
]);
section("Conclusion");
paragraph("AI Placement Analyzer is a practical AI-enabled web application that helps students prepare for placements in a more focused way. The current prototype supports resume and job description input, PDF upload, AI comparison, fit scoring, skill gap identification, improvement suggestions and interview question generation.");
paragraph("The project solves a genuine student problem while demonstrating frontend development, backend API handling, PDF processing and generative AI integration. With future additions such as ATS optimization, mock interviews, resume building and progress tracking, it can be developed into a complete placement preparation platform.");
callout("Presentation line", "Our project does not simply generate a score. It converts a student's resume and a specific job description into an actionable placement preparation plan.");

footer();
doc.end();
console.log(`Created ${output}`);
