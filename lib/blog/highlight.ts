import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);

hljs.registerAliases(["js", "jsx"], { languageName: "javascript" });
hljs.registerAliases(["ts", "tsx"], { languageName: "typescript" });
hljs.registerAliases(["py"], { languageName: "python" });
hljs.registerAliases(["sh", "shell", "zsh"], { languageName: "bash" });

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Highlights a fenced code block. Falls back to plain (escaped) text when no
 * language is given or it isn't one of the registered ones — this is a
 * curated subset of highlight.js's ~190 languages (JS/TS/Python/Bash/JSON,
 * the ones actually seen in blog content so far), not the full bundle.
 */
export function highlightCode(code: string, lang?: string): { html: string; language: string | null } {
  const normalized = lang?.toLowerCase().trim().split(/\s+/)[0];
  if (normalized && hljs.getLanguage(normalized)) {
    try {
      const result = hljs.highlight(code, { language: normalized, ignoreIllegals: true });
      return { html: result.value, language: normalized };
    } catch {
      // fall through to plain text
    }
  }
  return { html: escapeHtml(code), language: null };
}
