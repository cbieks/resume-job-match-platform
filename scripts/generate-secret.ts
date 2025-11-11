/**
 * Script to generate NextAuth secret
 * Run with: npx tsx scripts/generate-secret.ts
 */

import crypto from "crypto";

const secret = crypto.randomBytes(32).toString("base64");
console.log("\n🔐 NextAuth Secret (add to .env.local):");
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log("\n");

