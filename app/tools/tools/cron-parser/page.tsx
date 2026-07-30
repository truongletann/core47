"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, CaseSensitive, ListOrdered } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";
import { describeCron, formatDate, getNextDates, parseCronExpression } from "@/lib/toolbox/cron";

const DATE_COUNT_OPTIONS = [5, 10, 20, 50];
const DEFAULT_FORMAT = "yyyy-MM-dd ddd HH:mm:ss";

const suggestions = getRelatedTools("cron-parser");

export default function CronParserPage() {
  const [includeSeconds, setIncludeSeconds] = useState(true);
  const [dateCount, setDateCount] = useState(5);
  const [outputFormat, setOutputFormat] = useState(DEFAULT_FORMAT);
  const [expression, setExpression] = useState(includeSeconds ? "* * * * * *" : "* * * * *");

  function handleIncludeSecondsChange(next: boolean) {
    setIncludeSeconds(next);
    setExpression(next ? "* * * * * *" : "* * * * *");
  }

  const { description, dates, error } = useMemo(() => {
    try {
      const fields = parseCronExpression(expression, includeSeconds);
      return {
        description: describeCron(fields, includeSeconds),
        dates: getNextDates(fields, includeSeconds, dateCount),
        error: null as string | null,
      };
    } catch (e) {
      return { description: "", dates: [] as Date[], error: e instanceof Error ? e.message : "Invalid expression." };
    }
  }, [expression, includeSeconds, dateCount]);

  const datesText = dates.map((d) => formatDate(d, outputFormat)).join("\n");

  return (
    <ToolShell
      slug="cron-parser"
      title="Cron expression parser"
      description="Parse Cron expression to get scheduled dates"
    >
      <ConfigPanel>
        <ConfigRow
          icon={<ArrowRightLeft size={16} />}
          title="Include seconds"
          description="Whether the Cron expression should include seconds in its definition"
        >
          <span className="text-sm text-[rgb(var(--muted))]">{includeSeconds ? "On" : "Off"}</span>
          <ModeToggle checked={includeSeconds} onChange={handleIncludeSecondsChange} />
        </ConfigRow>

        <ConfigRow
          icon={<ListOrdered size={16} />}
          title="Next scheduled dates"
          description="How many scheduled dates needs to be generated"
        >
          <select
            value={dateCount}
            onChange={(e) => setDateCount(Number(e.target.value))}
            className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          >
            {DATE_COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </ConfigRow>

        <ConfigRow
          icon={<CaseSensitive size={16} />}
          title="Output format"
          description="Date time format of upcoming dates"
        >
          <input
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="font-data w-56 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4">
        <EditorPanel
          label="Cron expression to parse"
          value={expression}
          onChange={setExpression}
          placeholder={includeSeconds ? "* * * * * *" : "* * * * *"}
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4">
        <EditorPanel label="Cron description" value={error ? "" : description} readOnly />
      </div>

      <div className="mt-4">
        <EditorPanel label="Next scheduled dates" value={error ? "" : datesText} readOnly suggestions={suggestions} />
      </div>
    </ToolShell>
  );
}
