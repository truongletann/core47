"use client";

import { useMemo, useState } from "react";
import { AlignLeft, Hash, ListOrdered } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";

const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor " +
  "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud " +
  "exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute " +
  "irure in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla " +
  "pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui " +
  "officia deserunt mollit anim id est laborum"
).split(" ");

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(): string {
  const len = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, randomWord);
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(sentenceCount: number): string {
  return Array.from({ length: sentenceCount }, generateSentence).join(" ");
}

const suggestions = getRelatedTools("lorem-ipsum");

export default function LoremIpsumPage() {
  const [unit, setUnit] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [seed, setSeed] = useState(0);

  const output = useMemo(() => {
    let result: string;
    if (unit === "words") {
      result = Array.from({ length: count }, randomWord).join(" ");
      result = capitalize(result) + ".";
    } else if (unit === "sentences") {
      result = Array.from({ length: count }, generateSentence).join(" ");
    } else {
      result = Array.from({ length: count }, () => generateParagraph(4 + Math.floor(Math.random() * 3))).join("\n\n");
    }
    if (startWithLorem) {
      result = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + result;
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, count, startWithLorem, seed]);

  return (
    <ToolShell
      slug="lorem-ipsum"
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum placeholder text."
    >
      <ConfigPanel>
        <ConfigRow icon={<AlignLeft size={16} />} title="Unit" description="What to generate">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </ConfigRow>

        <ConfigRow icon={<ListOrdered size={16} />} title="Count" description="How many to generate">
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-16 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          />
        </ConfigRow>

        <ConfigRow icon={<Hash size={16} />} title='Start with "Lorem ipsum..."' description="Prefix the classic opening line">
          <ModeToggle checked={startWithLorem} onChange={setStartWithLorem} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          Regenerate
        </button>
      </div>

      <div className="mt-2">
        <EditorPanel label="Output" value={output} readOnly suggestions={suggestions} />
      </div>
    </ToolShell>
  );
}
