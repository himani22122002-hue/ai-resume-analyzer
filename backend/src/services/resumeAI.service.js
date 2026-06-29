const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates ATS analysis, resume optimization, and rewritten resume in one call.
 * 
 * @param {string} resumeText - The raw text of the resume.
 * @param {string} [jobDescription] - Optional target job description.
 * @returns {Promise<object>} Complete analysis results.
 */
async function generateCompleteAnalysis(resumeText, jobDescription) {
  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Resume text is required.");
  }

  const prompt = `
You are an expert professional career coach, ATS specialist, and resume writer.
Analyze the provided resume and, if provided, tailor it to the job description.

${jobDescription && jobDescription.trim() !== "" ? `
Target Job Description:
---
${jobDescription}
---
` : ''}

Original Resume Text:
---
${resumeText}
---

Perform three tasks and return as a single JSON object:
1. ATS Analysis: Provide score (0-100), missing skills, missing keywords, and actionable suggestions.
2. Resume Optimization: Provide a high-impact professional summary, improved skills, improved projects, improved experience entries, and overall career advice.
3. Rewrite the Resume: Return a professionally rewritten resume strictly adhering to ATS standards, preserving factual accuracy (dates, names, companies, skills), and following the Fresher Rule if applicable.

Ensure the output is ONLY valid JSON with this exact schema:
{
  "atsAnalysis": {
    "atsScore": 0,
    "missingSkills": [],
    "missingKeywords": [],
    "suggestions": []
  },
  "optimizer": {
    "professionalSummary": "",
    "improvedSkills": [],
    "improvedProjects": [],
    "improvedExperience": [],
    "overallAdvice": []
  },
  "rewrittenResume": {
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
    if (!text) throw new Error("Empty response from Gemini AI.");

    text = text.replace(/```json/gi, "").replace(/```/gi, "").trim();
    const result = JSON.parse(text);

    // Ensure all fields exist with fallbacks
    return {
        atsAnalysis: result.atsAnalysis || { atsScore: 0, missingSkills: [], missingKeywords: [], suggestions: [] },
        optimizer: result.optimizer || { professionalSummary: "", improvedSkills: [], improvedProjects: [], improvedExperience: [], overallAdvice: [] },
        rewrittenResume: result.rewrittenResume || { name: "", professionalSummary: "", skills: [], experience: [], volunteerExperience: [], projects: [], education: [], certifications: [], languages: [] }
    };

  } catch (error) {
    console.error("Error in generateCompleteAnalysis:", error);
    throw new Error("Failed to generate complete resume analysis.");
  }
}

module.exports = { generateCompleteAnalysis };
