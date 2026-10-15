import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { Prisma } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const resources = [
  {
    name: "Conference Room A",
    description: "A spacious room for team meetings and presentations.",
    category: "MEETING_ROOM",
    location: "Main office, Floor 2",
    capacity: 12,
    isActive: true,
  },
  {
    name: "Meeting Room B",
    description: "A smaller room ideal for interviews and discussions.",
    category: "MEETING_ROOM",
    location: "Main office, Floor 1",
    capacity: 6,
    isActive: true,
  },
  {
    name: "MacBook Pro #03",
    description: "A laptop available for temporary employee use.",
    category: "EQUIPMENT",
    location: "IT department",
    capacity: 1,
    isActive: true,
  },
  {
    name: "Projector #02",
    description: "A projector for meetings and presentations.",
    category: "EQUIPMENT",
    location: "IT department",
    capacity: 1,
    isActive: true,
  },
  {
    name: "Quiet Workspace A",
    description: "A dedicated workspace for focused individual work.",
    category: "WORKSPACE",
    location: "Main office, Floor 3",
    capacity: 1,
    isActive: true,
  },
  {
    name: "Training Room",
    description: "A flexible room for workshops and training sessions.",
    category: "MEETING_ROOM",
    location: "Main office, Floor 3",
    capacity: 20,
    isActive: false,
  },
] satisfies Prisma.ResourceCreateInput[];

async function main() {
  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { name: resource.name },
      update: resource,
      create: resource,
    });
  }

  console.log(`Seeded ${resources.length} resources.`);
  await prisma.user.upsert({
    where: {
      email: "demo.employee@reservehub.test",
    },
    update: {},
    create: {
      name: "Demo Employee",
      email: "demo.employee@reservehub.test",
      passwordHash: "DEMO_ACCOUNT_NO_LOGIN",
      role: "EMPLOYEE",
    },
  });
}

main()
  .catch((error) => {
    console.error("Failed to seed resources:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
