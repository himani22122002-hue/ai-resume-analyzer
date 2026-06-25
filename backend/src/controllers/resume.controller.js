const fs = require("fs");
const pdfParse = require("pdf-parse");

const { analyzeResume } = require("../services/gemini.service");

const uploadResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);

    const data = await pdfParse(pdfBuffer);

    const analysis = await analyzeResume(data.text);

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