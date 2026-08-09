// Minimal hand-rolled JSON <-> YAML converter (block-style only: no anchors, no
// multiline literals, no flow style). Covers the common case of converting plain
// JSON-shaped config data to/from YAML. Kept dependency-free to avoid pulling a
// full YAML parser into the Worker bundle (see CONVENTIONS.md bundle-size notes).

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const PLAIN_SAFE_RE = /^[A-Za-z0-9_./-]+$/;

function needsQuoting(s: string): boolean {
  if (s === "") return true;
  if (PLAIN_SAFE_RE.test(s)) return false;
  if (/^(true|false|null|~|yes|no)$/i.test(s)) return true;
  if (/^-?\d+(\.\d+)?$/.test(s)) return true;
  return true;
}

function quoteScalar(s: string): string {
  return JSON.stringify(s);
}

function serializeScalar(value: string | number | boolean | null): string {
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  return needsQuoting(value) ? quoteScalar(value) : value;
}

export function toYaml(value: JsonValue, indent = 0): string {
  const pad = "  ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}[]\n`;
    return value
      .map((item) => {
        if (item !== null && typeof item === "object") {
          const nested = toYaml(item as JsonValue, indent + 1);
          return `${pad}-\n${nested}`;
        }
        return `${pad}- ${serializeScalar(item)}\n`;
      })
      .join("");
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return `${pad}{}\n`;
    return entries
      .map(([key, v]) => {
        const safeKey = needsQuoting(key) ? quoteScalar(key) : key;
        if (v !== null && typeof v === "object" && Object.keys(v).length > 0) {
          return `${pad}${safeKey}:\n${toYaml(v, indent + 1)}`;
        }
        if (Array.isArray(v) && v.length > 0) {
          return `${pad}${safeKey}:\n${toYaml(v, indent + 1)}`;
        }
        return `${pad}${safeKey}: ${serializeScalar(v as string | number | boolean | null)}\n`;
      })
      .join("");
  }

  return `${pad}${serializeScalar(value)}\n`;
}

function parseScalar(raw: string): JsonValue {
  let s = raw.trim();
  if (s === "" || s === "~" || /^null$/i.test(s)) return null;
  if (/^true$/i.test(s)) return true;
  if (/^false$/i.test(s)) return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    try {
      return s.startsWith('"') ? (JSON.parse(s) as string) : s.slice(1, -1).replace(/''/g, "'");
    } catch {
      return s.slice(1, -1);
    }
  }
  if (s === "[]") return [];
  if (s === "{}") return {};
  return s;
}

interface Line {
  indent: number;
  content: string;
}

function tokenize(yaml: string): Line[] {
  return yaml
    .split("\n")
    .map((raw) => raw.replace(/\t/g, "  "))
    .filter((raw) => raw.trim() !== "" && !raw.trim().startsWith("#"))
    .map((raw) => ({ indent: raw.length - raw.trimStart().length, content: raw.trim() }));
}

function splitKeyValue(content: string): [string, string] {
  let inQuote: string | null = null;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch;
      continue;
    }
    if (ch === ":" && (i === content.length - 1 || content[i + 1] === " ")) {
      return [content.slice(0, i).trim(), content.slice(i + 1).trim()];
    }
  }
  return [content, ""];
}

function parseKey(raw: string): string {
  const value = parseScalar(raw);
  return typeof value === "string" ? value : String(value);
}

function parseBlock(lines: Line[], start: number, indent: number): [JsonValue, number] {
  if (start >= lines.length || lines[start].indent < indent) return [null, start];

  const isList = lines[start].content.startsWith("- ") || lines[start].content === "-";

  if (isList) {
    const arr: JsonValue[] = [];
    let i = start;
    while (i < lines.length && lines[i].indent === indent && (lines[i].content.startsWith("- ") || lines[i].content === "-")) {
      const rest = lines[i].content === "-" ? "" : lines[i].content.slice(2);
      if (rest === "") {
        const childIndent = i + 1 < lines.length ? lines[i + 1].indent : indent + 1;
        const [child, next] = parseBlock(lines, i + 1, childIndent);
        arr.push(child);
        i = next;
      } else if (rest.includes(":") && !rest.startsWith('"') && !rest.startsWith("'")) {
        // Inline map start: "- key: value" — treat this line plus deeper-indented
        // siblings as one map. Following sibling keys share the same real indent
        // as each other, so borrow that for the synthetic first line too.
        const childIndent = i + 1 < lines.length && lines[i + 1].indent > indent ? lines[i + 1].indent : indent + 1;
        const syntheticLines: Line[] = [{ indent: childIndent, content: rest }];
        let j = i + 1;
        while (j < lines.length && lines[j].indent > indent) {
          syntheticLines.push(lines[j]);
          j++;
        }
        const [child] = parseBlock(syntheticLines, 0, childIndent);
        arr.push(child);
        i = j;
      } else {
        arr.push(parseScalar(rest));
        i++;
      }
    }
    return [arr, i];
  }

  const obj: Record<string, JsonValue> = {};
  let i = start;
  while (i < lines.length && lines[i].indent === indent) {
    const [rawKey, rawValue] = splitKeyValue(lines[i].content);
    const key = parseKey(rawKey);
    if (rawValue === "") {
      if (i + 1 < lines.length && lines[i + 1].indent > indent) {
        const [child, next] = parseBlock(lines, i + 1, lines[i + 1].indent);
        obj[key] = child;
        i = next;
      } else {
        obj[key] = null;
        i++;
      }
    } else {
      obj[key] = parseScalar(rawValue);
      i++;
    }
  }
  return [obj, i];
}

export function fromYaml(yaml: string): JsonValue {
  const lines = tokenize(yaml);
  if (lines.length === 0) return null;
  const [value] = parseBlock(lines, 0, lines[0].indent);
  return value;
}
