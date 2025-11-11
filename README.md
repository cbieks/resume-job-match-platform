# AI Resume & Job Match Platform

An intelligent web application that uses AI to match job seekers' resumes with job opportunities. Upload your resume, and my platform automatically extracts key information, compares it against job descriptions using semantic similarity and skill matching, and provides detailed match scores with actionable feedback.

## What It Does

This platform helps both job seekers and recruiters:

- **For Job Seekers**: Upload your resume and instantly see how well it matches available job postings, with detailed feedback on strengths and areas for improvement.
- **For Recruiters**: Post job openings and automatically receive ranked candidate matches based on AI-powered analysis.

## Key Features

### Resume Management
- **PDF Upload**: Simply upload your resume in PDF format
- **Automatic Parsing**: AI extracts key information including:
  - Contact information (name, email, phone)
  - Skills and technologies
  - Work experience
  - Education history
- **Resume Storage**: Securely store and manage multiple resume versions

### Job Matching
- **AI-Powered Matching**: Uses OpenAI embeddings to understand semantic meaning
- **Multi-Factor Scoring**:
  - **Semantic Similarity** (60%): How well your resume's meaning matches the job description
  - **Skills Match** (30%): Direct comparison of required vs. possessed skills
  - **Experience Match** (10%): Years of experience alignment
- **Detailed Feedback**: See exactly which skills match, which are missing, and get recommendations

### User Experience
- **Clean Dashboard**: Easy-to-use interface for managing resumes and viewing matches
- **Visual Results**: Charts and graphs showing match breakdowns
- **Secure Authentication**: Safe sign-up and login system
- **Real-time Updates**: Instant feedback after uploading resumes or running matches

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI/ML**: OpenAI Embeddings API for semantic matching
- **PDF Processing**: Custom PDF parsing with text extraction
- **Visualization**: Recharts for data visualization

## How to Use

### For Job Seekers

1. **Sign Up**: Create a free account
2. **Upload Resume**: Go to your dashboard and upload your resume (PDF format)
3. **Browse Jobs**: Explore available job postings
4. **View Matches**: Click "Match Resume" on any job to see your compatibility score
5. **Review Feedback**: See detailed breakdown of:
   - Overall match percentage
   - Skills you have vs. skills needed
   - Recommendations for improvement

### For Recruiters/Admins

1. **Sign Up as Admin**: Create an admin account
2. **Post Jobs**: Add job postings with descriptions and required skills
3. **View Matches**: See how candidates' resumes match your job requirements
4. **Review Candidates**: Access detailed match analysis for each candidate

## Match Score Breakdown

When you match a resume to a job, you'll see:

- **Overall Score**: A percentage showing overall compatibility (0-100%)
- **Semantic Score**: How well the resume's content matches the job description's meaning
- **Skills Score**: Percentage of required skills that match
- **Matched Skills**: List of skills you have that the job requires
- **Missing Skills**: Skills the job requires that you don't have (yet!)

## Security & Privacy

- Secure password hashing
- Session-based authentication
- File upload validation
- User data protection
- GDPR-compliant data handling

## Future Enhancements

- Email notifications for new matching jobs
- Advanced resume editing capabilities
- Integration with job boards
- Resume templates and suggestions
- Interview preparation tips based on job requirements

## Design Highlights

- Modern, responsive design that works on all devices
- Intuitive user interface
- Clean data visualization
- Fast and efficient performance

---

**Built with modern web technologies to demonstrate full-stack development skills, AI integration, and user-centered design.**
