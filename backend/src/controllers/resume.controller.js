const fs = require("fs");
const pdfParse = require("pdf-parse");

const { analyzeResume } = require("../services/gemini.service");
const { saveHistoryItem } = require("../services/history.service");

const uploadResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);

    const data = await pdfParse(pdfBuffer);

    const analysis = await analyzeResume(data.text);

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