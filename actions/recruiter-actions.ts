"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get jobs posted by the current recruiter/admin
 */
export async function getMyJobs() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const jobs = await prisma.job.findMany({
      where: {
        postedById: session.user.id as string,
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { matches: true },
        },
      },
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching my jobs:", error);
    throw error;
  }
}

/**
 * Get candidates (matches) for a recruiter's jobs
 */
export async function getCandidatesForRecruiter() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get all jobs posted by this recruiter
    const jobs = await prisma.job.findMany({
      where: {
        postedById: session.user.id as string,
      },
      select: { id: true },
    });

    const jobIds = jobs.map((job) => job.id);

    // Get all matches for these jobs
    const matches = await prisma.match.findMany({
      where: {
        jobId: { in: jobIds },
      },
      include: {
        resume: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
      orderBy: { overallScore: "desc" },
    });

    return matches;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
}

