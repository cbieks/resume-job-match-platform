import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getJobs } from "@/actions/job-actions";
import { getUserResumes } from "@/actions/resume-actions";
import { discoverJobsForUser } from "@/actions/job-discovery-actions";
import { JobCard } from "@/components/features/job-card";
import { AIJobDiscovery } from "@/components/features/ai-job-discovery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { 
    search?: string; 
    location?: string; 
    jobType?: string;
    discover?: string;
    resumeId?: string;
  };
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user?.id as string },
  });

  const isAdmin = user?.role === "ADMIN";
  const isRecruiter = user?.role === "RECRUITER";
  const isJobSeeker = user?.role === "USER";

  const jobs = await getJobs({
    search: searchParams.search,
    location: searchParams.location,
    jobType: searchParams.jobType,
  });

  // Get user's resumes for job discovery (job seekers only)
  const resumes = isJobSeeker ? await getUserResumes() : [];
  
  // Discover AI jobs if requested
  let aiJobs: any[] = [];
  let discoveryError: string | null = null;
  if (searchParams.discover === "true" && isJobSeeker && resumes.length > 0) {
    const discoveryResult = await discoverJobsForUser(searchParams.resumeId);
    if (discoveryResult.error) {
      discoveryError = discoveryResult.error;
    } else if (discoveryResult.jobs) {
      aiJobs = discoveryResult.jobs;
    }
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
              <span className="text-gray-700">Jobs</span>
            </div>
            <div className="flex items-center gap-4">
              {(isAdmin || user?.role === "RECRUITER") && (
                <>
                  <Link href="/dashboard/jobs/import">
                    <Button variant="secondary" size="sm">
                      Import Job
                    </Button>
                  </Link>
                  <Link href="/dashboard/jobs/new">
                    <Button variant="primary" size="sm">
                      Post Job
                    </Button>
                  </Link>
                </>
              )}
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Job Listings</h1>
            <p className="text-gray-600">
              Browse available job opportunities and find your next career move
            </p>
          </div>

          {/* AI Job Discovery for Job Seekers */}
          {isJobSeeker && resumes.length > 0 && (
            <div className="mb-6">
              {searchParams.discover !== "true" && (
                <Suspense fallback={<div className="bg-blue-50 p-4 rounded-lg">Loading...</div>}>
                  <AIJobDiscovery resumes={resumes} />
                </Suspense>
              )}
              {searchParams.discover === "true" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    🔍 Discovering jobs based on your resume... This may take a moment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <form method="get" className="grid md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={searchParams.search}
                  placeholder="Job title, company..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  defaultValue={searchParams.location}
                  placeholder="City, State..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  defaultValue={searchParams.jobType || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button type="submit" variant="primary" className="w-full">
                  Filter
                </Button>
              </div>
            </form>
          </div>

          {/* Discovery Error */}
          {discoveryError && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Job Discovery Error</h3>
                  <p className="text-red-800 mb-4">
                    {discoveryError}
                  </p>
                  {discoveryError.includes("quota") && (
                    <div className="bg-white border border-red-200 rounded p-3 mb-4">
                      <p className="text-sm text-red-700 mb-2">
                        <strong>To fix this:</strong>
                      </p>
                      <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                        <li>Check your OpenAI API usage at <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/usage</a></li>
                        <li>Add billing information if needed</li>
                        <li>Wait for your quota to reset, or upgrade your plan</li>
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href="/dashboard/jobs">
                      <Button variant="secondary" size="sm">
                        Clear and Browse Posted Jobs
                      </Button>
                    </Link>
                    {discoveryError.includes("quota") && (
                      <a
                        href="https://platform.openai.com/account/billing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button variant="primary" size="sm">
                          Check OpenAI Billing
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Discovered Jobs */}
          {aiJobs.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    🤖 AI-Discovered Jobs for You
                  </h2>
                  <p className="text-gray-600">
                    These jobs were discovered based on your resume skills and experience
                  </p>
                </div>
                <Link href="/dashboard/jobs">
                  <Button variant="secondary" size="sm">
                    Clear Discovery
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {aiJobs.map((job, index) => (
                  <JobCard
                    key={`ai-${index}`}
                    job={{
                      id: `ai-${index}`,
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      jobType: job.jobType,
                      description: job.description,
                    }}
                    isAIDiscovered={true}
                  />
                ))}
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-black mb-4">Posted Jobs</h2>
              </div>
            </div>
          )}

          {/* Posted Jobs List */}
          <div className="space-y-4">
            {jobs.length === 0 && aiJobs.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500 text-lg">
                  No jobs found. {(isAdmin || isRecruiter) && "Create or import your first job posting!"}
                  {isJobSeeker && resumes.length === 0 && " Upload a resume to discover AI-recommended jobs!"}
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={{
                    id: job.id,
                    title: job.title,
                    company: job.company || undefined,
                    location: job.location || undefined,
                    jobType: job.jobType,
                    description: job.description,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

