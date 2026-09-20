import { auth } from "@/auth";
import { WouldYouRatherGame } from "@/components/would-you-rather-game";

export default async function WouldYouRatherPage() {
  const session = await auth();
  return <WouldYouRatherGame loggedIn={Boolean(session?.user)} />;
}
