/**
 * Calculates a deterministic job match score based on keyword overlap,
 * and provides actionable insights.
 * 
 * @param {string} resumeText - The extracted text from the resume.
 * @param {string} jobDescription - The target job description.
 * @returns {object} Match result details with insights.
 */

const ROLE_SKILLS = {
  "full stack developer": [
    "react",
    "node",
    "express",
    "javascript",
    "typescript",
    "html",
    "css",
    "mongodb",
    "mysql",
    "postgresql",
    "git",
    "github",
    "rest",
    "api",
    "docker",
    "aws",
    "redux",
    "tailwind"
  ],

  "frontend developer": [
    "react",
    "javascript",
    "typescript",
    "html",
    "css",
    "redux",
    "tailwind",
    "git",
    "responsive",
    "bootstrap"
  ],

  "backend developer": [
    "node",
    "express",
    "mongodb",
    "mysql",
    "postgresql",
    "rest",
    "api",
    "docker",
    "aws",
    "jwt",
    "redis"
  ],

  "python developer": [
    "python",
    "django",
    "flask",
    "fastapi",
    "sql",
    "api",
    "git",
    "numpy",
    "pandas"
  ]
};

const STOP_WORDS = new Set([
  "the","and","or","for","with","this","that","from","into",
  "your","their","have","will","shall","about","using",
  "want","apply","role","position","developer","engineer",
  "job","need","required","looking","experience"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(word =>
      word.length > 2 &&
      !STOP_WORDS.has(word)
    );
}

function calculateJobMatch(resumeText, jobDescription) {

  if (!jobDescription || jobDescription.trim() === "") {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      matchedKeywords: [],
      missingKeywords: [],
      strengths: [],
      weaknesses: [],
      recommendation: "Please provide a job description to get a tailored analysis."
    };
  }

  const resumeTokens = new Set(tokenize(resumeText));

  let requiredSkills;

  const role = jobDescription.trim().toLowerCase();

  if (ROLE_SKILLS[role]) {
    requiredSkills = ROLE_SKILLS[role];
  } else {
    requiredSkills = [...new Set(tokenize(jobDescription))];
  }

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(skill => {
    if (resumeTokens.has(skill))
      matchedSkills.push(skill);
    else
      missingSkills.push(skill);
  });

  const matchScore =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / requiredSkills.length) * 100
        );

  // Generate Insights
  const strengths = matchedSkills.length > 0 
    ? [`Strong technical foundation with skills in: ${matchedSkills.slice(0, 3).join(', ')}`]
    : ["Resume contains relevant general terminology."];
    
  const weaknesses = missingSkills.length > 0
    ? missingSkills.slice(0, 3).map(skill => `Lacks experience in: ${skill}`)
    : ["Consider highlighting more specific technical projects."];

  let recommendation = "";
  if (matchScore >= 80) {
    recommendation = "Excellent fit for this role. You possess the majority of requested skills.";
  } else if (matchScore >= 50) {
    recommendation = "Good potential fit. Focus on addressing the missing skills to increase your competitiveness.";
  } else {
    recommendation = "Consider tailoring your resume more specifically to the job requirements and highlighting transferable skills.";
  }

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    matchedKeywords: matchedSkills,
    missingKeywords: missingSkills,
    strengths,
    weaknesses,
    recommendation
  };
}

module.exports = {
  calculateJobMatch
};
