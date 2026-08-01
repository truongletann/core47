import { notFound } from "next/navigation";
import { getPublicBioByUsername } from "@/lib/bio/service";
import { BioPreview } from "@/components/bio/BioPreview";
import type { BioTheme } from "@/lib/bio/themes";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getPublicBioByUsername(username);
  if (!data) return {};

  return {
    title: `${data.title || data.name || data.username} — Core47 Bio`,
    description: data.bio || undefined,
  };
}

export default async function PublicBioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getPublicBioByUsername(username);
  if (!data) notFound();

  return (
    <BioPreview
      avatarUrl={`/api/avatar/${data.userId}`}
      name={data.name}
      title={data.title}
      bio={data.bio}
      theme={data.theme as BioTheme}
      buttonStyle={data.buttonStyle as "solid" | "outline" | "soft"}
      links={data.links}
      interactive
    />
  );
}
