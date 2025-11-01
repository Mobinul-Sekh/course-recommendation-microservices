import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "PLACEHOLDER_API_KEY" });

router.post("/", async (req, res) => {
  try {
    const { topics, skillLevel } = req.body;
  
    const prompt = `
      Recommend 3-5 relevant courses for the topic(s) "${topics}" at a ${skillLevel} skill level. 
  
      Requirements:
      - Return ONLY a JSON array of course names
      - Each course name should be a string
      - Do not include any other text, explanations, or markdown formatting
      - Ensure course names are specific and relevant to the topic and skill level
      - Order courses from most to least relevant
  
      Example response format:
      ["Course 1", "Course 2", "Course 3"]
    `;
  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  
    console.log(response.text);
    res.json({ recommendations: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

export default router;
