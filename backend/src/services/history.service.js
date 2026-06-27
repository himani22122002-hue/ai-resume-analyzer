const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const FILE_PATH = path.join(__dirname, "../data/history.json");

// Helper to ensure the data folder and file exists
const ensureFileExists = () => {
  const dir = path.dirname(FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), "utf8");
  }
};

const getHistory = async () => {
  try {
    ensureFileExists();
    const data = fs.readFileSync(FILE_PATH, "utf8");
    const history = JSON.parse(data);
    // Sort by createdAt newest first (descending)
    return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error reading history file:", error);
    return [];
  }
};

const saveHistoryItem = async (filename, atsScore) => {
  try {
    ensureFileExists();
    const data = fs.readFileSync(FILE_PATH, "utf8");
    const history = JSON.parse(data);

    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2, 9),
      filename,
      atsScore: parseInt(atsScore, 10) || 0,
      createdAt: new Date().toISOString()
    };

    history.push(newItem);
    fs.writeFileSync(FILE_PATH, JSON.stringify(history, null, 2), "utf8");
    return newItem;
  } catch (error) {
    console.error("Error saving history item:", error);
    throw new Error("Failed to save history item");
  }
};

module.exports = {
  getHistory,
  saveHistoryItem
};
