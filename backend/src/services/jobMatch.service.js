/**
 * Calculates a deterministic job match score based on keyword overlap.
 * 
 * @param {string} resumeText - The extracted text from the resume.
 * @param {string} jobDescription - The target job description.
 * @returns {object} Match result details.
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
      missingKeywords: []
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

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    matchedKeywords: matchedSkills,
    missingKeywords: missingSkills
  };
}

module.exports = {
  calculateJobMatch
};