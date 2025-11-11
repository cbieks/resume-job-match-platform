import { OpenAI } from "openai";
import similarity from "compute-cosine-similarity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Compute Jaccard similarity between two sets
 */
export function jaccardIndex(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Normalize skills array (lowercase, trim, remove duplicates)
 */
export function normalizeSkills(skills: string[]): string[] {
  return Array.from(
    new Set(skills.map((skill) => skill.toLowerCase().trim()).filter(Boolean))
  );
}

/**
 * Compute match score between resume and job description
 */
export async function computeMatch(
  resumeText: string,
  jobDescription: string,
  resumeSkills: string[],
  jobSkills: string[]
): Promise<{
  semanticScore: number;
  skillsScore: number;
  overallScore: number;
  details: {
    matchedSkills: string[];
    missingSkills: string[];
  };
}> {
  // Generate embeddings
  const [resumeEmbedding, jobEmbedding] = await Promise.all([
    openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: resumeText,
    }),
    openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: jobDescription,
    }),
  ]);

  // Compute cosine similarity
  const semanticScore = similarity(
    resumeEmbedding.data[0].embedding,
    jobEmbedding.data[0].embedding
  ) as number;

  // Normalize and compute Jaccard similarity for skills
  const normalizedResumeSkills = normalizeSkills(resumeSkills);
  const normalizedJobSkills = normalizeSkills(jobSkills);
  const skillsSetA = new Set(normalizedResumeSkills);
  const skillsSetB = new Set(normalizedJobSkills);
  const skillsScore = jaccardIndex(skillsSetA, skillsSetB);

  // Find matched and missing skills
  const matchedSkills = normalizedResumeSkills.filter((skill) =>
    skillsSetB.has(skill)
  );
  const missingSkills = normalizedJobSkills.filter(
    (skill) => !skillsSetA.has(skill)
  );

  // Combine scores with weights
  const overallScore = 0.6 * semanticScore + 0.3 * skillsScore + 0.1 * 1.0; // 0.1 for experience (placeholder)

  return {
    semanticScore: Math.max(0, Math.min(1, semanticScore)),
    skillsScore,
    overallScore: Math.max(0, Math.min(1, overallScore)),
    details: {
      matchedSkills,
      missingSkills,
    },
  };
}

