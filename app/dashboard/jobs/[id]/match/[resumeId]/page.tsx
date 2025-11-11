import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getJob } from "@/actions/job-actions";
import { getUserResumes, getResume } from "@/actions/resume-actions";
import { getUserMatches } from "@/actions/match-actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MatchResults } from "@/components/features/match-results";

export default async function MatchResultsPage({
  params,
}: {
  params: { id: string; resumeId: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const job = await getJob(params.id);
  const resume = await getResume(params.resumeId);
  const matches = await getUserMatches(params.resumeId);

  // Find the match for this specific job
  const match = matches.find((m) => m.jobId === params.id);

  if (!job || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Not Found</h1>
          <Link href="/dashboard/jobs">
            <Button variant="primary">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Match Not Found</h1>
          <p className="text-gray-600 mb-4">
            Please run a match first before viewing results.
          </p>
          <Link href={`/dashboard/jobs/${params.id}`}>
            <Button variant="primary">Back to Job</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xl font-semibold">
                Resume Match Platform
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/dashboard/jobs" className="text-gray-700 hover:text-gray-900">
                Jobs
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href={`/dashboard/jobs/${params.id}`}
                className="text-gray-700 hover:text-gray-900"
              >
                {job.title}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">Match Results</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {session.user?.name || session.user?.email}
              </span>
              <Link href="/auth/signout">
                <Button variant="secondary" size="sm">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-black mb-2">Match Results</h1>
            <p className="text-gray-600">
              How your resume matches with <strong>{job.title}</strong> at{" "}
              <strong>{job.company || "this company"}</strong>
            </p>
          </div>

          {/* Match Results Component */}
          <MatchResults
            match={{
              overallScore: match.overallScore,
              semanticScore: match.semanticScore,
              skillsScore: match.skillsScore,
              details: match.details as any,
              feedback: match.feedback || undefined,
            }}
            job={{
              id: job.id,
              title: job.title,
              company: job.company || undefined,
              description: job.description,
              requiredSkills: (job.requiredSkills as any) || [],
            }}
            resume={{
              id: resume.id,
              fileName: resume.fileName,
              parsed: resume.parsed as any,
            }}
          />

          {/* Navigation */}
          <div className="flex gap-4">
            <Link href={`/dashboard/jobs/${params.id}`}>
              <Button variant="secondary">Back to Job</Button>
            </Link>
            <Link href="/dashboard/jobs">
              <Button variant="primary">Browse More Jobs</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

