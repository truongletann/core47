"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Clipboard, Copy, Maximize2, Minimize2, Lightbulb, Upload, X } from "lucide-react";
import { DynamicIcon } from "@/components/toolbox/DynamicIcon";

interface RelatedTool {
  slug: string;
  name: string;
  shortName?: string;
  icon: string;
}

function HeaderButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]"
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function EditorPanel({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  suggestions,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  suggestions?: RelatedTool[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = value.length ? value.split("\n").length : 1;

  function syncScroll() {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      onChange?.(text);
    } catch {
      // Browser denied clipboard permission — user can still paste with Ctrl+V.
    }
  }

  function handleOpenFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "text/*,.json,.txt,.log,.csv";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      file.text().then((text) => onChange?.(text));
    };
    input.click();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const height = expanded ? "70vh" : "16rem";

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-[rgb(var(--muted))]">{label}</p>
        <div className="flex items-center gap-0.5">
          {!readOnly && (
            <>
              <HeaderButton onClick={handlePaste} label="Paste">
                <Clipboard size={13} />
              </HeaderButton>
              <HeaderButton onClick={handleOpenFile} label="Open file">
                <Upload size={13} />
              </HeaderButton>
              <HeaderButton onClick={() => onChange?.("")} label="Clear">
                <X size={13} />
              </HeaderButton>
            </>
          )}
          {readOnly && (
            <>
              <HeaderButton onClick={handleCopy} label="Copy">
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </HeaderButton>
              <HeaderButton onClick={() => setExpanded((v) => !v)} label={expanded ? "Collapse" : "Expand"}>
                {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </HeaderButton>
              {suggestions && suggestions.length > 0 && (
                <div className="relative">
                  <HeaderButton onClick={() => setShowSuggestions((v) => !v)} label="Related">
                    <Lightbulb size={13} />
                  </HeaderButton>
                  {showSuggestions && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                      <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1 shadow-lg">
                        {suggestions.map((t) => (
                          <Link
                            key={t.slug}
                            href={`/${t.slug}`}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[rgb(var(--fg))] hover:bg-[rgb(var(--border)/0.5)]"
                          >
                            <DynamicIcon name={t.icon} />
                            {t.shortName ?? t.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-1 flex overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <div
          ref={gutterRef}
          className="font-data select-none overflow-hidden bg-[rgb(var(--bg))] px-2 py-3 text-right text-sm text-[rgb(var(--muted)/0.7)]"
          style={{ height }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={syncScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          wrap="off"
          style={{ height }}
          className="font-data w-full flex-1 resize-none overflow-auto whitespace-pre bg-transparent px-3 py-3 text-sm leading-6 outline-none"
        />
      </div>
    </div>
  );
}
