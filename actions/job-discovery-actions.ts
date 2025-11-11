"use server";

import { discoverJobsFromResume } from "@/lib/job-discovery";
import { getUserResumes, getResume } from "./resume-actions";
import { auth } from "@/app/api/auth/[...nextauth]/route";

/**
 * Discover jobs based on user's resume
 */
export async function discoverJobsForUser(resumeId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Get user's resumes
    const resumes = await getUserResumes();

    if (resumes.length === 0) {
      return { error: "No resumes found. Please upload a resume first." };
    }

    // Use specified resume or the most recent one
    const resume = resumeId
      ? await getResume(resumeId)
      : resumes[0];

    if (!resume || !resume.parsed) {
      return { error: "Resume data not found" };
    }

    const parsed = resume.parsed as any;

    // Extract resume data
    const resumeData = {
      skills: parsed.skills || [],
      experience: parsed.experience || [],
      education: parsed.education || [],
      summary: parsed.summary || "",
    };

    // Discover jobs
    const discoveredJobs = await discoverJobsFromResume(resumeData, 10);

    if (discoveredJobs.length === 0) {
      return { error: "No jobs were discovered. Please try again or check your resume data." };
    }

    return { jobs: discoveredJobs, resumeId: resume.id };
  } catch (error: any) {
    console.error("Error discovering jobs:", error);
    
    // Provide specific error messages
    let errorMessage = "Failed to discover jobs";
    
    if (error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
      errorMessage = "OpenAI API quota exceeded. Please check your API key usage and billing settings at https://platform.openai.com/usage";
    } else if (error?.message?.includes("Invalid API key")) {
      errorMessage = "Invalid OpenAI API key. Please check your .env.local file.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return { error: errorMessage };
  }
}

