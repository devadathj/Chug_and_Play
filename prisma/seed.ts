import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const QUESTIONS: { prompt: string; options: string[] }[] = [
  {
    prompt: "Would you rather",
    options: [
      "take a 50% chance of being in a car crash tomorrow",
      "take a 2% chance of being struck by lightning",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "chug a mystery cocktail mixed by the table",
      "tell the room your most embarrassing story",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "never remember tonight",
      "remember every cringe thing you have ever done, in 4K",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "lose your phone for a week",
      "lose your voice for a week",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "always be a little bit drunk",
      "never drink again",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "take a shot every time someone checks their phone",
      "take a shot every time someone says \"like\"",
    ],
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@chugandplay.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChugAdmin!1";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  const game = await prisma.game.upsert({
    where: { slug: "would-you-rather" },
    update: {
      name: "Would You Rather",
      description:
        "Pick a side. See how the room voted. Keep going until last call.",
    },
    create: {
      slug: "would-you-rather",
      name: "Would You Rather",
      description:
        "Pick a side. See how the room voted. Keep going until last call.",
    },
  });

  const existing = await prisma.question.count({
    where: { gameId: game.id, status: "APPROVED" },
  });

  if (existing === 0) {
    for (const question of QUESTIONS) {
      await prisma.question.create({
        data: {
          gameId: game.id,
          prompt: question.prompt,
          status: "APPROVED",
          reviewedAt: new Date(),
          options: {
            create: question.options.map((text, index) => ({
              label: String.fromCharCode(65 + index),
              text,
              sortOrder: index,
            })),
          },
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
