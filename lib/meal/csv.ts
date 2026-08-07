// Minimal RFC4180-ish CSV parser — hand-rolled instead of a dependency to
// keep this out of the Worker bundle weight (see CONVENTIONS.md's note on
// the 3MiB gzip cap; the blog markdown sanitizer follows the same
// hand-rolled-over-dependency pattern). Supports quoted fields, embedded
// commas/newlines inside quotes, and "" as an escaped quote.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      i++;
      continue;
    }
    field += ch;
    i++;
  }

  // last field/row (file may or may not end with a trailing newline)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

// One ingredient cell looks like "Name:Qty:Unit; Name:Qty:Unit; ..."
export function parseIngredientsCell(cell: string): { name: string; quantity: number; unit: string }[] {
  return cell
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, qtyStr, unit] = part.split(":").map((s) => s.trim());
      return { name: name ?? "", quantity: Number(qtyStr) || 0, unit: unit ?? "" };
    });
}
