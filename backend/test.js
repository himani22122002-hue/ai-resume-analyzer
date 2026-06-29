require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function test() {
  console.log(process.env.GEMINI_API_KEY);

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello",
  });

  console.log(res.text);
}

test().catch(console.error);