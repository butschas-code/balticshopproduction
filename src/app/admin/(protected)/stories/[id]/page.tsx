import { StoryForm } from "@/components/cms/admin/StoryForm";

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoryForm storyId={id} />;
}
