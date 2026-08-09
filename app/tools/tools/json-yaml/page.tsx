"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";
import { fromYaml, toYaml } from "@/lib/toolbox/yaml";

const suggestions = getRelatedTools("json-yaml");
const SAMPLE_JSON = '{\n  "name": "core47",\n  "tags": ["dev", "tools"],\n  "active": true\n}';

export default function JsonYamlPage() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [jsonToYaml, setJsonToYaml] = useState(true);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      if (jsonToYaml) {
        const parsed = JSON.parse(input);
        return { output: toYaml(parsed), error: null };
      }
      const parsed = fromYaml(input);
      return { output: JSON.stringify(parsed, null, 2), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Could not convert." };
    }
  }, [input, jsonToYaml]);

  return (
    <ToolShell
      slug="json-yaml"
      title="JSON <> YAML Converter"
      description="Convert JSON data to YAML and vice versa."
    >
      <ConfigPanel>
        <ConfigRow
          icon={<ArrowRightLeft size={16} />}
          title="Direction"
          description="Block-style YAML only — no anchors, tags, or flow style"
        >
          <span className="text-sm text-[rgb(var(--muted))]">{jsonToYaml ? "JSON → YAML" : "YAML → JSON"}</span>
          <ModeToggle checked={jsonToYaml} onChange={setJsonToYaml} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel
          label={jsonToYaml ? "JSON input" : "YAML input"}
          value={input}
          onChange={setInput}
          placeholder={jsonToYaml ? SAMPLE_JSON : "key: value"}
        />
        <EditorPanel label={jsonToYaml ? "YAML output" : "JSON output"} value={output} readOnly suggestions={suggestions} />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </ToolShell>
  );
}
