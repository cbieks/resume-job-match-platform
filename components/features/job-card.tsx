"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company?: string;
    location?: string;
    jobType: string;
    description: string;
  };
  isAIDiscovered?: boolean;
}

export function JobCard({ job, isAIDiscovered = false }: JobCardProps) {
  const formatJobType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${
        isAIDiscovered ? "border-2 border-blue-300 bg-blue-50" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl text-black">{job.title}</CardTitle>
          {isAIDiscovered && (
            <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full font-semibold">
              AI Recommended
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {job.company && <span className="font-medium">{job.company}</span>}
          {job.location && (
            <>
              {job.company && <span> • </span>}
              <span>{job.location}</span>
            </>
          )}
          {job.jobType && (
            <>
              {(job.company || job.location) && <span> • </span>}
              <span>{formatJobType(job.jobType)}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
        <div className="flex gap-2">
          {isAIDiscovered ? (
            <Link href={`/dashboard/jobs/ai/${job.id.replace('ai-', '')}`}>
              <Button variant="primary" size="sm">
                View Details
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/jobs/${job.id}`}>
              <Button variant="primary" size="sm">
                View Details
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

