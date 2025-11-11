"use server";

import { prisma } from "@/lib/prisma";
import { computeMatch } from "@/lib/matching";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function matchResumeToJob(resumeId: string, jobId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Fetch resume and job
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: session.user.id as string },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Extract text and skills from parsed resume
    const parsed = resume.parsed as any;
    const resumeText = JSON.stringify(parsed); // Simplified - should extract actual text
    const resumeSkills = parsed?.skills || [];

    const jobDescription = job.description;
    const jobSkills = (job.requiredSkills as any) || [];

    // Compute match
    const matchResult = await computeMatch(
      resumeText,
      jobDescription,
      resumeSkills,
      jobSkills
    );

    // Save match result
    const match = await prisma.match.upsert({
      where: {
        resumeId_jobId: {
          resumeId,
          jobId,
        },
      },
      create: {
        resumeId,
        jobId,
        overallScore: matchResult.overallScore,
        semanticScore: matchResult.semanticScore,
        skillsScore: matchResult.skillsScore,
        details: matchResult.details as any,
      },
      update: {
        overallScore: matchResult.overallScore,
        semanticScore: matchResult.semanticScore,
        skillsScore: matchResult.skillsScore,
        details: matchResult.details as any,
      },
    });

    return match;
  } catch (error) {
    console.error("Error matching resume to job:", error);
    throw error;
  }
}

export async function getUserMatches(resumeId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const matches = await prisma.match.findMany({
      where: {
        resume: {
          userId: session.user.id as string,
          ...(resumeId && { id: resumeId }),
        },
      },
      include: {
        job: true,
        resume: true,
      },
      orderBy: { overallScore: "desc" },
    });

    return matches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
}

