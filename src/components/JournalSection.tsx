import { getPublishedStories } from "@/lib/cms/stories";
import { JournalSectionClient } from "./JournalSectionClient";

export async function JournalSection({ locale }: { locale: string }) {
  const posts = await getPublishedStories(locale, 3);

  return <JournalSectionClient posts={posts} />;
}
