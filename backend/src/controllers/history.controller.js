const historyService = require("../services/history.service");

const getHistory = async (req, res) => {
  try {
    const history = await historyService.getHistory();
    res.json(history);
  } catch (error) {
    console.error("Get history controller error:", error);
    res.status(500).json({ message: "Failed to fetch resume history." });
  }
};

const saveHistory = async (req, res) => {
  try {
    const { filename, atsScore } = req.body;

    if (!filename) {
      return res.status(400).json({ message: "Filename is required." });
    }

    if (atsScore === undefined || atsScore === null) {
      return res.status(400).json({ message: "ATS Score is required." });
    }

    const savedItem = await historyService.saveHistoryItem(filename, atsScore);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Save history controller error:", error);
    res.status(500).json({ message: "Failed to save resume history." });
  }
};

module.exports = {
  getHistory,
  saveHistory
};
