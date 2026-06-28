const fs = require("fs");
const pdfParse = require("pdf-parse");

const { analyzeResume } = require("../services/gemini.service");
const { saveHistoryItem } = require("../services/history.service");
const { calculateATSScore } = require("../services/scoring.service");
const { calculateJobMatch } = require("../services/jobMatch.service");
const { optimizeResume } = require("../services/resumeOptimizer.service");

const uploadResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);

    const jobDescription = req.body.jobDescription || "";

    const data = await pdfParse(pdfBuffer);

    // Gemini analysis (suggestions, missing skills, keywords)
    const analysis = await analyzeResume(data.text, jobDescription);

    // Deterministic ATS Score
    const customScore = calculateATSScore(data.text);
    analysis.atsScore = customScore.atsScore;

    // Deterministic Job Match
    const jobMatchAnalysis = calculateJobMatch(
      data.text,
      jobDescription
    );

    // Call the Resume Optimizer
    const optimizer = await optimizeResume(data.text, jobDescription);

    // Save analysis history
    await saveHistoryItem(
      req.file.originalname,
      analysis.atsScore
    );

    // Send everything to frontend
    res.json({
      extractedText: data.text,
      atsAnalysis: analysis,
      jobMatchAnalysis,
      optimizer,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { uploadResume };