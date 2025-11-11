import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

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
            <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h2>
            <p className="text-gray-600 mb-6">
              You're successfully logged in. Here's what you can do:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/dashboard/resume">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload your resume to get started with job matching
                  </p>
                  <Button variant="primary" size="sm">
                    Upload Now
                  </Button>
                </div>
              </Link>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Browse Jobs</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explore available job opportunities
                </p>
                <Button variant="primary" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">View Matches</h3>
                <p className="text-gray-600 text-sm mb-4">
                  See how your resume matches with jobs
                </p>
                <Button variant="primary" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

