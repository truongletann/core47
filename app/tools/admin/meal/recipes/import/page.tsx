"use client";

import { useState } from "react";
import Link from "next/link";

const SAMPLE_CSV = `name,description,instructions,servings,caloriesPerServing,proteinG,fatG,carbG,goalTags,ingredients
"Ức gà áp chảo rau củ","Món giàu đạm, ít béo","1. Ướp ức gà với muối tiêu.
2. Áp chảo chín vàng hai mặt.
3. Dọn cùng rau củ xào.",1,350,55,8,10,"lose_weight","Ức gà:200:g;Bông cải xanh:150:g"
`;

interface ImportResult {
  created: number;
  errors: { row: number; message: string }[];
}

export default function AdminMealRecipesImportPage() {
  const [csv, setCsv] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    setImporting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/meal/recipes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        missing?: string[];
        data?: ImportResult;
      };
      if (!json.success) {
        setError(
          json.error === "MISSING_COLUMNS"
            ? `Thiếu cột: ${json.missing?.join(", ")}`
            : json.error ?? "Import thất bại",
        );
        return;
      }
      if (json.data) setResult(json.data);
    } finally {
      setImporting(false);
    }
  }

  function handleDownloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meal-recipes-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Import công thức (CSV)</h1>
        <Link href="/meal/recipes" className="text-sm text-[rgb(var(--accent))] hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="mb-4 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm">
        <p className="mb-2 font-semibold">Định dạng CSV (bắt buộc đủ cột, đúng tên cột ở dòng đầu):</p>
        <p className="font-data mb-2 overflow-x-auto whitespace-pre text-xs text-[rgb(var(--muted))]">
          name, description, instructions, servings, caloriesPerServing, proteinG, fatG, carbG, goalTags, ingredients
        </p>
        <ul className="mb-2 list-disc pl-5 text-xs text-[rgb(var(--muted))]">
          <li>
            <strong>goalTags</strong>: một hoặc nhiều trong{" "}
            <code>lose_weight, maintain, gain_weight, gain_muscle</code>, cách nhau bởi dấu phẩy (trong ngoặc kép).
          </li>
          <li>
            <strong>ingredients</strong>: mỗi nguyên liệu dạng <code>Tên:SốLượng:ĐơnVị</code>, các nguyên liệu cách
            nhau bởi dấu chấm phẩy — vd <code>Ức gà:200:g;Cà chua:100:g</code>.
          </li>
          <li>Ô nào chứa dấu phẩy, xuống dòng thì phải bọc trong dấu ngoặc kép (chuẩn CSV).</li>
        </ul>
        <button
          onClick={handleDownloadSample}
          className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)]"
        >
          Tải file mẫu
        </button>
      </div>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder="Dán nội dung CSV vào đây..."
        rows={14}
        className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
      />

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-3 rounded-md border border-[rgb(var(--border))] p-3 text-sm">
          <p className="font-semibold text-[rgb(var(--accent))]">Đã tạo {result.created} công thức.</p>
          {result.errors.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-red-600">{result.errors.length} dòng lỗi:</p>
              <ul className="mt-1 list-disc pl-5 text-xs text-[rgb(var(--muted))]">
                {result.errors.map((e) => (
                  <li key={e.row}>
                    Dòng {e.row}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={importing || !csv.trim()}
        className="mt-4 rounded-lg bg-[rgb(var(--accent))] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {importing ? "Đang import..." : "Import"}
      </button>
    </div>
  );
}
