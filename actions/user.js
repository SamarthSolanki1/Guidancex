"use server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateAiinsights } from "./dashboard";

export async function updateuser(data) {
    const user = await currentUser();
    
    if (!user) {
        throw new Error("You must be logged in to update your profile");
    }
    
    const dbUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id,
        }
    });
    
    if (!dbUser) {
        throw new Error("User not found");
    }
    
    try {
        const result = await db.$transaction(
            async (tx) => {
                let industryInsight = await tx.industryInsight.findUnique({
                    where: {
                        industry: data.industry,
                    }
                });
                
                if (!industryInsight) {
                    const insights = await generateAiinsights(data.industry);
                     industryInsight = await db.industryInsight.create({
                        data:{
                           industry: data.industry,
                           ...insights,
                           nextUpdate: new Date(Date.now()+7*24*60*60*1000)
                        } 
                   
                   
                   });
                }
                
                const updatedUser = await tx.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    }
                });
                
                return { updatedUser, industryInsight };
            },
            {
                timeout: 10000
            }
        );
        
        return { success: true, ...result };
    } catch (e) {
        console.log(e);
        throw e; // Rethrow the error so it's visible to the client
    }
}

export async function getUserOnboardingStatus() {
    const user = await currentUser();
    
    if (!user) throw new Error("Unauthorized");
    
    try {
        const dbUser = await db.user.findUnique({
            where: { clerkUserId: user.id },
            select: {
                industry: true,
            },
        });
        
        return {
            isOnboarded: !!dbUser?.industry,
        };
    } catch (error) {
        console.error("Error checking onboarding status:", error);
        throw new Error("Failed to check onboarding status");
    }
}