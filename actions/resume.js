"use server"

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveresume(content){
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
try{
    const resume = await db.resume.upsert({
     where: {
        userId: dbUser.id,
     },
     update:{
        content
     },
     create: {
        userId: dbUser.id,
        content
     }
     
    });
    revalidatePath("/resume");
    return resume;
}catch(error){
    console.error("Error saving resume:", error);
    throw new Error("Error saving resume");
}
}


// get resume function 
export async function getResume() {
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
    return await db.resume.findUnique({
      where: {
        userId: dbUser.id,
      },
    });
  }


  // Improve resume function with AI

  export async function improveWithAI({ current, type }) {
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
    const prompt = `
      As an expert resume writer, improve the following ${type} description for a ${dbUser.industry} professional.
      Make it more impactful, quantifiable, and aligned with industry standards.
      Current content: "${current}"
  
      Requirements:
      1. Use action verbs
      2. Include metrics and results where possible
      3. Highlight relevant technical skills
      4. Keep it concise but detailed
      5. Focus on achievements over responsibilities
      6. Use industry-specific keywords
      
      Format the response as a single paragraph without any additional text or explanations.
    `;
  
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const improvedContent = response.text().trim();
      return improvedContent;
    } catch (error) {
      console.error("Error improving content:", error);
      throw new Error("Failed to improve content");
    }
  }