# Project Structure

This document outlines the complete project structure for the AI Resume & Job Match Platform.

## Directory Tree

```
resume-job-match-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes (group)
│   │   ├── signin/
│   │   └── signup/
│   ├── (dashboard)/             # Protected dashboard routes (group)
│   │   ├── dashboard/
│   │   ├── resume/
│   │   ├── jobs/
│   │   └── matches/
│   ├── api/                     # API routes
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── features/                # Feature-specific components
│       ├── resume-upload.tsx
│       ├── job-card.tsx
│       └── match-results.tsx
│
├── lib/                         # Utility functions and configurations
│   ├── prisma.ts                # Prisma client singleton
│   ├── auth.ts                  # NextAuth configuration
│   ├── matching.ts              # Matching algorithm
│   ├── storage.ts               # File storage utilities
│   └── parse.ts                 # Resume parsing utilities
│
├── actions/                     # Server actions
│   ├── resume-actions.ts        # Resume CRUD operations
│   ├── job-actions.ts           # Job CRUD operations
│   └── match-actions.ts         # Matching operations
│
├── prisma/                      # Prisma schema and migrations
│   └── schema.prisma            # Database schema
│
├── public/                      # Static assets
│   └── (images, icons, etc.)
│
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── .eslintrc.json               # ESLint configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── README.md                    # Project documentation
├── DOCUMENT_CLARIFICATIONS.md   # Detailed clarifications
└── PROJECT_STRUCTURE.md         # This file
```

## Key Files Explained

### Configuration Files

- **`package.json`**: Dependencies and npm scripts
- **`tsconfig.json`**: TypeScript compiler configuration
- **`next.config.js`**: Next.js configuration (image domains, server actions, etc.)
- **`tailwind.config.ts`**: Tailwind CSS theme and plugin configuration
- **`.env.example`**: Template for environment variables

### App Router (`app/`)

- **`layout.tsx`**: Root layout with metadata and global providers
- **`page.tsx`**: Home page
- **`globals.css`**: Global styles and Tailwind directives
- **`(auth)/`**: Authentication pages (signin, signup) - grouped route
- **`(dashboard)/`**: Protected dashboard pages - grouped route
- **`api/auth/[...nextauth]/route.ts`**: NextAuth API route handler

### Components (`components/`)

- **`ui/`**: Reusable UI components (Button, Card, etc.)
- **`features/`**: Feature-specific components (ResumeUpload, JobCard, MatchResults)

### Libraries (`lib/`)

- **`prisma.ts`**: Prisma client singleton (prevents multiple instances in dev)
- **`auth.ts`**: NextAuth configuration with providers and callbacks
- **`matching.ts`**: AI matching algorithm (embeddings, cosine similarity, Jaccard)
- **`storage.ts`**: File upload utilities (Supabase Storage, AWS S3)
- **`parse.ts`**: Resume parsing utilities (Affinda API, custom parser)

### Server Actions (`actions/`)

- **`resume-actions.ts`**: Resume upload, fetch, delete operations
- **`job-actions.ts`**: Job creation, fetching, filtering operations
- **`match-actions.ts`**: Matching resume to jobs, fetching match results

### Database (`prisma/`)

- **`schema.prisma`**: Database schema definition (User, Resume, Job, Match models)

## Next Steps

1. **Install Dependencies**: Run `npm install`
2. **Set Up Database**: Configure PostgreSQL and run `npm run db:push`
3. **Configure Environment**: Copy `.env.example` to `.env.local` and fill in values
4. **Generate Prisma Client**: Run `npm run db:generate`
5. **Start Development**: Run `npm run dev`

## Feature Implementation Status

- ✅ Project structure
- ✅ Configuration files
- ✅ Database schema
- ✅ Authentication setup (NextAuth)
- ✅ Server actions (resume, job, match)
- ✅ Matching algorithm (basic implementation)
- ⏳ Resume upload UI
- ⏳ Job listing pages
- ⏳ Match results visualization
- ⏳ Admin dashboard
- ⏳ File storage integration
- ⏳ Resume parsing integration

## Notes

- All server actions use `"use server"` directive
- Authentication is handled via NextAuth.js
- Database operations use Prisma ORM
- File uploads will be stored in Supabase Storage or AWS S3
- Resume parsing can use Affinda API or custom implementation
- Matching uses OpenAI embeddings and similarity metrics

