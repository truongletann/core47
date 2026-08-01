"use client";

import { useEffect, useRef } from "react";
import type { Tool } from "@/types/tool";
import { getCategoryColorVar } from "@/lib/tools/categoryColor";

const SLOTS = [
  { top: 10, left: 8 },
  { top: 14, left: 82 },
  { top: 82, left: 10 },
  { top: 86, left: 78 },
  { top: 45, left: 3 },
  { top: 8, left: 46 },
  { top: 88, left: 44 },
  { top: 45, left: 93 },
];

export function Hero({ tools }: { tools: Tool[] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLElement | null>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const connectSvgRef = useRef<SVGSVGElement>(null);

  const featured = [...tools].sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 8);

  useEffect(() => {
    logoRef.current = document.getElementById("core-logo-mark");
    const hero = heroRef.current;
    if (!hero) return;

    const baseOpacities: number[] = [];

    // Initial position — set opacity/scale via transition (NOT CSS animation)
    // so JS always has full control to override transform later, avoiding an
    // animation "locking in" a value.
    tagRefs.current.forEach((el, i) => {
      if (!el) return;
      const slot = SLOTS[i % SLOTS.length];
      const depth = 0.3 + ((i * 37) % 40) / 100;
      const priorityBoost = (featured.length - i) * 0.02;
      const scale = 0.75 + depth * 0.5 + priorityBoost;
      const opacity = 0.45 + depth * 0.55;

      baseOpacities[i] = opacity;
      el.dataset.depth = String(depth);
      el.dataset.scale = String(scale);

      el.style.top = slot.top + "%";
      el.style.left = slot.left + "%";
      el.style.filter = `blur(${(1 - depth) * 1.2}px)`;
      el.style.opacity = "0";
      el.style.transform = `translateY(16px) scale(${(scale - 0.1).toFixed(2)})`;
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";

      // Trigger the entrance effect, staggered by order
      window.setTimeout(() => {
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(0) scale(${scale.toFixed(2)})`;
        // Once in place, switch to a dedicated transform transition for a
        // smooth parallax
        window.setTimeout(() => {
          el.style.transition = "top 1.2s ease, left 1.2s ease, box-shadow 0.3s, border-color 0.3s";
        }, 550);
      }, i * 80);
    });

    // Mouse-driven parallax
    function onMouseMove(e: MouseEvent) {
      const rect = hero!.getBoundingClientRect();
      const mx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const my = (e.clientY - rect.top - rect.height / 2) / rect.height;
      tagRefs.current.forEach((el) => {
        if (!el) return;
        const depth = parseFloat(el.dataset.depth || "0.4");
        const scale = el.dataset.scale || "1";
        el.style.transform = `translate(${mx * 30 * depth}px, ${my * 30 * depth}px) scale(${scale})`;
      });
    }
    hero.addEventListener("mousemove", onMouseMove);

    // Radar sweep — lights up a tag's border when the beam passes its angle
    let angle = 0;
    let raf: number;
    function radarTick() {
      angle = (angle + 2) % 360;
      tagRefs.current.forEach((el, i) => {
        if (!el) return;
        const slot = SLOTS[i % SLOTS.length];
        const dx = slot.left - 50;
        const dy = slot.top - 50;
        let tagAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (tagAngle < 0) tagAngle += 360;
        const diff = Math.abs(((angle - tagAngle + 540) % 360) - 180);
        if (diff < 14) {
          el.style.boxShadow = `0 0 0 2px ${el.style.getPropertyValue("--cat-color")}, 0 3px 10px rgb(15 23 42 / 0.1)`;
        } else {
          el.style.boxShadow = "";
        }
      });
      raf = requestAnimationFrame(radarTick);
    }
    raf = requestAnimationFrame(radarTick);

    // Reshuffle position every 9s — only swaps among the predefined safe slots
    const repositionInterval = setInterval(() => {
      const shuffled = [...SLOTS].sort(() => Math.random() - 0.5);
      tagRefs.current.forEach((el, i) => {
        if (!el) return;
        const slot = shuffled[i % shuffled.length];
        el.style.top = slot.top + "%";
        el.style.left = slot.left + "%";
      });
    }, 9000);

    // Fade out on scroll
    function onScroll() {
      const fade = Math.max(0, 1 - window.scrollY / 300);
      tagRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String((baseOpacities[i] ?? 1) * fade);
      });
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      clearInterval(repositionInterval);
      cancelAnimationFrame(raf);
    };
  }, [featured.length]);

  function handleTagEnter(index: number) {
    const el = tagRefs.current[index];
    const svg = connectSvgRef.current;
    const hero = heroRef.current;
    const logo = logoRef.current;
    if (!el || !svg || !hero || !logo) return;
    const heroRect = hero.getBoundingClientRect();
    const tagRect = el.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const x1 = tagRect.left + tagRect.width / 2 - heroRect.left;
    const y1 = tagRect.top + tagRect.height / 2 - heroRect.top;
    const x2 = logoRect.left + logoRect.width / 2 - heroRect.left;
    const y2 = logoRect.top + logoRect.height / 2 - heroRect.top;
    svg.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgb(var(--accent))" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.55"/>`;
  }

  function handleTagLeave() {
    if (connectSvgRef.current) connectSvgRef.current.innerHTML = "";
  }

  function handleTagClick(tool: Tool) {
    window.dispatchEvent(new CustomEvent("core47:jump-to-tool", { detail: { slug: tool.slug } }));
  }

  return (
    <section
      ref={heroRef}
      className="relative flex h-[320px] items-center justify-center overflow-hidden text-center sm:h-[460px]"
    >
      <div className="radar-sweep -z-10" />
      <svg ref={connectSvgRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

      {featured.map((tool, i) => {
        const catVar = getCategoryColorVar(tool.categoryId);
        return (
          <span
            key={tool.id}
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
            onMouseEnter={() => handleTagEnter(i)}
            onMouseLeave={handleTagLeave}
            onClick={() => handleTagClick(tool)}
            className="font-data absolute hidden cursor-pointer whitespace-nowrap rounded-full border bg-[rgb(var(--card))] px-3 py-1.5 text-[11px] text-[rgb(var(--muted))] sm:block"
            style={{
              borderColor: `rgb(var(${catVar}) / 0.4)`,
              // @ts-expect-error custom property used for radar-lit
              "--cat-color": `rgb(var(${catVar}))`,
            }}
          >
            {tool.subdomain}
          </span>
        );
      })}

      <div className="relative z-10">
        <h1 id="core-logo-mark" className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          <span className="text-[rgb(var(--fg))]">Family</span>{" "}
          <span className="text-[rgb(var(--accent))]">Sharing</span>
        </h1>
      </div>
    </section>
  );
}