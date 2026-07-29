"use client";

import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import type { Tool } from "@/types/tool";
import { cn } from "@/lib/utils/cn";

const CATEGORY_VAR: Record<string, string> = {
  utility: "--cat-utility",
  media: "--cat-media",
  text: "--cat-text",
};

const statusLabel: Record<Tool["status"], string> = {
  active: "",
  beta: "Beta",
  soon: "Coming soon",
};

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[tool.icon] ?? Icons.Box;
  const isDisabled = tool.status === "soon";
  const code = `C47/${String(index + 1).padStart(2, "0")}`;
  const catVar = CATEGORY_VAR[tool.categoryId] ?? "--cat-utility";
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    function onJump(e: Event) {
      const detail = (e as CustomEvent<{ slug: string }>).detail;
      if (detail?.slug === tool.slug && cardRef.current) {
        cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setFlashing(true);
        setTimeout(() => setFlashing(false), 900);
      }
    }
    window.addEventListener("core47:jump-to-tool", onJump);
    return () => window.removeEventListener("core47:jump-to-tool", onJump);
  }, [tool.slug]);

  return (
    <motion.a
      ref={cardRef}
      href={isDisabled ? undefined : `https://${tool.subdomain}`}
      target={isDisabled ? undefined : "_blank"}
      rel="noreferrer noopener"
      whileHover={isDisabled ? undefined : { y: -4 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "relative flex overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm transition-shadow hover:shadow-md",
        isDisabled && "pointer-events-none opacity-50",
        flashing && "ring-2 ring-[rgb(var(--accent))]",
      )}
    >
      {/* Left ticket stub — colored by category, code written vertically */}
      <div
        className="flex w-9 shrink-0 items-center justify-center"
        style={{ backgroundColor: `rgb(var(${catVar}) / 0.12)` }}
      >
        <span
          className="font-data text-[10px] font-medium tracking-widest"
          style={{ writingMode: "vertical-rl", color: `rgb(var(${catVar}))` }}
        >
          {code}
        </span>
      </div>

      {/* Perforated tear line with a notch cutout top and bottom */}
      <div className="relative w-px shrink-0 bg-[repeating-linear-gradient(to_bottom,rgb(var(--border))_0px,rgb(var(--border))_5px,transparent_5px,transparent_10px)]">
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[rgb(var(--bg))]" />
        <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[rgb(var(--bg))]" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 shrink-0 -rotate-6 items-center justify-center rounded-lg"
            style={{ backgroundColor: `rgb(var(${catVar}) / 0.12)`, color: `rgb(var(${catVar}))` }}
          >
            <Icon size={18} strokeWidth={2} />
          </div>
          <span className="flex items-center gap-1.5">
            {statusLabel[tool.status] && (
              <span className="font-data text-[10px] text-[rgb(var(--muted))]">
                {statusLabel[tool.status]}
              </span>
            )}
            <span
              className="led-dot"
              style={{ backgroundColor: tool.status === "soon" ? "rgb(var(--muted))" : `rgb(var(${catVar}))` }}
            />
          </span>
        </div>

        <div>
          <h3 className="font-display text-[15px] font-semibold">{tool.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[rgb(var(--muted))]">
            {tool.description}
          </p>
        </div>

        <span className="font-data flex w-fit items-center gap-1.5 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-[11px] text-[rgb(var(--muted))]">
          <span style={{ color: `rgb(var(${catVar}))` }}>✈</span>
          {tool.subdomain}
        </span>
      </div>
    </motion.a>
  );
}