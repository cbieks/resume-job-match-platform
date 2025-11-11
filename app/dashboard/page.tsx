import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getMyJobs } from "@/actions/recruiter-actions";
import { getUserResumes } from "@/actions/resume-actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Get user role
  const user = await prisma.user.findUnique({
    where: { id: session.user?.id as string },
  });

  const isRecruiter = user?.role === "RECRUITER" || user?.role === "ADMIN";
  const isJobSeeker = user?.role === "USER";

  // Fetch data based on role
  const myJobs = isRecruiter ? await getMyJobs() : [];
  const myResumes = isJobSeeker ? await getUserResumes() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Resume Match Platform</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {session.user?.name || session.user?.email}
              </span>
              {isRecruiter && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {user?.role === "ADMIN" ? "Admin" : "Recruiter"}
                </span>
              )}
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
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Welcome to your Dashboard{isRecruiter ? ", Recruiter" : ""}!
            </h2>
            <p className="text-gray-600 mb-6">
              {isRecruiter
                ? "Manage your job postings and view candidate matches"
                : "You're successfully logged in. Here's what you can do:"}
            </p>

            {/* Recruiter Dashboard */}
            {isRecruiter && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/jobs/new">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border-2 border-blue-200">
                    <h3 className="text-lg font-semibold mb-2">📝 Post Job</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Create a new job posting manually
                    </p>
                    <Button variant="primary" size="sm">
                      Post Now
                    </Button>
                  </div>
                </Link>
                <Link href="/dashboard/jobs/import">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border-2 border-purple-200">
                    <h3 className="text-lg font-semibold mb-2">📥 Import Job</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Import job from URL or description
                    </p>
                    <Button variant="primary" size="sm">
                      Import Now
                    </Button>
                  </div>
                </Link>
                <Link href="/dashboard/recruiter/jobs">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border-2 border-green-200">
                    <h3 className="text-lg font-semibold mb-2">💼 My Jobs</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      View and manage your job postings ({myJobs.length})
                    </p>
                    <Button variant="primary" size="sm">
                      View Jobs
                    </Button>
                  </div>
                </Link>
                <Link href="/dashboard/recruiter/candidates">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border-2 border-yellow-200">
                    <h3 className="text-lg font-semibold mb-2">👥 Candidates</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      View candidates who matched with your jobs
                    </p>
                    <Button variant="primary" size="sm">
                      View Candidates
                    </Button>
                  </div>
                </Link>
              </div>
            )}

            {/* Job Seeker Dashboard */}
            {isJobSeeker && (
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/dashboard/resume">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                    <h3 className="text-lg font-semibold mb-2">📄 Upload Resume</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Upload your resume to get started with job matching
                      {myResumes.length > 0 && (
                        <span className="block mt-1 text-blue-600">
                          ({myResumes.length} resume{myResumes.length > 1 ? "s" : ""} uploaded)
                        </span>
                      )}
                    </p>
                    <Button variant="primary" size="sm">
                      Upload Now
                    </Button>
                  </div>
                </Link>
                <Link href="/dashboard/jobs">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                    <h3 className="text-lg font-semibold mb-2">🔍 Browse Jobs</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Explore available job opportunities
                    </p>
                    <Button variant="primary" size="sm">
                      Browse Now
                    </Button>
                  </div>
                </Link>
                <Link href="/dashboard/matches">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                    <h3 className="text-lg font-semibold mb-2">🎯 View Matches</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      See how your resume matches with jobs
                    </p>
                    <Button variant="primary" size="sm">
                      View Now
                    </Button>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

