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
  {
    prompt: "Would you rather",
    options: [
      "let the group pick your drink order for the rest of the night",
      "let the group pick your karaoke song right now",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "have to high-five every stranger you pass tonight",
      "have to compliment every stranger you pass tonight",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "finish your drink in one go",
      "buy the next round for everyone at the table",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "have your search history read aloud to the group",
      "have your camera roll scrolled through by the group",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "wear your clothes inside out for the rest of the night",
      "talk in an accent for the rest of the night",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "text your ex \"thinking of you\" right now",
      "let the group write a text to anyone in your contacts",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "do the next round of shots with your non-dominant hand",
      "do the next round of shots blindfolded",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "give up dancing for the whole night",
      "give up sitting down for the whole night",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "have a hangover tomorrow",
      "have to wake up for a 7am tomorrow, hangover-free",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "only speak in questions for the next round",
      "only speak in whispers for the next round",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "let a stranger order your next drink",
      "let the bartender surprise you with whatever they want",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "be the designated photographer all night",
      "be the designated DJ all night",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "have everyone at the table roast you for a minute",
      "roast everyone at the table for a minute",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "give up your seat for the rest of the game",
      "give up your phone for the rest of the game",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "drink whatever is left in everyone's glasses",
      "eat a spoonful of a condiment of the group's choice",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "have to agree with everything said to you for the next 10 minutes",
      "have to disagree with everything said to you for the next 10 minutes",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "reveal the last thing you googled",
      "reveal your screen time from this week",
    ],
  },
  {
    prompt: "Would you rather",
    options: [
      "swap drinks with the person to your left",
      "swap seats with the person across from you for the rest of the round",
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
