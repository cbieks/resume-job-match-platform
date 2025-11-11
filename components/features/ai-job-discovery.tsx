"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Resume {
  id: string;
  fileName: string;
  createdAt: Date;
}

interface AIJobDiscoveryProps {
  resumes: Resume[];
}

export function AIJobDiscovery({ resumes }: AIJobDiscoveryProps) {
  const router = useRouter();
  const [selectedResumeId, setSelectedResumeId] = useState(
    resumes.length > 0 ? resumes[0].id : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleDiscoverJobs(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedResumeId) return;

    setLoading(true);
    try {
      // Navigate to jobs page with discover parameter
      const params = new URLSearchParams();
      params.set("discover", "true");
      params.set("resumeId", selectedResumeId);
      const url = `/dashboard/jobs?${params.toString()}`;
      
      // Use window.location for a full page reload to ensure server-side execution
      window.location.href = url;
    } catch (error) {
      console.error("Error discovering jobs:", error);
      alert("Failed to discover jobs. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="text-black flex items-center gap-2">
          🤖 AI Job Discovery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          Use AI to discover job opportunities tailored to your resume. Select a resume
          and we'll find jobs that match your skills and experience.
        </p>
        <form onSubmit={handleDiscoverJobs} className="space-y-4">
          <div>
            <label
              htmlFor="resume-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Resume
            </label>
            <select
              id="resume-select"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.fileName}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            disabled={loading || !selectedResumeId}
            variant="primary"
            className="w-full"
          >
            {loading ? "Discovering Jobs..." : "🔍 Discover Jobs for Me"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

