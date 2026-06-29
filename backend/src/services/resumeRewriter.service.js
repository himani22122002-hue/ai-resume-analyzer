const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Rewrites a resume into a professional, ATS-friendly version.
 * 
 * @param {string} resumeText - The raw text of the resume.
 * @param {string} [jobDescription] - Optional target job description to tailor the resume against.
 * @returns {Promise<object>} An object containing the rewritten resume components.
 */
async function rewriteResume(resumeText, jobDescription) {
  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Resume text is required for rewriting.");
  }

  const prompt = `
You are an expert ATS resume writer. Rewrite the resume professionally while preserving ALL factual information.

${jobDescription && jobDescription.trim() !== "" ? `
Target Job Description:
---
${jobDescription}
---
Tailor the resume to align with the job description while strictly adhering to factual accuracy.
` : ''}

STRICT RULES:
1. NEVER invent information.
2. NEVER create fake work experience, internships, projects, certifications, or skills.
3. NEVER change dates, CGPA, university names, company names, project names, technologies, or achievements.
4. Improve grammar, wording, ATS keywords, formatting, and readability only.

SECTION RULES:
- Professional Summary: Write a concise, ATS-friendly summary.
- Skills: Keep only existing skills, organized into logical categories.
- Experience: Include ONLY if the resume contains real work experience or internships. If none exists, return "experience": []. Never convert projects or volunteer work into work experience.
- Volunteer Experience: Return as "volunteerExperience": []. If none exists, return an empty array.
- Projects: Improve wording. Keep technologies unchanged. Never add fake technologies.
- Education: Preserve exactly.
- Certifications: Preserve exactly.
- Languages: Preserve exactly.

FRESHER RULE:
If the candidate is a fresher:
- Education must appear before Projects.
- Do not create an Experience section (return "experience": []).
- Focus on projects and skills.

Original Resume Text:
---
${resumeText}
---

OUTPUT RULES:
Return ONLY valid JSON. Always return this exact structure:
{
  "name": "",
  "professionalSummary": "",
  "skills": [],
  "experience": [],
  "volunteerExperience": [],
  "projects": [],
  "education": [],
  "certifications": [],
  "languages": []
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text;

    if (!text) {
      throw new Error("Empty response received from Gemini AI.");
    }

    // Scrub markdown formatting
    text = text.replace(/```json/gi, "").replace(/```/gi, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.error("Error in resumeRewriter service:", error);
    throw new Error(`Failed to rewrite resume: ${error.message}`);
  }
}

module.exports = { rewriteResume };
