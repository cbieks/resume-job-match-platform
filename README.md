# AI Resume & Job Match Platform

A full-stack web application that allows users to upload résumés, parse their content, compare them against job descriptions using AI and similarity metrics, and return match scores with detailed feedback.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI/ML**: OpenAI Embeddings API, Affinda API (resume parsing)
- **Visualization**: Recharts
- **Storage**: Supabase Storage or AWS S3

## Features

- ✅ User authentication and onboarding
- ✅ Resume upload and storage
- ✅ Resume parsing (structured data extraction)
- ✅ Job postings management
- ✅ AI-powered matching algorithm
- ✅ Match results visualization
- ✅ Admin dashboard and analytics

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or hosted)
- OpenAI API key
- (Optional) Affinda API key for resume parsing

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resume-job-match-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
resume-job-match-platform/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── features/         # Feature-specific components
├── lib/                   # Utility functions and configurations
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   ├── matching.ts       # Matching algorithm
│   └── storage.ts        # File storage utilities
├── actions/               # Server actions
│   ├── resume-actions.ts
│   ├── job-actions.ts
│   └── match-actions.ts
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma
└── public/                # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:studio` - Open Prisma Studio

## Documentation

See [DOCUMENT_CLARIFICATIONS.md](./DOCUMENT_CLARIFICATIONS.md) for detailed explanations of the architecture, features, and implementation details.

## License

MIT

