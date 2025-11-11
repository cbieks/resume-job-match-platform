import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { discoverJobsForUser } from "@/actions/job-discovery-actions";
import { getUserResumes } from "@/actions/resume-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function AIDiscoveredJobPage({
  params,
  searchParams,
}: {
  params: { index: string };
  searchParams: { resumeId?: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const resumes = await getUserResumes();
  if (resumes.length === 0) {
    redirect("/dashboard/resume");
  }

  const resumeId = searchParams.resumeId || resumes[0].id;
  const discoveryResult = await discoverJobsForUser(resumeId);

  if (!discoveryResult.jobs || discoveryResult.jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <Link href="/dashboard/jobs">
            <Button variant="primary">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const jobIndex = parseInt(params.index);
  const job = discoveryResult.jobs[jobIndex];

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <Link href="/dashboard/jobs">
            <Button variant="primary">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatJobType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

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
              <span className="text-gray-700">{job.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full font-semibold">
                AI Recommended
              </span>
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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Job Header */}
          <Card className="border-2 border-blue-300 bg-blue-50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2 text-black">{job.title}</CardTitle>
                  <div className="text-sm text-gray-600 space-y-1">
                    {job.company && <p className="font-medium">{job.company}</p>}
                    <div className="flex flex-wrap gap-4">
                      {job.location && <span>📍 {job.location}</span>}
                      <span>💼 {formatJobType(job.jobType)}</span>
                      {job.yearsOfExperience && (
                        <span>📅 {job.yearsOfExperience}+ years experience</span>
                      )}
                      {(job.salaryMin || job.salaryMax) && (
                        <span>
                          💰 ${job.salaryMin?.toLocaleString() || "N/A"} - $
                          {job.salaryMax?.toLocaleString() || "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/jobs">
                  <Button variant="secondary" size="sm">
                    Back to Jobs
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Required Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Box */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is an AI-generated job recommendation based on your
                resume. This job posting was created to help you discover opportunities that match
                your skills and experience. To apply, you may need to search for similar positions
                on job boards or company websites.
              </p>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4">
            <Link href="/dashboard/jobs">
              <Button variant="secondary">Back to Jobs</Button>
            </Link>
            <Link href="/dashboard/jobs?discover=true&resumeId=${resumeId}">
              <Button variant="primary">Discover More Jobs</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

