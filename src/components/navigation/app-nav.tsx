import { primaryNavigationItems, secondaryNavigationItems } from "@/config/navigation";
import { getAuthSession } from "@/lib/auth";
import { filterNavigationItems } from "@/lib/navigation";
import { SecondaryNavigation } from "./secondary-navigation";
import { TopNavigation } from "./top-navigation";

export async function AppNav() {
  const session = await getAuthSession();
  const primaryItems = filterNavigationItems(primaryNavigationItems, session);
  const secondaryItems = filterNavigationItems(secondaryNavigationItems, session);

  return (
    <>
      <TopNavigation items={primaryItems} session={session} />
      {session && <SecondaryNavigation items={secondaryItems} />}
    </>
  );
}
