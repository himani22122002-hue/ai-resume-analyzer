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
    linkedinExists: 0,
    githubExists: 0,
    certificationsSectionExists: 0,
    experienceSectionExists: 0,
    atLeast5Skills: 0,
    atLeast3Projects: 0,
    atLeast5ActionVerbs: 0,
    quantifiedAchievements: 0,
  };

  // Original Rules
  if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(resumeText.trim())) breakdown.nameExists = 10;
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) breakdown.emailExists = 10;
  if (/(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(resumeText)) breakdown.phoneExists = 10;
  if (/(skills|technical skills|competencies)/i.test(resumeText)) breakdown.skillsSectionExists = 15;
  if (/(education|academic background|degree)/i.test(resumeText)) breakdown.educationSectionExists = 15;
  if (/(projects|key projects|technical projects)/i.test(resumeText)) breakdown.projectsSectionExists = 20;
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 300 && wordCount <= 1500) breakdown.lengthCorrect = 20;

  // New Rules
  if (/linkedin\.com\//i.test(resumeText)) breakdown.linkedinExists = 5;
  if (/github\.com\//i.test(resumeText)) breakdown.githubExists = 5;
  if (/(certifications|certificates)/i.test(resumeText)) breakdown.certificationsSectionExists = 5;
  if (/(internship|experience|work experience)/i.test(resumeText)) breakdown.experienceSectionExists = 10;

  // Skills count heuristic
  const techSkills = ['javascript', 'python', 'java', 'c++', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'html', 'css', 'typescript', 'git'];
  const foundSkills = techSkills.filter(skill => resumeText.toLowerCase().includes(skill));
  if (foundSkills.length >= 5) breakdown.atLeast5Skills = 10;

  // Project count heuristic (simple bullet point structure scan)
  const projectMatches = (resumeText.match(/(project|task|app) \d/gi) || []).length;
  if (projectMatches >= 3) breakdown.atLeast3Projects = 10;

  // Action verbs heuristic
  const actionVerbs = ['developed', 'built', 'designed', 'implemented', 'created', 'optimized', 'managed', 'led', 'analyzed'];
  const foundVerbs = actionVerbs.filter(verb => resumeText.toLowerCase().includes(verb));
  if (foundVerbs.length >= 5) breakdown.atLeast5ActionVerbs = 10;

  // Quantified achievements
  if (/\d+[%]|\d+\s*[+]|\d+\s*million|\d+\s*k/i.test(resumeText)) breakdown.quantifiedAchievements = 10;

  const totalRawScore = Object.values(breakdown).reduce((sum, points) => sum + points, 0);
  const atsScore = Math.min(100, totalRawScore);

  return {
    atsScore,
    breakdown
  };
};

module.exports = { calculateATSScore };
