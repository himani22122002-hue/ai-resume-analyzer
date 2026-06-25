const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeResume(resumeText) {
  const prompt = `
You are an ATS Resume Analyzer.

Analyze the following resume and return ONLY valid JSON.

Return in this format:

{
  "atsScore": 0,
  "missingSkills": [],
  "missingKeywords": [],
  "suggestions": []
}

Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.text;

// Remove markdown if Gemini returns ```json ... ```
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

return JSON.parse(text);
}

module.exports = { analyzeResume };