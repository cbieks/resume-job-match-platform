/**
 * Script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function createAdmin() {
  // Use provided credentials or environment variables
  const email = process.env.ADMIN_EMAIL || "cbieker@usc.edu";
  const password = process.env.ADMIN_PASSWORD || "BaileySmells11$$";
  const name = process.env.ADMIN_NAME || "Admin User";

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      // Update existing user to ensure they're an admin with the correct password
      console.log("Admin user already exists, updating...");
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "ADMIN",
          name: name,
        },
      });

      console.log("✅ Admin user updated successfully!");
      console.log("Email:", updatedUser.email);
      console.log("Role:", updatedUser.role);
      console.log("Password has been updated.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("\n🔒 Admin account is secured with your password.");
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

