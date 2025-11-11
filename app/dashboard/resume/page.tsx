import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getUserResumes } from "@/actions/resume-actions";
import { ResumeUpload } from "@/components/features/resume-upload";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function ResumePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const resumes = await getUserResumes();

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
              <span className="text-gray-700">Resumes</span>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">My Resumes</h1>
            <p className="text-gray-600">
              Upload and manage your resumes. We'll extract key information to help match you with jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload New Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeUpload />
              </CardContent>
            </Card>

            {/* Existing Resumes */}
            <Card>
              <CardHeader>
                <CardTitle>Your Resumes ({resumes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No resumes uploaded yet. Upload your first resume to get started!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {resumes.map((resume) => {
                      const parsed = resume.parsed as any;
                      return (
                        <div
                          key={resume.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {resume.fileName}
                              </h3>
                              {parsed?.personalInfo?.name && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {parsed.personalInfo.name}
                                </p>
                              )}
                              {parsed?.skills && parsed.skills.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {parsed.skills.slice(0, 5).map((skill: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {parsed.skills.length > 5 && (
                                      <span className="px-2 py-1 text-gray-500 text-xs">
                                        +{parsed.skills.length - 5} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View PDF
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

