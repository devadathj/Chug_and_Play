import { cookies } from "next/headers";

export const ANON_COOKIE = "chug_anon";

export async function getOrCreateAnonymousId() {
  const jar = await cookies();
  let id = jar.get(ANON_COOKIE)?.value;

  if (!id) {
    id = crypto.randomUUID();
    jar.set(ANON_COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return id;
}
