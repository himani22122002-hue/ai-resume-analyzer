const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Optimizes resume text to be ATS-friendly.
 * If a job description is provided, tailors the improvements specifically to that job description.
 * 
 * @param {string} resumeText - The raw text of the resume.
 * @param {string} [jobDescription] - Optional target job description to tailor the resume against.
 * @returns {Promise<object>} An object containing the optimized resume components.
 */
async function optimizeResume(resumeText, jobDescription) {
  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Resume text is required for optimization.");
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) optimizer and professional resume writer.
Your task is to analyze the following resume text and suggest specific, actionable, and ATS-friendly optimizations.

${jobDescription && jobDescription.trim() !== "" ? `
The candidate is applying for a job with the following description:
---
${jobDescription}
---
Ensure the optimized professional summary, improved skills, improved projects, and improved experience are heavily tailored to incorporate the keywords, requirements, and responsibilities mentioned in this job description.
` : `
Optimize the resume generally, adhering to modern professional standards, high-impact action verbs, and clear structuring.
`}

Original Resume Text:
---
${resumeText}
---

Your response must be a single, valid JSON object following this exact schema:

{
  "professionalSummary": "A highly professional, ATS-optimized, 2-to-4 sentence summary of the candidate's profile, key expertise, and value proposition tailored to the target role.",
  "improvedSkills": [
    "A list of professional skills, categories, or keywords optimized for ATS scans. Group related technical or soft skills into clear categories if appropriate (e.g. 'Languages: JavaScript, TypeScript', 'Frameworks: React, Express')."
  ],
  "improvedProjects": [
    "Improved project descriptions. For key projects found in the resume, rewrite or format them as bullet points or cohesive summaries using high-impact, result-oriented phrasing (such as Google's X-Y-Z formula: Accomplished [X] as measured by [Y], by doing [Z])."
  ],
  "improvedExperience": [
    "Improved professional experience bullet points or highlights. Rewrite key experience entries to lead with strong action verbs (e.g. 'Spearheaded', 'Optimized', 'Engineered'), incorporate quantified metrics (e.g., performance gains, cost reductions, team sizes, project scopes), and align with top keywords."
  ],
  "overallAdvice": [
    "A list of strategic advice and overall recommendations for formatting, tailoring, and presenting the resume to maximize ATS and human reviewer engagement."
  ]
}

Ensure the response contains ONLY the valid JSON object. Do not wrap the JSON in Markdown formatting (do not use \`\`\`json or \`\`\`), and do not include any introductory or concluding text.
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

    // Clean up potential markdown formatting just in case
    text = text.replace(/```json/gi, "").replace(/```/gi, "").trim();

    const parsedData = JSON.parse(text);

    // Validate and structure the output to strictly conform to the requested layout
    const validatedData = {
      professionalSummary: parsedData.professionalSummary || "",
      improvedSkills: Array.isArray(parsedData.improvedSkills) ? parsedData.improvedSkills : [],
      improvedProjects: Array.isArray(parsedData.improvedProjects) ? parsedData.improvedProjects : [],
      improvedExperience: Array.isArray(parsedData.improvedExperience) ? parsedData.improvedExperience : [],
      overallAdvice: Array.isArray(parsedData.overallAdvice) ? parsedData.overallAdvice : []
    };

    return validatedData;

  } catch (error) {
    console.error("Error in resumeOptimizer service:", error);
    throw new Error(`Failed to optimize resume: ${error.message}`);
  }
}

module.exports = { optimizeResume };
