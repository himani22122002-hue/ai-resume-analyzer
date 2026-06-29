const fs = require("fs");
const pdfParse = require("pdf-parse");

const { generateCompleteAnalysis } = require("../services/resumeAI.service");
const { saveHistoryItem } = require("../services/history.service");
const { calculateATSScore } = require("../services/scoring.service");
const { calculateJobMatch } = require("../services/jobMatch.service");

const uploadResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);

    const jobDescription = req.body.jobDescription || "";

    const data = await pdfParse(pdfBuffer);

    // Single Gemini API call for Analysis, Optimization, and Rewriting
    const aiResult = await generateCompleteAnalysis(
      data.text,
      jobDescription
    );

    // Deterministic ATS Score (consistent with previous approach)
    const customScore = calculateATSScore(data.text);
    aiResult.atsAnalysis.atsScore = customScore.atsScore;

    // Deterministic Job Match
    const jobMatchAnalysis = calculateJobMatch(
      data.text,
      jobDescription
    );

    // Save analysis history
    await saveHistoryItem(
      req.file.originalname,
      aiResult.atsAnalysis.atsScore
    );

    // Send everything to frontend
    res.json({
      extractedText: data.text,
      ...aiResult,
      jobMatchAnalysis,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { uploadResume };