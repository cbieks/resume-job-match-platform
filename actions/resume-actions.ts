"use server";

import { prisma } from "@/lib/prisma";
import { parseResume } from "@/lib/parse";
import { uploadFile } from "@/lib/storage";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function uploadResume(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    // Upload file to storage
    const { url, key } = await uploadFile(file);

    // Parse the resume
    const parsed = await parseResume(file);

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id as string,
        url,
        fileName: file.name,
        fileSize: file.size,
        parsed: parsed as any,
      },
    });

    return { success: true, resumeId: resume.id };
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
}

export async function getUserResumes() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: session.user.id as string },
      orderBy: { createdAt: "desc" },
    });

    return resumes;
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw error;
  }
}

export async function deleteResume(resumeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify ownership
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: session.user.id as string },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    // TODO: Delete file from storage

    // Delete from database
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
}

