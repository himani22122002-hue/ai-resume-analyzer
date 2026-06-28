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
You are an expert professional resume writer and ATS optimization specialist.
Your task is to rewrite the provided resume text into a professional, polished, and ATS-friendly format.

${jobDescription && jobDescription.trim() !== "" ? `
The candidate is applying for the following role:
---
${jobDescription}
---
Tailor the rewritten resume to align with the keywords, skills, and requirements mentioned in this job description.
` : `
Rewrite the resume to adhere to modern professional standards, using high-impact action verbs and clear structuring.
`}

RULES:
1. Improve grammar, phrasing, and formatting.
2. Use powerful, results-oriented action verbs (e.g., 'Spearheaded', 'Optimized', 'Engineered').
3. Quantify achievements (add metrics/numbers where possible, but do not invent fake information).
4. Strictly preserve the original factual information (do not change job titles, dates, companies, or skills if they exist).
5. Do not invent fake experience or projects.
6. Return ONLY a valid JSON object following the schema provided below.

Original Resume Text:
---
${resumeText}
---

Schema to follow:
{
  "name": "Candidate's full name",
  "professionalSummary": "A concise, impactful professional summary tailored to the target role.",
  "skills": ["List of relevant skills grouped for readability"],
  "experience": ["Formatted experience entries with quantified achievements"],
  "projects": ["Key projects highlighted using the X-Y-Z formula"],
  "education": ["Education details"],
  "certifications": ["Certifications"],
  "languages": ["Languages spoken"]
}

Ensure the response contains ONLY the valid JSON object. Do not wrap the JSON in Markdown formatting, and do not include any introductory or concluding text.
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
