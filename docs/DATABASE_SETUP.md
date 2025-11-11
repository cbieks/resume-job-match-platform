# Database Setup Guide

## Option 1: PostgreSQL (Recommended - Already Configured)

### Local PostgreSQL Setup

#### Windows (using PostgreSQL Installer)

1. **Download PostgreSQL:**
   - Go to https://www.postgresql.org/download/windows/
   - Download the installer
   - Run the installer

2. **During Installation:**
   - Remember the password you set for the `postgres` user
   - Default port: 5432
   - Default user: postgres

3. **Create Database:**
   ```sql
   -- Open pgAdmin or psql command line
   CREATE DATABASE resume_matcher;
   ```

4. **Update .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resume_matcher?schema=public"
   ```

#### Using Docker (Easiest - Works on Windows/Mac/Linux)

1. **Install Docker Desktop** (if not already installed)
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run PostgreSQL Container:**
   ```bash
   docker run --name resume-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=resume_matcher \
     -p 5432:5432 \
     -d postgres:16
   ```

3. **Update .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resume_matcher?schema=public"
   ```

4. **To stop/start the container:**
   ```bash
   docker stop resume-postgres
   docker start resume-postgres
   ```

### Cloud PostgreSQL (Supabase - Free Tier)

1. **Sign up at Supabase:**
   - Go to https://supabase.com
   - Create a free account
   - Create a new project

2. **Get Connection String:**
   - Go to Project Settings > Database
   - Copy the "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

3. **Update .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?schema=public"
   ```

## Option 2: MySQL (Requires Schema Changes)

If you prefer MySQL, we'll need to:
1. Change Prisma provider to MySQL
2. Adjust some data types (JSON columns work differently)
3. Update connection string format

Let me know if you want to use MySQL instead!

## After Database Setup

Once your database is ready:

```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Push schema to database
npm run db:push

# 3. Verify it worked (optional)
npm run db:studio
```

## Quick Test

Test your connection:

```bash
# This will open Prisma Studio in your browser
npm run db:studio
```

You should see your database tables (users, resumes, jobs, matches).

