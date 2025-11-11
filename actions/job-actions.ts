"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function createJob(data: {
  title: string;
  description: string;
  company?: string;
  location?: string;
  jobType?: string;
  requiredSkills: string[];
  yearsOfExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
}) {
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
      return { error: "Only admins and recruiters can create jobs" };
    }

    const job = await prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        company: data.company,
        location: data.location,
        jobType: data.jobType as any,
        requiredSkills: data.requiredSkills as any,
        yearsOfExperience: data.yearsOfExperience,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        postedById: session.user.id as string,
      },
    });

    return { success: true, jobId: job.id };
  } catch (error: any) {
    console.error("Error creating job:", error);
    return { error: error.message || "Failed to create job" };
  }
}

export async function getJobs(filters?: {
  location?: string;
  jobType?: string;
  search?: string;
}) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        ...(filters?.location && {
          location: { contains: filters.location, mode: "insensitive" },
        }),
        ...(filters?.jobType && { jobType: filters.jobType as any }),
        ...(filters?.search && {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
            { company: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        postedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

export async function getJob(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        postedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return job;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}

