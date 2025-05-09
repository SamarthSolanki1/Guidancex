"use server"
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { get } from "react-hook-form";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoverLetter(data) {
    const  user = await currentUser();
    if (!user) throw new Error("Unauthorized");
  
    const dbuser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });
  
    if (!user) throw new Error("User not found");
  
    const prompt = `
      Write a professional cover letter for a ${data.jobTitle} position at ${
      data.companyName
    }.
      
      About the candidate:
      - Industry: ${dbuser.industry}
      - Years of Experience: ${dbuser.experience}
      - Skills: ${dbuser.skills?.join(", ")}
      - Professional Background: ${dbuser.bio}
      
      Job Description:
      ${data.jobDescription}
      
      Requirements:
      1. Use a professional, enthusiastic tone
      2. Highlight relevant skills and experience
      3. Show understanding of the company's needs
      4. Keep it concise (max 400 words)
      5. Use proper business letter formatting in markdown
      6. Include specific examples of achievements
      7. Relate candidate's background to job requirements
      
      Format the letter in markdown.
    `;
  
    try {
      const result = await model.generateContent(prompt);
      const content = result.response.text().trim();
  
      const coverLetter = await db.coverLetter.create({
        data: {
          content,
          jobDescription: data.jobDescription,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          status: "completed",
          userId: dbuser.id,
        },
      });
  
      return coverLetter;
    } catch (error) {
      console.error("Error generating cover letter:", error.message);
      throw new Error("Failed to generate cover letter");
    }
  }

  export async function getCoverLetters() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
  
    const dbuser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });
  
    if (!user) throw new Error("User not found");
  
    return await db.coverLetter.findMany({
      where: {
        userId: dbuser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  
  export async function getCoverLetter(id) {
    const  user = await currentUser();
    if (!user) throw new Error("Unauthorized");
  
    const dbuser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });
  
    if (!user) throw new Error("User not found");
  
    return await db.coverLetter.findUnique({
      where: {
        id,
        userId: dbuser.id,
      },
    });
  }
  
  export async function deleteCoverLetter(id) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
  
    const dbuser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });
  
    if (!user) throw new Error("User not found");
  
    return await db.coverLetter.delete({
      where: {
        id,
        userId: dbuser.id,
      },
    });
  }