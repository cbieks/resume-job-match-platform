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

    // Extract skills (expanded list of common tech skills keywords)
    const skillKeywords = [
      // Programming Languages
      "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust", "PHP",
      "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Lua", "Dart",
      // Frontend
      "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "Redux", "MobX",
      "Webpack", "Vite", "Babel", "HTML", "CSS", "SASS", "SCSS", "Less", "Tailwind CSS",
      "Bootstrap", "Material-UI", "Ant Design", "Chakra UI",
      // Backend
      "Node.js", "Express", "Fastify", "Nest.js", "Django", "Flask", "FastAPI", "Spring",
      "Spring Boot", "ASP.NET", "Laravel", "Symfony", "Rails", "Phoenix", "Gin", "Echo",
      // Databases
      "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra",
      "DynamoDB", "Firebase", "Supabase", "SQLite", "Oracle", "SQL Server",
      // Cloud & DevOps
      "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Ansible",
      "Jenkins", "GitLab CI", "GitHub Actions", "CircleCI", "Travis CI", "Vercel", "Netlify",
      // Tools & Version Control
      "Git", "SVN", "Mercurial", "Linux", "Unix", "Bash", "Shell Scripting", "PowerShell",
      // APIs & Protocols
      "REST", "GraphQL", "gRPC", "WebSocket", "SOAP", "RPC",
      // Testing
      "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Playwright", "Vitest", "JUnit",
      // Mobile
      "React Native", "Flutter", "Ionic", "Xamarin", "Android", "iOS", "SwiftUI", "Jetpack Compose",
      // Data Science & AI
      "Machine Learning", "ML", "AI", "Data Science", "TensorFlow", "PyTorch", "Scikit-learn",
      "Pandas", "NumPy", "Jupyter", "Data Analysis", "Big Data", "Hadoop", "Spark",
      // Other
      "Agile", "Scrum", "Kanban", "JIRA", "Confluence", "Microservices", "Serverless",
      "GraphQL", "WebRTC", "Blockchain", "Solidity", "Ethereum", "Smart Contracts",
    ];
    
    const skills: string[] = [];
    const lowerText = text.toLowerCase();
    const foundSkills = new Set<string>(); // Use Set to avoid duplicates
    
    skillKeywords.forEach((skill) => {
      const skillLower = skill.toLowerCase();
      // Check for exact word match or as part of a word (for compound terms)
      const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text) && !foundSkills.has(skill)) {
        skills.push(skill);
        foundSkills.add(skill);
      }
    });

    // Extract education (look for common degree patterns and school names)
    const education: Array<{ degree?: string; school?: string; year?: string; field?: string }> = [];
    const degreePatterns = [
      /(Bachelor|Master|Doctor|PhD|Ph\.D\.|B\.S\.|B\.A\.|M\.S\.|M\.A\.|MBA|Associate)[\s\w]*/gi,
      /(Bachelor of Science|Bachelor of Arts|Master of Science|Master of Arts)[\s\w]*/gi,
    ];
    
    const educationLines = lines.filter((line) => {
      const lineLower = line.toLowerCase();
      return (
        lineLower.includes("university") ||
        lineLower.includes("college") ||
        lineLower.includes("school") ||
        lineLower.includes("degree") ||
        degreePatterns.some((pattern) => pattern.test(line))
      );
    });
    
    educationLines.slice(0, 5).forEach((line) => {
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      education.push({
        degree: line.substring(0, 100),
        year: yearMatch ? yearMatch[0] : undefined,
      });
    });

    // Extract experience (look for job titles and companies)
    const experience: Array<{ title?: string; company?: string; duration?: string; description?: string }> = [];
    const jobTitlePatterns = [
      /(Software Engineer|Developer|Programmer|Architect|Manager|Director|Lead|Senior|Junior|Intern)/gi,
      /(Engineer|Developer|Designer|Analyst|Specialist|Consultant|Coordinator)/gi,
    ];
    
    const experienceLines = lines.filter((line, index) => {
      const lineLower = line.toLowerCase();
      return (
        jobTitlePatterns.some((pattern) => pattern.test(line)) ||
        (index > 0 && (lineLower.includes("inc") || lineLower.includes("llc") || lineLower.includes("corp")))
      );
    });
    
    experienceLines.slice(0, 10).forEach((line, index) => {
      const durationMatch = line.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\w]*\d{4}/gi);
      experience.push({
        title: line.substring(0, 100),
        duration: durationMatch ? durationMatch[0] : undefined,
      });
    });

    // Extract summary (first paragraph or first 500 chars)
    let summary = text.substring(0, 500);
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 50);
    if (paragraphs.length > 0) {
      summary = paragraphs[0].substring(0, 500);
    }

    return {
      personalInfo: {
        name,
        email,
        phone,
      },
      education,
      experience,
      skills,
      languages: [],
      summary,
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

