"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MatchResultsProps {
  match: {
    overallScore: number;
    semanticScore: number;
    skillsScore: number;
    details?: {
      matchedSkills: string[];
      missingSkills: string[];
    };
  };
}

export function MatchResults({ match }: MatchResultsProps) {
  const chartData = [
    { name: "Overall", score: Math.round(match.overallScore * 100) },
    { name: "Semantic", score: Math.round(match.semanticScore * 100) },
    { name: "Skills", score: Math.round(match.skillsScore * 100) },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Match Score: {Math.round(match.overallScore * 100)}%</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {match.details && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Matched Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {match.details.matchedSkills.length > 0 ? (
                  match.details.matchedSkills.map((skill, index) => (
                    <li key={index} className="text-green-700">
                      {skill}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No skills matched</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Missing Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {match.details.missingSkills.length > 0 ? (
                  match.details.missingSkills.map((skill, index) => (
                    <li key={index} className="text-red-700">
                      {skill}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No missing skills</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

