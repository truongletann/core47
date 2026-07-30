// Cron expression parser/evaluator — pure client-side, no external dependencies.

export interface CronField {
  raw: string;
  values: number[];
}

export interface CronFields {
  second: CronField;
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
}

const MONTH_NAMES: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};
const DOW_NAMES: Record<string, number> = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function resolveToken(token: string, nameMap?: Record<string, number>): number {
  const trimmed = token.trim();
  const named = nameMap?.[trimmed.toUpperCase()];
  if (named !== undefined) return named;
  return Number(trimmed);
}

function parseField(raw: string, min: number, max: number, nameMap?: Record<string, number>): CronField {
  const isDow = min === 0 && max === 6;
  const values = new Set<number>();

  for (const rawPart of raw.split(",")) {
    const part = rawPart.trim();
    if (!part) throw new Error(`Invalid field: "${raw}"`);

    let step = 1;
    let rangePart = part;
    const stepMatch = part.match(/^(.*)\/(\d+)$/);
    if (stepMatch) {
      rangePart = stepMatch[1];
      step = parseInt(stepMatch[2], 10);
      if (!step || step < 1) throw new Error(`Invalid step value in "${raw}"`);
    }

    let start: number;
    let end: number;
    if (rangePart === "*") {
      start = min;
      end = max;
    } else if (rangePart.includes("-")) {
      const [aRaw, bRaw] = rangePart.split("-");
      start = resolveToken(aRaw, nameMap);
      end = resolveToken(bRaw, nameMap);
    } else {
      start = end = resolveToken(rangePart, nameMap);
    }

    if (Number.isNaN(start) || Number.isNaN(end)) {
      throw new Error(`Invalid value in "${raw}"`);
    }
    if (isDow) {
      if (start === 7) start = 0;
      if (end === 7) end = 0;
    }
    if (start < min || end > max || start > end) {
      throw new Error(`Value out of range (${min}-${max}) in "${raw}"`);
    }

    for (let v = start; v <= end; v += step) {
      values.add(v);
    }
  }

  return { raw: raw.trim(), values: Array.from(values).sort((a, b) => a - b) };
}

export function parseCronExpression(expression: string, includeSeconds: boolean): CronFields {
  const trimmed = expression.trim().replace(/\s+/g, " ");
  if (!trimmed) throw new Error("Cron expression is empty.");

  const parts = trimmed.split(" ");
  const expected = includeSeconds ? 6 : 5;
  if (parts.length !== expected) {
    throw new Error(`Expression must have ${expected} fields (got ${parts.length}).`);
  }

  let i = 0;
  const second = includeSeconds ? parseField(parts[i++], 0, 59) : { raw: "0", values: [0] };
  const minute = parseField(parts[i++], 0, 59);
  const hour = parseField(parts[i++], 0, 23);
  const dayOfMonth = parseField(parts[i++], 1, 31);
  const month = parseField(parts[i++], 1, 12, MONTH_NAMES);
  const dayOfWeek = parseField(parts[i++], 0, 6, DOW_NAMES);

  return { second, minute, hour, dayOfMonth, month, dayOfWeek };
}

function matchesDay(fields: CronFields, date: Date): boolean {
  const domWild = fields.dayOfMonth.raw === "*";
  const dowWild = fields.dayOfWeek.raw === "*";
  const domMatch = fields.dayOfMonth.values.includes(date.getDate());
  const dowMatch = fields.dayOfWeek.values.includes(date.getDay());

  if (domWild && dowWild) return true;
  if (!domWild && !dowWild) return domMatch || dowMatch;
  return domWild ? dowMatch : domMatch;
}

