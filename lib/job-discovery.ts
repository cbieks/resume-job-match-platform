import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface DiscoveredJob {
  title: string;
  company: string;
  location: string;
  jobType: string;
  description: string;
  requiredSkills: string[];
  yearsOfExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  source: "ai-generated";
}

/**
 * Discover jobs based on resume data using AI
 */
export async function discoverJobsFromResume(
  resumeData: {
    skills: string[];
    experience: Array<{
      title?: string;
      company?: string;
      duration?: string;
      description?: string;
    }>;
    education: Array<{
      degree?: string;
      school?: string;
      year?: string;
    }>;
    summary?: string;
  },
  count: number = 5
): Promise<DiscoveredJob[]> {
  try {
    // Build resume summary for AI
    const skillsList = resumeData.skills.join(", ");
    const experienceSummary = resumeData.experience
      .map((exp) => `${exp.title || "Position"} at ${exp.company || "Company"}`)
      .join(", ");
    const educationSummary = resumeData.education
      .map((edu) => `${edu.degree || "Degree"}`)
      .join(", ");

    const resumeSummary = `
Skills: ${skillsList}
Experience: ${experienceSummary}
Education: ${educationSummary}
Summary: ${resumeData.summary || "No summary available"}
`;

    const prompt = `Based on the following resume information, generate ${count} realistic job postings that would be a good match for this candidate. 

Resume Information:
${resumeSummary}

Generate job postings with the following structure for each job:
- title: Job title (realistic, matches their skills)
- company: Company name (use realistic company names, mix of well-known and smaller companies)
- location: Location (mix of locations, include some remote options)
- jobType: One of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE, HYBRID
- description: Detailed job description (2-3 paragraphs) explaining the role, responsibilities, and requirements
- requiredSkills: Array of 5-10 relevant skills (should overlap with candidate's skills but also include some they might not have)
- yearsOfExperience: Number of years required (should match candidate's experience level)
- salaryMin: Minimum salary in USD (realistic for the role and location)
- salaryMax: Maximum salary in USD (realistic for the role and location)

Make the jobs realistic and varied. Some should be a perfect match, others should be stretch opportunities. Include a mix of job types and locations.

Return ONLY valid JSON array, no additional text or markdown formatting. Format:
[
  {
    "title": "...",
    "company": "...",
    "location": "...",
    "jobType": "FULL_TIME",
    "description": "...",
    "requiredSkills": ["skill1", "skill2", ...],
    "yearsOfExperience": 3,
    "salaryMin": 80000,
    "salaryMax": 120000
  },
  ...
]`;

    let response;
    try {
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a job market expert. Generate realistic job postings based on candidate resumes. Return only valid JSON arrays.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      });
    } catch (openaiError: any) {
      // Handle OpenAI API errors specifically
      if (openaiError?.status === 429 || openaiError?.message?.toLowerCase().includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your API key usage and billing settings.");
      }
      if (openaiError?.status === 401 || openaiError?.message?.toLowerCase().includes("invalid api key")) {
        throw new Error("Invalid OpenAI API key. Please check your .env.local file.");
      }
      throw openaiError;
    }

    const content = response.choices[0].message.content?.trim();
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Remove markdown code blocks if present
    const jsonContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const jobs = JSON.parse(jsonContent) as DiscoveredJob[];

    // Add source and validate
    return jobs.map((job) => ({
      ...job,
      source: "ai-generated" as const,
      requiredSkills: Array.isArray(job.requiredSkills)
        ? job.requiredSkills.filter((s: any) => typeof s === "string")
        : [],
    }));
  } catch (error: any) {
    console.error("Error discovering jobs:", error);
    
    // Check for specific OpenAI errors
    if (error?.message?.includes("quota") || error?.message?.includes("rate limit") || error?.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API key usage and billing settings.");
    }
    
    if (error?.message?.includes("Invalid API key") || error?.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your .env.local file.");
    }
    
    // Re-throw with a user-friendly message
    throw new Error(error?.message || "Failed to discover jobs. Please try again later.");
  }
}

