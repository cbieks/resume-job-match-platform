"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company?: string;
    location?: string;
    jobType: string;
    description: string;
  };
  onMatch?: (jobId: string) => void;
}

export function JobCard({ job, onMatch }: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <div className="text-sm text-gray-600">
          {job.company && <span>{job.company}</span>}
          {job.location && <span> • {job.location}</span>}
          {job.jobType && <span> • {job.jobType}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
        <div className="flex gap-2">
          <Button variant="primary" size="sm">
            View Details
          </Button>
          {onMatch && (
            <Button variant="secondary" size="sm" onClick={() => onMatch(job.id)}>
              Match Resume
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

