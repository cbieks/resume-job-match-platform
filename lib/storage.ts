/**
 * File storage utilities
 * Supports local file system, Supabase Storage, and AWS S3
 */

import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * Upload file to local file system (for development)
 */
export async function uploadToLocal(file: File): Promise<UploadResult> {
  const uploadsDir = join(process.cwd(), "public", "uploads", "resumes");
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${timestamp}-${sanitizedName}`;
  const filePath = join(uploadsDir, fileName);

  // Convert File to Buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // Return URL and key
  const url = `/uploads/resumes/${fileName}`;
  const key = `resumes/${fileName}`;

  return { url, key };
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadToSupabase(
  file: File,
  bucket: string = "resumes"
): Promise<UploadResult> {
  // TODO: Implement Supabase Storage upload
  throw new Error("Supabase Storage upload not implemented yet");
}

/**
 * Upload file to AWS S3
 */
export async function uploadToS3(file: File): Promise<UploadResult> {
  // TODO: Implement AWS S3 upload
  throw new Error("AWS S3 upload not implemented yet");
}

/**
 * Upload file based on configured storage provider
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  const storageProvider = process.env.STORAGE_PROVIDER || "local";

  if (storageProvider === "local") {
    return uploadToLocal(file);
  } else if (storageProvider === "supabase") {
    return uploadToSupabase(file);
  } else if (storageProvider === "s3") {
    return uploadToS3(file);
  } else {
    throw new Error(`Unknown storage provider: ${storageProvider}`);
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  const storageProvider = process.env.STORAGE_PROVIDER || "local";

  if (storageProvider === "local") {
    const filePath = join(process.cwd(), "public", key);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } else {
    // TODO: Implement deletion for other storage providers
    throw new Error(`File deletion not implemented for ${storageProvider}`);
  }
}

