

const { GoogleGenerativeAI } = require("@google/generative-ai");

export const configureGemini = () => {
  const genAI = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_SECRET, // Gemini API key from environment variables
  });
  return genAI;
};
