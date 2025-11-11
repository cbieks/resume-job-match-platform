"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadResume } from "@/actions/resume-actions";
import { Button } from "@/components/ui/button";

export function ResumeUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadResume(formData);
      setSuccess(true);
      // Refresh the page to show the new resume
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file" className="block text-sm font-medium mb-2">
          Upload Resume (PDF only, max 5MB)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept="application/pdf"
          required
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Resume uploaded successfully!
        </div>
      )}

      <Button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </Button>
    </form>
  );
}

