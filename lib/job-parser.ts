import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ParsedJob {
  title: string;
  description: string;
  company?: string;
  location?: string;
  jobType?: string;
  requiredSkills: string[];
  yearsOfExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
}

/**
 * Parse job description using OpenAI to extract structured data
 */
export async function parseJobDescription(
  jobDescription: string
): Promise<ParsedJob> {
  try {
    const prompt = `Parse the following job description and extract structured information. Return a JSON object with the following fields:
- title: string (job title)
- description: string (full job description)
- company: string | null (company name if mentioned)
- location: string | null (location if mentioned, e.g., "San Francisco, CA" or "Remote")
- jobType: string | null (one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE, HYBRID)
- requiredSkills: string[] (array of technical skills, programming languages, frameworks, tools mentioned)
- yearsOfExperience: number | null (years of experience required if mentioned)
- salaryMin: number | null (minimum salary if mentioned, as a number without currency symbols)
- salaryMax: number | null (maximum salary if mentioned, as a number without currency symbols)

Job Description:
${jobDescription}

Return ONLY valid JSON, no additional text or markdown formatting.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a job description parser. Extract structured data from job descriptions and return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content?.trim();
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const parsed = JSON.parse(jsonContent) as ParsedJob;

    // Validate and clean up the parsed data
    return {
      title: parsed.title || "Untitled Position",
      description: parsed.description || jobDescription,
      company: parsed.company || undefined,
      location: parsed.location || undefined,
      jobType: parsed.jobType || "FULL_TIME",
      requiredSkills: Array.isArray(parsed.requiredSkills)
        ? parsed.requiredSkills.filter((s: any) => typeof s === "string")
        : [],
      yearsOfExperience: parsed.yearsOfExperience || undefined,
      salaryMin: parsed.salaryMin || undefined,
      salaryMax: parsed.salaryMax || undefined,
    };
  } catch (error) {
    console.error("Error parsing job description:", error);
    // Fallback: return basic structure with the description
    return {
      title: extractTitle(jobDescription),
      description: jobDescription,
      requiredSkills: extractSkills(jobDescription),
      jobType: extractJobType(jobDescription),
      location: extractLocation(jobDescription),
    };
  }
}

/**
 * Extract job title from description (fallback)
 */
function extractTitle(description: string): string {
  const lines = description.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 100 && !firstLine.toLowerCase().includes("description")) {
      return firstLine;
    }
  }
  return "Untitled Position";
}

/**
 * Extract skills from job description (fallback)
 */
function extractSkills(description: string): string[] {
  const skillKeywords = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust", "PHP",
    "React", "Vue", "Angular", "Node.js", "Express", "Django", "Flask", "Spring",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "AWS", "Azure", "Docker", "Kubernetes",
    "Git", "Linux", "HTML", "CSS", "REST", "GraphQL", "Machine Learning", "AI", "Data Science",
  ];

  const skills: string[] = [];
  const lowerDescription = description.toLowerCase();

  skillKeywords.forEach((skill) => {
    if (lowerDescription.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });

  return skills;
}

/**
 * Extract job type from description (fallback)
 */
function extractJobType(description: string): string {
  const lowerDescription = description.toLowerCase();
  if (lowerDescription.includes("remote")) return "REMOTE";
  if (lowerDescription.includes("part-time") || lowerDescription.includes("part time"))
    return "PART_TIME";
  if (lowerDescription.includes("contract")) return "CONTRACT";
  if (lowerDescription.includes("internship")) return "INTERNSHIP";
  if (lowerDescription.includes("hybrid")) return "HYBRID";
  return "FULL_TIME";
}

/**
 * Extract location from description (fallback)
 */
function extractLocation(description: string): string | undefined {
  // Look for common location patterns
  const locationPatterns = [
    /(San Francisco|New York|Los Angeles|Chicago|Boston|Seattle|Austin|Denver|Portland|Miami|Atlanta|Dallas|Houston|Philadelphia|Washington DC)[\s,]*([A-Z]{2})?/i,
    /(Remote|Hybrid|On-site|Onsite)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return undefined;
}

