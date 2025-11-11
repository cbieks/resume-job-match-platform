"use server";

import { parseJobDescription } from "@/lib/job-parser";
import { createJob } from "./job-actions";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * Import job from job description text
 */
export async function importJobFromDescription(jobDescription: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Check if user is admin or recruiter
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (user?.role !== "ADMIN" && user?.role !== "RECRUITER") {
      return { error: "Only admins and recruiters can import jobs" };
    }

    // Parse the job description
    const parsedJob = await parseJobDescription(jobDescription);

    // Create the job
    const result = await createJob({
      title: parsedJob.title,
      description: parsedJob.description,
      company: parsedJob.company,
      location: parsedJob.location,
      jobType: parsedJob.jobType,
      requiredSkills: parsedJob.requiredSkills,
      yearsOfExperience: parsedJob.yearsOfExperience,
      salaryMin: parsedJob.salaryMin,
      salaryMax: parsedJob.salaryMax,
    });

    return result;
  } catch (error: any) {
    console.error("Error importing job:", error);
    return { error: error.message || "Failed to import job" };
  }
}

/**
 * Import job from URL (fetch and parse)
 */
export async function importJobFromUrl(url: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Check if user is admin or recruiter
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (user?.role !== "ADMIN" && user?.role !== "RECRUITER") {
      return { error: "Only admins and recruiters can import jobs" };
    }

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return { error: `Failed to fetch URL: ${response.statusText}` };
    }

    const html = await response.text();

    // Extract text content from HTML (basic extraction)
    // Remove script and style tags
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Parse the job description
    const parsedJob = await parseJobDescription(text);

    // Create the job
    const result = await createJob({
      title: parsedJob.title,
      description: parsedJob.description,
      company: parsedJob.company,
      location: parsedJob.location,
      jobType: parsedJob.jobType,
      requiredSkills: parsedJob.requiredSkills,
      yearsOfExperience: parsedJob.yearsOfExperience,
      salaryMin: parsedJob.salaryMin,
      salaryMax: parsedJob.salaryMax,
    });

    return result;
  } catch (error: any) {
    console.error("Error importing job from URL:", error);
    return { error: error.message || "Failed to import job from URL" };
  }
}

