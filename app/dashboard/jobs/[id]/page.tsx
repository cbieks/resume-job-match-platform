import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getJob } from "@/actions/job-actions";
import { getUserResumes } from "@/actions/resume-actions";
import { matchResumeToJob } from "@/actions/match-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { JobMatchButton } from "@/components/features/job-match-button";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const job = await getJob(params.id);
  const resumes = await getUserResumes();

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

  const requiredSkills = (job.requiredSkills as any) || [];

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
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
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
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Required Skills */}
          {requiredSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((skill: string, index: number) => (
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

          {/* Match Resume Section */}
          {resumes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Match Your Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  See how well your resume matches this job posting
                </p>
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <JobMatchButton
                      key={resume.id}
                      resumeId={resume.id}
                      jobId={job.id}
                      resumeName={resume.fileName}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {resumes.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Upload a resume to see how well it matches this job
                </p>
                <Link href="/dashboard/resume">
                  <Button variant="primary">Upload Resume</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

