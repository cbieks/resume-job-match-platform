/**
 * Script to test the setup and verify everything is working
 * Run with: npx tsx scripts/test-setup.ts
 */

import { prisma } from "../lib/prisma";

async function testSetup() {
  console.log("🧪 Testing Resume-Job Match Platform Setup...\n");

  try {
    // Test database connection
    console.log("1. Testing database connection...");
    await prisma.$connect();
    console.log("   ✅ Database connection successful\n");

    // Test if tables exist
    console.log("2. Testing database tables...");
    const userCount = await prisma.user.count();
    const resumeCount = await prisma.resume.count();
    const jobCount = await prisma.job.count();
    const matchCount = await prisma.match.count();

    console.log(`   ✅ Users table: ${userCount} users`);
    console.log(`   ✅ Resumes table: ${resumeCount} resumes`);
    console.log(`   ✅ Jobs table: ${jobCount} jobs`);
    console.log(`   ✅ Matches table: ${matchCount} matches\n`);

    // Check for admin user
    console.log("3. Checking for admin user...");
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (adminUser) {
      console.log(`   ✅ Admin user found: ${adminUser.email}`);
    } else {
      console.log("   ⚠️  No admin user found. Run: npm run create:admin");
    }
    console.log();

    // Check environment variables
    console.log("4. Checking environment variables...");
    const requiredEnvVars = [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",
      "OPENAI_API_KEY",
    ];

    const missingVars: string[] = [];
    requiredEnvVars.forEach((varName) => {
      const value = process.env[varName];
      if (!value || value === `your-${varName.toLowerCase().replace(/_/g, "-")}-here`) {
        missingVars.push(varName);
        console.log(`   ❌ ${varName}: Not set or placeholder value`);
      } else {
        console.log(`   ✅ ${varName}: Set`);
      }
    });

    if (missingVars.length > 0) {
      console.log(
        `\n   ⚠️  Missing or invalid environment variables: ${missingVars.join(", ")}`
      );
      console.log("   Please update .env.local with valid values");
    }
    console.log();

    // Test OpenAI API key format (if set)
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-")) {
      console.log("   ✅ OpenAI API key format looks valid");
    } else if (process.env.OPENAI_API_KEY) {
      console.log("   ⚠️  OpenAI API key format may be invalid (should start with 'sk-')");
    }

    console.log("\n✅ Setup test completed!");
    console.log("\nNext steps:");
    console.log("1. Start the dev server: npm run dev");
    console.log("2. Create an admin user: npm run create:admin");
    console.log("3. Visit http://localhost:3000");
    console.log("4. Follow the testing guide: docs/TESTING_GUIDE.md");
  } catch (error) {
    console.error("\n❌ Setup test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testSetup();

