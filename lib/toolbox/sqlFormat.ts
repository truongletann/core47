// Hand-rolled keyword-based SQL beautifier — not a full parser, but handles the
// common single-statement SELECT/INSERT/UPDATE/DELETE shapes cleanly, which
// covers the vast majority of "paste a query, make it readable" use cases.

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

const INDENT_AFTER = new Set(["WHERE", "ON", "SET", "VALUES"]);
const CONTINUATION = new Set(["AND", "OR"]);

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

export function formatSql(sql: string, indentSize = 2, uppercaseKeywords = true): string {
  const tokens = tokenize(sql.trim());
  const pad = " ".repeat(indentSize);
  let out = "";
  let parenDepth = 0;
  let clauseIndent = 0;
  let needsSpace = false;

  function append(text: string, spaceBefore: boolean) {
    if (spaceBefore && needsSpace) out += " ";
    out += text;
  }

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (!tok.isString && tok.text === "(") {
      append("(", needsSpace);
      parenDepth++;
      needsSpace = false;
      continue;
    }
    if (!tok.isString && tok.text === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
      out += ")";
      needsSpace = true;
      continue;
    }
    if (!tok.isString && tok.text === ",") {
      out += ",";
      if (parenDepth === 0) {
        out += `\n${pad.repeat(clauseIndent + 1)}`;
        needsSpace = false;
      } else {
        needsSpace = true;
      }
      continue;
    }

    const keywordMatch = parenDepth === 0 && !tok.isString ? matchKeywordPhrase(tokens, i) : null;
    if (keywordMatch) {
      const word = uppercaseKeywords ? keywordMatch.phrase : keywordMatch.phrase.toLowerCase();
      out += `${out ? "\n" : ""}${word}`;
      clauseIndent = INDENT_AFTER.has(keywordMatch.phrase) ? 1 : 0;
      needsSpace = true;
      i += keywordMatch.length - 1;
      continue;
    }

    if (parenDepth === 0 && !tok.isString && CONTINUATION.has(tok.text.toUpperCase())) {
      const word = uppercaseKeywords ? tok.text.toUpperCase() : tok.text.toLowerCase();
      out += `\n${pad.repeat(clauseIndent + 1)}${word}`;
      needsSpace = true;
      continue;
    }

    append(tok.text, needsSpace);
    needsSpace = true;
  }

  return out.trim() + "\n";
}
