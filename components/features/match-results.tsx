"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MatchResultsProps {
  match: {
    overallScore: number;
    semanticScore: number;
    skillsScore: number;
    details?: {
      matchedSkills: string[];
      missingSkills: string[];
    };
    feedback?: string;
  };
  job: {
    id: string;
    title: string;
    company?: string;
    description: string;
    requiredSkills: string[];
  };
  resume: {
    id: string;
    fileName: string;
    parsed: any;
  };
}

export function MatchResults({ match, job, resume }: MatchResultsProps) {
  const chartData = [
    { name: "Overall", score: Math.round(match.overallScore * 100) },
    { name: "Semantic", score: Math.round(match.semanticScore * 100) },
    { name: "Skills", score: Math.round(match.skillsScore * 100) },
  ];

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
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className={`${getScoreBgColor(match.overallScore)} border-2`}>
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Overall Match Score:{" "}
            <span className={getScoreColor(match.overallScore)}>
              {Math.round(match.overallScore * 100)}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-700">
            <p className="text-lg">
              Your resume matches{" "}
              <strong>{Math.round(match.overallScore * 100)}%</strong> with this job
              posting.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Semantic Similarity</p>
              <p className="text-2xl font-bold">
                {Math.round(match.semanticScore * 100)}%
              </p>
              <p className="text-xs text-gray-500">60% weight</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Skills Match</p>
              <p className="text-2xl font-bold">
                {Math.round(match.skillsScore * 100)}%
              </p>
              <p className="text-xs text-gray-500">30% weight</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p className="text-2xl font-bold">N/A</p>
              <p className="text-xs text-gray-500">10% weight</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Comparison */}
      {match.details && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">
                Matched Skills ({match.details.matchedSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {match.details.matchedSkills.length > 0 ? (
                  match.details.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills matched</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">
                Missing Skills ({match.details.missingSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {match.details.missingSkills.length > 0 ? (
                  match.details.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No missing skills - Great job!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback */}
      {match.feedback && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{match.feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

