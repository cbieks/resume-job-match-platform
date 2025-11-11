import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getMyJobs } from "@/actions/recruiter-actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function MyJobsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user is admin or recruiter
  const user = await prisma.user.findUnique({
    where: { id: session.user?.id as string },
  });

  if (user?.role !== "ADMIN" && user?.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  const jobs = await getMyJobs();

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
              <span className="text-gray-700">My Jobs</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/jobs/new">
                <Button variant="primary" size="sm">
                  Post Job
                </Button>
              </Link>
              <Link href="/dashboard/jobs/import">
                <Button variant="secondary" size="sm">
                  Import Job
                </Button>
              </Link>
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
            <h1 className="text-3xl font-bold text-black mb-2">My Job Postings</h1>
            <p className="text-gray-600">
              Manage your job postings and view candidate matches
            </p>
          </div>

          {jobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  You haven't posted any jobs yet.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/dashboard/jobs/new">
                    <Button variant="primary">Post Your First Job</Button>
                  </Link>
                  <Link href="/dashboard/jobs/import">
                    <Button variant="secondary">Import Job</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <div className="text-sm text-gray-600 space-y-1">
                          {job.company && <p className="font-medium">{job.company}</p>}
                          <div className="flex flex-wrap gap-4">
                            {job.location && <span>📍 {job.location}</span>}
                            <span>💼 {formatJobType(job.jobType)}</span>
                            <span>👥 {job._count.matches} candidate(s)</span>
                            <span>
                              📅 Posted: {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                job.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {job.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/dashboard/recruiter/candidates?jobId=${job.id}`}>
                        <Button variant="secondary" size="sm">
                          View Candidates ({job._count.matches})
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

