/**
 * Calculates a deterministic job match score based on keyword overlap.
 * 
 * @param {string} resumeText - The extracted text from the resume.
 * @param {string} jobDescription - The target job description.
 * @returns {object} Match result details.
 */
const calculateJobMatch = (resumeText, jobDescription) => {
  if (!jobDescription) {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      matchedKeywords: [],
      missingKeywords: []
    };
  }

  // Common stop words to ignore
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'is', 'it', 'for', 'with', 'on', 'as', 'that', 'by', 'be', 'at',
    'this', 'are', 'not', 'was', 'from', 'but', 'which', 'or', 'have', 'an', 'they', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'their', 'his', 'her', 'its', 'my', 'your', 'our', 'them'
  ]);

  const tokenize = (text) => 
    text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

  const jobTokens = [...new Set(tokenize(jobDescription))];
  const resumeTokens = new Set(tokenize(resumeText));

  const matchedKeywords = jobTokens.filter(token => resumeTokens.has(token));
  const missingKeywords = jobTokens.filter(token => !resumeTokens.has(token));

  // For this simple implementation, assume skills are part of keywords
  const matchedSkills = matchedKeywords; // Could be expanded with a tech-skill dictionary
  const missingSkills = missingKeywords;

  // Calculate percentage
  const matchScore = jobTokens.length > 0 
    ? Math.round((matchedKeywords.length / jobTokens.length) * 100) 
    : 0;

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    matchedKeywords,
    missingKeywords
  };
};

module.exports = { calculateJobMatch };
