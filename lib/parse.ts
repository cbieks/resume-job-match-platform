/**
 * Resume parsing utilities
 * Supports Affinda API and custom parsing
 */

export interface ParsedResume {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  education: Array<{
    degree?: string;
    school?: string;
    year?: string;
    field?: string;
  }>;
  experience: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }>;
  skills: string[];
  languages: string[];
  summary?: string;
}

/**
 * Parse resume using Affinda API
 */
export async function parseResumeWithAffinda(
  file: File
): Promise<ParsedResume> {
  // TODO: Implement Affinda API integration
  // This is a placeholder implementation
  throw new Error("Affinda API parsing not implemented yet");
}

/**
 * Parse resume using custom parser (basic text extraction)
 */
export async function parseResumeCustom(
  file: File
): Promise<ParsedResume> {
  try {
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to use pdf-parse if available, otherwise use basic extraction
    let text = "";
    try {
      // pdf-parse v2 uses a class-based API
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      text = textResult.text; // Get the full text
      await parser.destroy(); // Clean up
    } catch (error) {
      // Fallback: return basic structure with file info
      console.warn("PDF parsing library not available, using basic extraction", error);
      text = `Resume: ${file.name}`;
    }

    // Basic text extraction and parsing
    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const email = emailMatch ? emailMatch[0] : undefined;

    // Extract phone (basic patterns)
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : undefined;

    // Extract name (first line or before email)
    let name: string | undefined;
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length < 50 && !firstLine.includes("@")) {
        name = firstLine;
      }
    }

    // Extract skills (common tech skills keywords)
    const skillKeywords = [
      "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "React", "Vue", "Angular",
      "Node.js", "Express", "Django", "Flask", "Spring", "SQL", "PostgreSQL", "MySQL", "MongoDB",
      "AWS", "Azure", "Docker", "Kubernetes", "Git", "Linux", "HTML", "CSS", "REST", "GraphQL",
      "Machine Learning", "AI", "Data Science", "Agile", "Scrum"
    ];
    const skills: string[] = [];
    const lowerText = text.toLowerCase();
    skillKeywords.forEach((skill) => {
      if (lowerText.includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });

    return {
      personalInfo: {
        name,
        email,
        phone,
      },
      education: [],
      experience: [],
      skills,
      languages: [],
      summary: text.substring(0, 500), // First 500 chars as summary
    };
  } catch (error) {
    console.error("Error parsing resume:", error);
    // Return minimal structure on error
    return {
      personalInfo: {},
      education: [],
      experience: [],
      skills: [],
      languages: [],
      summary: `Error parsing resume: ${error}`,
    };
  }
}

/**
 * Parse resume (tries Affinda first, falls back to custom)
 */
export async function parseResume(file: File): Promise<ParsedResume> {
  const useAffinda = !!process.env.AFFINDA_API_KEY;

  try {
    if (useAffinda) {
      return await parseResumeWithAffinda(file);
    } else {
      return await parseResumeCustom(file);
    }
  } catch (error) {
    console.error("Resume parsing error:", error);
    // Fallback to custom parsing if Affinda fails
    if (useAffinda) {
      return await parseResumeCustom(file);
    }
    throw error;
  }
}

