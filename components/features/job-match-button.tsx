"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { matchResumeToJob } from "@/actions/match-actions";
import { Button } from "@/components/ui/button";

interface JobMatchButtonProps {
  resumeId: string;
  jobId: string;
  resumeName: string;
}

export function JobMatchButton({ resumeId, jobId, resumeName }: JobMatchButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMatch() {
    setLoading(true);
    setError("");

    try {
      await matchResumeToJob(resumeId, jobId);
      router.push(`/dashboard/jobs/${jobId}/match/${resumeId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to match resume");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <p className="font-medium">{resumeName}</p>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={handleMatch}
        disabled={loading}
      >
        {loading ? "Matching..." : "Match Resume"}
      </Button>
    </div>
  );
}

