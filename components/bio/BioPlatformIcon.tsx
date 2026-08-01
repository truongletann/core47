import {
  Camera,
  Users,
  Video,
  AtSign,
  Code2,
  Send,
  Mail,
  Globe,
  Music2,
  MessageCircle,
  Link2,
  type LucideIcon,
} from "lucide-react";

// lucide-react dropped brand/logo icons (trademark reasons) — these are
// generic stand-ins per platform, not the platforms' actual logos.
const PLATFORM_ICONS: Record<string, LucideIcon> = {
  website: Globe,
  instagram: Camera,
  tiktok: Music2,
  facebook: Users,
  youtube: Video,
  twitter: AtSign,
  github: Code2,
  telegram: Send,
  zalo: MessageCircle,
  email: Mail,
};

export function iconForPlatform(platform: string | null | undefined): LucideIcon {
  if (!platform) return Link2;
  return PLATFORM_ICONS[platform] ?? Link2;
}

export function BioPlatformIcon({ platform, size = 20 }: { platform: string | null | undefined; size?: number }) {
  const Icon = iconForPlatform(platform);
  return <Icon size={size} />;
}
