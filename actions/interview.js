"use server"
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz(){

    const user = await currentUser();
    
    if (!user) {
        throw new Error("You must be logged in to update your profile");
    }
    
    const dbUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id,
        },select: {
            industry: true,
            skills: true,
          },
    });
    
    if (!dbUser) {
        throw new Error("User not found");
    }
    const prompt = `
    Generate 10 technical interview questions for a ${
      dbUser.industry
    } professional${
    dbUser.skills?.length ? ` with expertise in ${dbUser.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions,answers,score) {
    const user = await currentUser();
    
    if (!user) {
        throw new Error("You must be logged in to use this feature ");
    }
    
    const dbUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id,
        },
    });
    
    if (!dbUser) {
        throw new Error("User not found");
    }
    const questionResults = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index],
        explanation: q.explanation,
      }));
      // Get wrong answers
      const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
    
      // Only generate improvement tips if there are wrong answers
      let improvementTip = null;
      if (wrongAnswers.length > 0) {
        const wrongQuestionsText = wrongAnswers
          .map(
            (q) =>
              `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
          )
          .join("\n\n");
    
        const improvementPrompt = `
          The user got the following ${user.industry} technical interview questions wrong:
    
          ${wrongQuestionsText}
    
          Based on these mistakes, provide a concise, specific improvement tip.
          Focus on the knowledge gaps revealed by these wrong answers.
          Keep the response under 2 sentences and make it encouraging.
          Don't explicitly mention the mistakes, instead focus on what to learn/practice.
        `;
    
        try {
          const tipResult = await model.generateContent(improvementPrompt);
    
          improvementTip = tipResult.response.text().trim();
          console.log(improvementTip);
        } catch (error) {
          console.error("Error generating improvement tip:", error);
          // Continue without improvement tip if generation fails
        }
      }
    
      try {
        const assessment = await db.assessment.create({
          data: {
            userId: dbUser.id,
            quizScore: score,
            questions: questionResults,
            category: "Technical",
            improvementTip,
          },
        });
    
        return assessment;
      } catch (error) {
        console.error("Error saving quiz result:", error);
        throw new Error("Failed to save quiz result");
      }
    
        
}

export async function getAssesments(){
    const user = await currentUser();
    
    if (!user) {
        throw new Error("You must be logged in to use this feature ");
    }
    
    const dbUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id,
        },
    });
    
    if (!dbUser) {
        throw new Error("User not found");
    }
    try {
        const assessments = await db.assessment.findMany({
          where: {
            userId: dbUser.id,
          },
          orderBy: {
            createdAt: "asc",
          },
        });
    
        return assessments;
      } catch (error) {
        console.error("Error fetching assessments:", error);
        throw new Error("Failed to fetch assessments");
      }
}

