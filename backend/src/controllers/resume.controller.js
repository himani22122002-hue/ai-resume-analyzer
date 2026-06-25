const fs = require("fs");
const pdfParse = require("pdf-parse");

const uploadResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);

    const data = await pdfParse(pdfBuffer);

    res.json({
      message: "Resume uploaded successfully",
      extractedText: data.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error extracting PDF",
    });
  }
};

module.exports = { uploadResume };