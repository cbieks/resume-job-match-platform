# Setup Guide

This guide will walk you through setting up the AI Resume & Job Match Platform.

## Step 1: Environment Variables

Create a `.env.local` file in the root directory. You can copy from `.env.example`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

### Required Variables

1. **DATABASE_URL** - PostgreSQL connection string
   - Local: `postgresql://user:password@localhost:5432/resume_matcher?schema=public`
   - Supabase: Get from your Supabase project settings
   - Format: `postgresql://[user]:[password]@[host]:[port]/[database]?schema=public`

2. **NEXTAUTH_SECRET** - Secret key for NextAuth.js
   - Generate with: `openssl rand -base64 32` (on Mac/Linux)
   - Or use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - Or any random 32+ character string

3. **NEXTAUTH_URL** - Your app URL
   - Development: `http://localhost:3000`
   - Production: Your production URL

4. **OPENAI_API_KEY** - OpenAI API key
   - Get from: https://platform.openai.com/api-keys
   - Required for matching algorithm

### Optional Variables

5. **AFFINDA_API_KEY** - For high-quality resume parsing
   - Get from: https://affinda.com
   - If not provided, will use custom parsing (less accurate)

6. **Storage Configuration** (choose one):
   - **Supabase Storage**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - **AWS S3**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`

## Step 2: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE resume_matcher;
   ```
3. Update `DATABASE_URL` in `.env.local`

### Option B: Supabase (Recommended for quick start)

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update `DATABASE_URL` in `.env.local`

### Option C: Other Cloud Providers

- **PlanetScale**: MySQL-compatible, serverless
- **Neon**: Serverless PostgreSQL
- **Railway**: Easy PostgreSQL hosting

## Step 3: Initialize Database

Once your `.env.local` is configured:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

Or use migrations (recommended for production):

```bash
npm run db:migrate
```

## Step 4: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 5: Create First Admin User

You'll need to create an admin user manually in the database or through a script. Here's a quick way:

```bash
# Open Prisma Studio
npm run db:studio
```

Then manually create a user, or use this script:

```typescript
// scripts/create-admin.ts
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const email = 'admin@example.com';
  const password = 'admin123'; // Change this!
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', user);
}

createAdmin();
```

## Troubleshooting

### Database Connection Issues

- Check that PostgreSQL is running
- Verify DATABASE_URL format
- Check firewall/network settings for cloud databases
- Ensure database exists

### NextAuth Issues

- Make sure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your app URL
- Check that user table exists in database

### Prisma Issues

- Run `npm run db:generate` after schema changes
- Use `npm run db:push` for development
- Use `npm run db:migrate` for production

## Next Steps

After setup:
1. ✅ Environment variables configured
2. ✅ Database initialized
3. ⏳ Create authentication pages
4. ⏳ Create dashboard pages
5. ⏳ Implement file upload
6. ⏳ Implement matching algorithm

