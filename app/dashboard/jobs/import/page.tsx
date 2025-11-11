import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobImportForm } from "@/components/features/job-import-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ImportJobPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user is admin or recruiter
  const user = await prisma.user.findUnique({
    where: { id: session.user?.id as string },
  });

  if (user?.role !== "ADMIN" && user?.role !== "RECRUITER") {
    redirect("/dashboard/jobs");
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
              <span className="text-gray-700">Import Job</span>
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
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Import Job</h1>
            <p className="text-gray-600">
              Import a job posting from a URL or paste a job description. We'll automatically extract the details.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <JobImportForm />
          </div>
        </div>
      </main>
    </div>
  );
}

