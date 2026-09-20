# Chug & Play

Drinking games site for [chugandplay.com](https://chugandplay.com). First game: **Would You Rather**.

## What it does

- Home page lists games. Would You Rather is live; more games can be added later.
- Each round shows a question with two or more options.
- After you pick, you see how the room split.
- Skip moves on without recording a vote.
- Guests can play; their votes still count toward the percentages.
- Logged-in players are not shown questions they already answered, and can submit new questions for admin review.
- Admins can approve/reject submissions and publish questions directly.

## Run it locally

You need Node.js 20+ and npm.

```bash
cd E:\Projects\Chug_and_Play
copy .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Seeded admin login (change in `.env` before anything public):

- Email: `admin@chugandplay.com`
- Password: `ChugAdmin!1`

SQLite lives at `prisma/dev.db`. Swap `DATABASE_URL` to Postgres later if you deploy.

## Useful paths

- `/` — game picker
- `/games/would-you-rather` — play
- `/login` and `/register`
- `/submit` — logged-in submissions
- `/admin` — review queue and direct add
