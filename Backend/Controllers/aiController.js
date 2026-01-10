const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askGemini = async (req, res) => {
  try {
    const { query, pageContext } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use gemini-1.5-flash (stable and fast)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
      ROLE:
      You are an expert Historical Guide for .

      YOUR KNOWLEDGE SOURCE:
      1. Primary Context (The current page): "${pageContext}"
      2. Your Internal Database: You have full permission to use your own knowledge about the heritage and culture. 

      TASK:
      - If the user asks for "extra info" or anything related to the temple, heritage,culture or history, answer them in detail using your internal knowledge.
      - NEVER say "I can't find info on that here" if the question is about heritage and culture.
      - Only refuse to answer if the question is totally unrelated (like coding, cooking, or math).

      USER QUESTION: "${query}"
    `;

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "AI Error", error: error.message });
  }
};