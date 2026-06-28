/**
 * Calculates a deterministic ATS score based on specific resume components.
 * 
 * @param {string} resumeText - The extracted text from the resume.
 * @returns {object} { atsScore: number, breakdown: object }
 */
const calculateATSScore = (resumeText) => {
  const breakdown = {
    contactInfo: 0,
    resumeLength: 0,
    skillsSection: 0,
    educationSection: 0,
    experienceSection: 0,
    projectsSection: 0,
    certifications: 0,
    socialLinks: 0,
    actionVerbs: 0,
    quantifiedAchievements: 0,
    technicalSkillsCount: 0,
    formatting: 0
  };

  // 1. Contact Information (Email + Phone)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(resumeText);
  if (hasEmail && hasPhone) breakdown.contactInfo = 15;
  else if (hasEmail || hasPhone) breakdown.contactInfo = 7;

  // 2. Resume Length (300-1500 words is standard)
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 300 && wordCount <= 1500) breakdown.resumeLength = 10;
  else if (wordCount > 100) breakdown.resumeLength = 5;

  // 3. Section Presence
  if (/(skills|technical skills|competencies)/i.test(resumeText)) breakdown.skillsSection = 10;
  if (/(education|academic background|degree)/i.test(resumeText)) breakdown.educationSection = 10;
  if (/(experience|work history|professional experience)/i.test(resumeText)) breakdown.experienceSection = 10;
  if (/(projects|key projects|technical projects)/i.test(resumeText)) breakdown.projectsSection = 5;
  if (/(certifications|certificates)/i.test(resumeText)) breakdown.certifications = 5;

  // 4. Social Links (LinkedIn/GitHub)
  const hasLinkedIn = /linkedin\.com\//i.test(resumeText);
  const hasGitHub = /github\.com\//i.test(resumeText);
  if (hasLinkedIn || hasGitHub) breakdown.socialLinks = 5;

  // 5. Action Verbs Heuristic
  const actionVerbs = ['developed', 'built', 'designed', 'implemented', 'created', 'optimized', 'managed', 'led', 'analyzed', 'delivered', 'collaborated'];
  const foundVerbs = actionVerbs.filter(verb => new RegExp(`\\b${verb}\\b`, 'i').test(resumeText));
  if (foundVerbs.length >= 5) breakdown.actionVerbs = 10;
  else if (foundVerbs.length > 0) breakdown.actionVerbs = 5;

  // 6. Quantified Achievements
  if (/\d+[%]|\d+\s*[+]|\d+\s*million|\d+\s*k/i.test(resumeText)) breakdown.quantifiedAchievements = 10;

  // 7. Technical Skills Count
  const techSkills = [
  "javascript",
  "python",
  "java",
  "c++",
  "react",
  "node",
  "sql",
  "aws",
  "docker",
  "kubernetes",
  "html",
  "css",
  "typescript",
  "git",
  "c#",
  "angular",
  "vue"
];

const lowerResume = resumeText.toLowerCase();

const foundSkills = techSkills.filter(skill =>
  lowerResume.includes(skill.toLowerCase())
);
  if (foundSkills.length >= 5) breakdown.technicalSkillsCount = 10;
  else if (foundSkills.length > 0) breakdown.technicalSkillsCount = 5;

  // 8. Formatting Heuristic (Simple check for bullet points)
  const bulletPoints = (resumeText.match(/^[-•*] /gm) || []).length;
  if (bulletPoints >= 5) breakdown.formatting = 10;

  // Calculate final score
  const totalRawScore = Object.values(breakdown).reduce((sum, points) => sum + points, 0);
  const atsScore = Math.min(100, totalRawScore);

  return {
    atsScore,
    breakdown
  };
};

module.exports = { calculateATSScore };
