/**
 * Script to create a demo recruiter account for testing/demos
 * Run with: npx tsx scripts/create-demo-recruiter.ts
 */

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function createDemoRecruiter() {
  const email = process.env.DEMO_RECRUITER_EMAIL || "recruiter@demo.com";
  const password = process.env.DEMO_RECRUITER_PASSWORD || "demo123";
  const name = process.env.DEMO_RECRUITER_NAME || "Demo Recruiter";

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log("Demo recruiter already exists:", email);
      console.log("To recreate, delete the user first or use a different email.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "RECRUITER",
      },
    });

    console.log("✅ Demo recruiter created successfully!");
    console.log("Email:", user.email);
    console.log("Password:", password);
    console.log("Role:", user.role);
    console.log("\n💡 This account can be used for demos and testing.");
    console.log("   It has recruiter permissions to post and import jobs.");
  } catch (error) {
    console.error("Error creating demo recruiter:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoRecruiter();

