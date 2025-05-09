"use server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const generateAiinsights = async (industry) => {
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
        "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
}

export async function getIndustryInsights(){
    const user = await currentUser();
    
    if (!user) throw new Error("Unauthorized");
    const dbUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id,
        }
    });
    
    if (!dbUser) {
        throw new Error("User not found");
    }
    
    // Check if industry exists
    if (!dbUser.industry) {
        throw new Error("User industry not set");
    }
    
    try {
        // First try to find existing industry insights
        const existingInsight = await db.industryInsight.findUnique({
            where: {
                industry: dbUser.industry
            }
        });
        
        // If it exists and is associated with the user, return it
        if (existingInsight) {
            return existingInsight;
        }
        
        // Otherwise, generate new insights
        console.log("Generating insights for industry:", dbUser.industry);
        const insights = await generateAiinsights(dbUser.industry);
        
        // Use upsert to handle the unique constraint
        const industryInsight = await db.industryInsight.upsert({
            where: {
                industry: dbUser.industry
            },
            update: {
                salaryRanges: insights.salaryRanges,
                growthRate: insights.growthRate,
                demandLevel: insights.demandLevel,
                topSkills: insights.topSkills,
                marketOutlook: insights.marketOutlook,
                keyTrends: insights.keyTrends,
                recommendedSkills: insights.recommendedSkills,
                nextUpdate: new Date(Date.now()+7*24*60*60*1000)
            },
            create: {
                industry: dbUser.industry,
                salaryRanges: insights.salaryRanges,
                growthRate: insights.growthRate,
                demandLevel: insights.demandLevel,
                topSkills: insights.topSkills,
                marketOutlook: insights.marketOutlook,
                keyTrends: insights.keyTrends,
                recommendedSkills: insights.recommendedSkills,
                nextUpdate: new Date(Date.now()+7*24*60*60*1000)
            }
        });
        
        return industryInsight;
    } catch (error) {
        console.error("Error handling industry insights:", error);
        throw error;
    }
}