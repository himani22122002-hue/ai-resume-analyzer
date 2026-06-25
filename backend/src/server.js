require("dotenv").config();

const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resume.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Resume Analyzer Backend Running"
  });
});

app.use("/api/resume", resumeRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});