"use client";

import { useMemo, useState } from "react";
import { CaseSensitive, Minus } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";
import { formatSql } from "@/lib/toolbox/sqlFormat";

const suggestions = getRelatedTools("sql-formatter");
const SAMPLE = "select id, name, email from users where active = 1 and role = 'admin' order by name;";

export default function SqlFormatterPage() {
  const [input, setInput] = useState(SAMPLE);
  const [uppercase, setUppercase] = useState(true);
  const [indentSize, setIndentSize] = useState(2);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return formatSql(input, indentSize, uppercase);
    } catch {
      return "";
    }
  }, [input, indentSize, uppercase]);

  return (
    <ToolShell slug="sql-formatter" title="SQL Formatter" description="Format and prettify your SQL queries.">
      <ConfigPanel>
        <ConfigRow icon={<CaseSensitive size={16} />} title="Uppercase keywords" description="SELECT vs select">
          <ModeToggle checked={uppercase} onChange={setUppercase} />
        </ConfigRow>
        <ConfigRow icon={<Minus size={16} />} title="Indent size" description="Number of spaces per indent level">
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          >
            {[2, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel label="Input" value={input} onChange={setInput} placeholder="select * from table" />
        <EditorPanel label="Output" value={output} readOnly suggestions={suggestions} />
      </div>

      <p className="mt-2 text-xs text-[rgb(var(--muted))]">
        Keyword-based beautifier — handles common single-statement queries; complex nested subqueries may not be perfectly indented.
      </p>
    </ToolShell>
  );
}
