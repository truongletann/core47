"use client";

import { iconMap } from "@/lib/toolbox/iconMap";

export function DynamicIcon({ name, size = 15 }: { name: string; size?: number }) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} />;
}
