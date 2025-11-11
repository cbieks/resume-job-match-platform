/**
 * Script to create a demo job seeker account for testing/demos
 * Run with: npx tsx scripts/create-demo-jobseeker.ts
 */

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function createDemoJobSeeker() {
  const email = process.env.DEMO_JOBSEEKER_EMAIL || "jobseeker@demo.com";
  const password = process.env.DEMO_JOBSEEKER_PASSWORD || "demo123";
  const name = process.env.DEMO_JOBSEEKER_NAME || "Demo Job Seeker";

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log("Demo job seeker already exists:", email);
      console.log("To recreate, delete the user first or use a different email.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "USER",
      },
    });

    console.log("✅ Demo job seeker created successfully!");
    console.log("Email:", user.email);
    console.log("Password:", password);
    console.log("Role:", user.role);
    console.log("\n💡 This account can be used for demos and testing.");
    console.log("   It can upload resumes and match with jobs.");
  } catch (error) {
    console.error("Error creating demo job seeker:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoJobSeeker();

