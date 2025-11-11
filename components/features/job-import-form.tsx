"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { importJobFromDescription, importJobFromUrl } from "@/actions/job-import-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function JobImportForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [importMethod, setImportMethod] = useState<"url" | "text">("text");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (importMethod === "url") {
        if (!jobUrl.trim()) {
          setError("Please enter a URL");
          setLoading(false);
          return;
        }
        result = await importJobFromUrl(jobUrl.trim());
      } else {
        if (!jobDescription.trim()) {
          setError("Please enter a job description");
          setLoading(false);
          return;
        }
        result = await importJobFromDescription(jobDescription.trim());
      }

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard/jobs");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to import job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Import Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Import Method
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setImportMethod("text");
              setJobUrl("");
            }}
            className={`px-4 py-2 rounded-md border ${
              importMethod === "text"
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Paste Job Description
          </button>
          <button
            type="button"
            onClick={() => {
              setImportMethod("url");
              setJobDescription("");
            }}
            className={`px-4 py-2 rounded-md border ${
              importMethod === "url"
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Import from URL
          </button>
        </div>
      </div>

      {/* URL Input */}
      {importMethod === "url" && (
        <div>
          <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Job Posting URL *
          </label>
          <input
            type="url"
            id="jobUrl"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://example.com/job-posting"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the URL of a job posting. We'll fetch and parse it automatically.
          </p>
        </div>
      )}

      {/* Text Input */}
      {importMethod === "text" && (
        <div>
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Description *
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={15}
            placeholder="Paste the job description here. Include job title, company, location, requirements, skills, salary, etc. We'll automatically extract all the details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Paste the full job description. We'll use AI to extract the job title, company, location, skills, and other details automatically.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> We use AI to automatically extract structured information from the job description, including:
        </p>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Job title and company name</li>
          <li>Location and job type</li>
          <li>Required skills and technologies</li>
          <li>Years of experience</li>
          <li>Salary range (if mentioned)</li>
        </ul>
        <p className="mt-2 text-sm text-blue-700">
          After import, you can review and edit the job posting before it goes live.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Importing..." : "Import Job"}
        </Button>
        <Link href="/dashboard/jobs">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

