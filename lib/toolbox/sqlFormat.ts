// Hand-rolled keyword-based SQL beautifier — not a full parser, but handles the
// common single-statement SELECT/INSERT/UPDATE/DELETE shapes cleanly, which
// covers the vast majority of "paste a query, make it readable" use cases.
// Subqueries — "(" immediately followed by SELECT/WITH — are recursively
// formatted at one extra indent level; other parens (function calls, IN (...)
// lists, VALUES (...) tuples) stay inline, with their commas kept inline too.

const NEWLINE_BEFORE = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "UNION ALL",
  "UNION",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "WITH",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "FULL JOIN",
  "CROSS JOIN",
  "JOIN",
  "ON",
];

const CONTINUATION = new Set(["AND", "OR"]);

// Keywords that conventionally get a space before "(" — everything else
// (function calls: count(x), sum(x), COALESCE(...)) is kept tight.
const SPACE_BEFORE_PAREN = new Set(["IN", "EXISTS", "NOT", "VALUES", "AS"]);

interface Token {
  text: string;
  isString: boolean;
}

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  const re = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\(|\)|,|[^\s(),'"]+|\s+/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(sql))) {
    const text = match[0];
    if (/^\s+$/.test(text)) continue;
    tokens.push({ text, isString: text.startsWith("'") || text.startsWith('"') });
  }
  return tokens;
}

function matchKeywordPhrase(tokens: Token[], i: number): { phrase: string; length: number } | null {
  for (const phrase of NEWLINE_BEFORE) {
    const words = phrase.split(" ");
    if (i + words.length > tokens.length) continue;
    const slice = tokens.slice(i, i + words.length);
    if (slice.every((t) => !t.isString) && slice.map((t) => t.text.toUpperCase()).join(" ") === phrase) {
      return { phrase, length: words.length };
    }
  }
  return null;
}

function findMatchingParen(tokens: Token[], openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.isString) continue;
    if (tok.text === "(") depth++;
    else if (tok.text === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return tokens.length - 1;
}

function isSubqueryOpen(tokens: Token[], i: number): boolean {
  const tok = tokens[i];
  if (tok.isString || tok.text !== "(") return false;
  const next = tokens[i + 1];
  if (!next || next.isString) return false;
  const word = next.text.toUpperCase();
  return word === "SELECT" || word === "WITH";
}

// Formats one "block" of tokens (top-level statement, or the inside of a
// subquery) at the given base indent `level`. Clause keywords sit at `level`;
// their comma-separated items and AND/OR continuations sit at `level + 1`.
// Non-subquery parens (function calls, IN (...), VALUES (...) tuples) are kept
// fully inline — `depth` tracks nesting inside those so their commas don't
// trigger line breaks.
function formatTokens(tokens: Token[], level: number, indentSize: number, uppercase: boolean): string {
  const pad = " ".repeat(indentSize);
  let out = pad.repeat(level);
  let needsSpace = false;
  let emittedAny = false;
  let depth = 0;
  let lineLevel = level; // indent level of whatever line we're currently writing on

  function newline(extraLevels: number) {
    lineLevel = level + extraLevels;
    out += `\n${pad.repeat(lineLevel)}`;
    needsSpace = false;
  }

  let lastToken: Token | null = null;

  function spaceBeforeParen(): boolean {
    return needsSpace && (!lastToken || lastToken.isString || SPACE_BEFORE_PAREN.has(lastToken.text.toUpperCase()));
  }

  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];

    if (depth === 0 && isSubqueryOpen(tokens, i)) {
      const closeIdx = findMatchingParen(tokens, i);
      const inner = tokens.slice(i + 1, closeIdx);
      const parenLevel = lineLevel;
      const innerFormatted = formatTokens(inner, parenLevel + 1, indentSize, uppercase);
      // Subqueries always get a leading space (unlike function calls, which stay tight).
      if (needsSpace) out += " ";
      out += `(\n${innerFormatted}\n${pad.repeat(parenLevel)})`;
      needsSpace = true;
      emittedAny = true;
      lastToken = tok;
      i = closeIdx + 1;
      continue;
    }

    if (!tok.isString && tok.text === "(") {
      if (spaceBeforeParen()) out += " ";
      out += "(";
      needsSpace = false;
      emittedAny = true;
      depth++;
      lastToken = tok;
      i++;
      continue;
    }
    if (!tok.isString && tok.text === ")") {
      out += ")";
      needsSpace = true;
      emittedAny = true;
      depth = Math.max(0, depth - 1);
      lastToken = tok;
      i++;
      continue;
    }
    if (!tok.isString && tok.text === ",") {
      out += ",";
      if (depth === 0) newline(1);
      else needsSpace = true;
      emittedAny = true;
      lastToken = tok;
      i++;
      continue;
    }

    const keywordMatch = depth === 0 && !tok.isString ? matchKeywordPhrase(tokens, i) : null;
    if (keywordMatch) {
      const word = uppercase ? keywordMatch.phrase : keywordMatch.phrase.toLowerCase();
      if (emittedAny) newline(0);
      out += word;
      needsSpace = true;
      emittedAny = true;
      lastToken = tokens[i + keywordMatch.length - 1];
      i += keywordMatch.length;
      continue;
    }

    if (depth === 0 && !tok.isString && CONTINUATION.has(tok.text.toUpperCase())) {
      const word = uppercase ? tok.text.toUpperCase() : tok.text.toLowerCase();
      newline(1);
      out += word;
      needsSpace = true;
      emittedAny = true;
      lastToken = tok;
      i++;
      continue;
    }

    const noSpaceBefore = !tok.isString && tok.text === ";";
    if (needsSpace && !noSpaceBefore) out += " ";
    out += tok.text;
    needsSpace = true;
    emittedAny = true;
    lastToken = tok;
    i++;
  }

  return out;
}

export function formatSql(sql: string, indentSize = 2, uppercaseKeywords = true): string {
  const tokens = tokenize(sql.trim());
  return formatTokens(tokens, 0, indentSize, uppercaseKeywords).trim() + "\n";
}