export function getNextDates(
  fields: CronFields,
  includeSeconds: boolean,
  count: number,
  from: Date = new Date(),
): Date[] {
  const results: Date[] = [];
  const cur = new Date(from.getTime());
  cur.setMilliseconds(0);

  if (includeSeconds) {
    cur.setSeconds(cur.getSeconds() + 1);
  } else {
    cur.setSeconds(0);
    cur.setMinutes(cur.getMinutes() + 1);
  }

  const limitDate = new Date(from.getTime());
  limitDate.setFullYear(limitDate.getFullYear() + 5);

  let iterations = 0;
  const maxIterations = 200_000;

  while (results.length < count && iterations < maxIterations && cur <= limitDate) {
    iterations++;

    if (!fields.month.values.includes(cur.getMonth() + 1)) {
      cur.setMonth(cur.getMonth() + 1, 1);
      cur.setHours(0, 0, 0, 0);
      continue;
    }
    if (!matchesDay(fields, cur)) {
      cur.setDate(cur.getDate() + 1);
      cur.setHours(0, 0, 0, 0);
      continue;
    }
    if (!fields.hour.values.includes(cur.getHours())) {
      cur.setHours(cur.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (!fields.minute.values.includes(cur.getMinutes())) {
      cur.setMinutes(cur.getMinutes() + 1, 0, 0);
      continue;
    }
    if (includeSeconds && !fields.second.values.includes(cur.getSeconds())) {
      cur.setSeconds(cur.getSeconds() + 1, 0);
      continue;
    }

    results.push(new Date(cur.getTime()));
    if (includeSeconds) cur.setSeconds(cur.getSeconds() + 1);
    else cur.setMinutes(cur.getMinutes() + 1);
  }

  return results;
}

function joinList(values: string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function describeUnitField(field: CronField, unit: string): string | null {
  if (field.raw === "*") return null;
  const stepMatch = field.raw.match(/^\*\/(\d+)$/);
  if (stepMatch) return `every ${stepMatch[1]} ${unit}${stepMatch[1] === "1" ? "" : "s"}`;
  if (field.values.length === 1) return `at ${unit} ${field.values[0]}`;
  return `at ${unit}s ${joinList(field.values.map(String))}`;
}

function describeWeekdays(values: number[]): string {
  const isConsecutiveRange =
    values.length > 1 && values.every((v, idx) => idx === 0 || v === values[idx - 1] + 1);
  if (isConsecutiveRange) {
    return `${WEEKDAY_FULL[values[0]]} through ${WEEKDAY_FULL[values[values.length - 1]]}`;
  }
  return joinList(values.map((v) => WEEKDAY_FULL[v]));
}

function describeMonths(values: number[]): string {
  return joinList(values.map((v) => MONTH_FULL[v - 1]));
}

export function describeCron(fields: CronFields, includeSeconds: boolean): string {
  const parts: string[] = [];

  const allTimeWild =
    (!includeSeconds || fields.second.raw === "*") && fields.minute.raw === "*" && fields.hour.raw === "*";
  const fixedTime =
    (!includeSeconds || fields.second.values.length === 1) &&
    fields.minute.values.length === 1 &&
    fields.hour.values.length === 1 &&
    fields.minute.raw !== "*" &&
    fields.hour.raw !== "*";

  if (allTimeWild) {
    parts.push(includeSeconds ? "Every second" : "Every minute");
  } else if (fixedTime) {
    const hh = String(fields.hour.values[0]).padStart(2, "0");
    const mm = String(fields.minute.values[0]).padStart(2, "0");
    const ss = includeSeconds ? String(fields.second.values[0]).padStart(2, "0") : null;
    parts.push(`At ${hh}:${mm}${ss !== null ? `:${ss}` : ""}`);
  } else {
    if (includeSeconds) {
      const desc = describeUnitField(fields.second, "second");
      if (desc) parts.push(desc);
    }
    const minDesc = describeUnitField(fields.minute, "minute");
    if (minDesc) parts.push(minDesc);
    const hourDesc = describeUnitField(fields.hour, "hour");
    if (hourDesc) parts.push(hourDesc);
  }

  if (fields.dayOfMonth.raw !== "*") {
    parts.push(`on day ${joinList(fields.dayOfMonth.values.map(String))} of the month`);
  }
  if (fields.month.raw !== "*") {
    parts.push(`in ${describeMonths(fields.month.values)}`);
  }
  if (fields.dayOfWeek.raw !== "*") {
    parts.push(`on ${describeWeekdays(fields.dayOfWeek.values)}`);
  }

  return parts.filter(Boolean).join(", ");
}

const FORMAT_TOKEN_RE = /yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|A|a/g;

export function formatDate(date: Date, format: string): string {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const ampm = hours24 < 12 ? "AM" : "PM";
  const pad2 = (n: number) => String(n).padStart(2, "0");

  return format.replace(FORMAT_TOKEN_RE, (token) => {
    switch (token) {
      case "yyyy": return String(date.getFullYear());
      case "yy": return String(date.getFullYear()).slice(-2);
      case "MMMM": return MONTH_FULL[date.getMonth()];
      case "MMM": return MONTH_SHORT[date.getMonth()];
      case "MM": return pad2(date.getMonth() + 1);
      case "M": return String(date.getMonth() + 1);
      case "dddd": return WEEKDAY_FULL[date.getDay()];
      case "ddd": return WEEKDAY_SHORT[date.getDay()];
      case "dd": return pad2(date.getDate());
      case "d": return String(date.getDate());
      case "HH": return pad2(hours24);
      case "H": return String(hours24);
      case "hh": return pad2(hours12);
      case "h": return String(hours12);
      case "mm": return pad2(date.getMinutes());
      case "m": return String(date.getMinutes());
      case "ss": return pad2(date.getSeconds());
      case "s": return String(date.getSeconds());
      case "A": return ampm;
      case "a": return ampm.toLowerCase();
      default: return token;
    }
  });
}
