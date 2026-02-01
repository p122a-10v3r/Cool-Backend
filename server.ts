import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Set up the connection pool using the standard 'pg' driver
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Pass that adapter into Prisma
const prisma = new PrismaClient({ adapter });

async function testDrive() {
  console.log("Checking Neon connection...");

  try {
    // Try to create a dummy user
    const user = await prisma.user.create({
      data: {
        email: `dev-${Date.now()}@coolbackend.com`,
        name: "Backend Dawg",
      },
    });
    console.log("✅ Success! Created user:", user);

    const count = await prisma.user.count();
    console.log(`📊 Total users in Neon: ${count}`);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testDrive();
