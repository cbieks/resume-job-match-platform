import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCandidatesForRecruiter } from "@/actions/recruiter-actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: { jobId?: string };
}) {
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

  const allMatches = await getCandidatesForRecruiter();
  
  // Filter by jobId if provided
  const matches = searchParams.jobId
    ? allMatches.filter((match) => match.jobId === searchParams.jobId)
    : allMatches;

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return "bg-green-100 border-green-300";
    if (score >= 0.6) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
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
              <span className="text-gray-700">Candidates</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/recruiter/jobs">
                <Button variant="secondary" size="sm">
                  My Jobs
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
            <h1 className="text-3xl font-bold text-black mb-2">Candidate Matches</h1>
            <p className="text-gray-600">
              View candidates who have matched with your job postings
            </p>
          </div>

          {matches.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  No candidates have matched with your jobs yet.
                </p>
                <Link href="/dashboard/recruiter/jobs">
                  <Button variant="primary">View My Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                const scorePercentage = Math.round(match.overallScore * 100);
                return (
                  <Card
                    key={match.id}
                    className={`${getScoreBgColor(match.overallScore)} border-2 hover:shadow-lg transition-shadow`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {match.resume.user.name || match.resume.user.email}
                          </CardTitle>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium">📄 Resume: {match.resume.fileName}</p>
                            <p className="font-medium">💼 Job: {match.job.title}</p>
                            {match.job.company && (
                              <p className="font-medium">🏢 Company: {match.job.company}</p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-2">
                              <span>📧 {match.resume.user.email}</span>
                              <span>📅 Matched: {new Date(match.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-3xl font-bold ${getScoreColor(match.overallScore)}`}
                          >
                            {scorePercentage}%
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Match Score</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Semantic Score</p>
                          <p className="text-lg font-semibold">
                            {Math.round(match.semanticScore * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Skills Score</p>
                          <p className="text-lg font-semibold">
                            {Math.round(match.skillsScore * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Details</p>
                          {match.details && (
                            <p className="text-sm text-gray-700">
                              {((match.details as any).matchedSkills?.length || 0)} matched,{" "}
                              {((match.details as any).missingSkills?.length || 0)} missing
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/jobs/${match.jobId}/match/${match.resumeId}`}>
                          <Button variant="primary" size="sm">
                            View Full Match Details
                          </Button>
                        </Link>
                        <Link href={`/dashboard/jobs/${match.jobId}`}>
                          <Button variant="secondary" size="sm">
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

