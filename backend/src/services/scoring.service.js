/**
 * Calculates a deterministic ATS score based on specific resume components.
 * 
 * @param {string} resumeText - The extracted text from the resume.
 * @returns {object} { atsScore: number, breakdown: object }
 */
const calculateATSScore = (resumeText) => {
  const breakdown = {
    nameExists: 0,
    emailExists: 0,
    phoneExists: 0,
    skillsSectionExists: 0,
    educationSectionExists: 0,
    projectsSectionExists: 0,
    lengthCorrect: 0,
  };

  // 1. Name check (Heuristic: Look for capitalization at the start of text)
  // Simple check: first few lines often contain a name
  const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+/;
  if (nameRegex.test(resumeText.trim())) {
    breakdown.nameExists = 10;
  }

  // 2. Email exists
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailRegex.test(resumeText)) {
    breakdown.emailExists = 10;
  }

  // 3. Phone number exists
  const phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  if (phoneRegex.test(resumeText)) {
    breakdown.phoneExists = 10;
  }

  // 4. Skills section
  const skillsRegex = /(skills|technical skills|competencies)/i;
  if (skillsRegex.test(resumeText)) {
    breakdown.skillsSectionExists = 15;
  }

  // 5. Education section
  const educationRegex = /(education|academic background|degree)/i;
  if (educationRegex.test(resumeText)) {
    breakdown.educationSectionExists = 15;
  }

  // 6. Projects section
  const projectsRegex = /(projects|key projects|technical projects)/i;
  if (projectsRegex.test(resumeText)) {
    breakdown.projectsSectionExists = 20;
  }

  // 7. Length check (300 - 1500 words)
  const wordCount = resumeText.split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount >= 300 && wordCount <= 1500) {
    breakdown.lengthCorrect = 20;
  }

  const atsScore = Object.values(breakdown).reduce((sum, points) => sum + points, 0);

  return {
    atsScore,
    breakdown
  };
};

module.exports = { calculateATSScore };
