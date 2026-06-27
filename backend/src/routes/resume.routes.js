const express = require("express");
const multer = require("multer");

const { uploadResume } = require("../controllers/resume.controller");
const { getHistory, saveHistory } = require("../controllers/history.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload", upload.single("resume"), uploadResume);

// History routes
router.get("/history", getHistory);
router.post("/history", saveHistory);

module.exports = router;