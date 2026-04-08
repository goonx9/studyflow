import { GoogleGenAI, Type } from "@google/genai";
import { StudyContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateStudyGuide(subject: string, fileContents: string[]): Promise<StudyContent> {
  const combinedContent = fileContents.join("\n\n---\n\n");
  
  const prompt = `
    Subject: ${subject}
    
    Content from files:
    ${combinedContent}
    
    Based on the provided content, create a comprehensive study guide. 
    The guide should include:
    1. A high-level summary of the subject.
    2. Deep teaching on key topics found in the content.
    3. A set of 5-10 flashcards for quick recall.
    4. A quiz with 5-10 multiple-choice questions to test understanding.
    
    Ensure the teaching is "deep" - explain concepts clearly and provide context.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert tutor specializing in deep teaching. Your goal is to help students understand complex topics by breaking them down into digestible but thorough explanations. Always respond in structured JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          summary: { type: Type.STRING },
          keyTopics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["title", "content"]
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["subject", "summary", "keyTopics", "flashcards", "quiz"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as StudyContent;
}
