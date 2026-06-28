const fs = require("fs");
const pdfParse = require("pdf-parse");

const { analyzeResume } = require("../services/gemini.service");
const { saveHistoryItem } = require("../services/history.service");
const { calculateATSScore } = require("../services/scoring.service");

const uploadResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const jobDescription = req.body.jobDescription;

    const data = await pdfParse(pdfBuffer);

    // Get suggestions from Gemini
    const analysis = await analyzeResume(data.text, jobDescription);
    
    // Calculate custom score
    const customScore = calculateATSScore(data.text);
    
    // Override ATS score
    analysis.atsScore = customScore.atsScore;

    await saveHistoryItem(
      req.file.originalname,
      analysis.atsScore
    );

    res.json({
      extractedText: data.text,
      atsAnalysis: analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { uploadResume };