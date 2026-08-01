export type OS = "windows" | "mac";
export type BoardLayout = "ansi" | "iso";

export interface KeyDef {
  code: string; // KeyboardEvent.code
  label: string;
  flex: number; // relative width, 0 = invisible spacer of that width
}

export interface GridKey {
  code: string;
  label: string;
  row: number; // 1-indexed
  col: number; // 1-indexed
  rowSpan?: number;
  colSpan?: number;
}

const FUNCTION_ROW: KeyDef[] = [
  { code: "Escape", label: "Esc", flex: 1.3 },
  { code: "F1", label: "F1", flex: 1 },
  { code: "F2", label: "F2", flex: 1 },
  { code: "F3", label: "F3", flex: 1 },
  { code: "F4", label: "F4", flex: 1 },
  { code: "F5", label: "F5", flex: 1 },
  { code: "F6", label: "F6", flex: 1 },
  { code: "F7", label: "F7", flex: 1 },
  { code: "F8", label: "F8", flex: 1 },
  { code: "F9", label: "F9", flex: 1 },
  { code: "F10", label: "F10", flex: 1 },
  { code: "F11", label: "F11", flex: 1 },
  { code: "F12", label: "F12", flex: 1 },
];

const NUMBER_ROW: KeyDef[] = [
  { code: "Backquote", label: "`", flex: 1 },
  { code: "Digit1", label: "1", flex: 1 },
  { code: "Digit2", label: "2", flex: 1 },
  { code: "Digit3", label: "3", flex: 1 },
  { code: "Digit4", label: "4", flex: 1 },
  { code: "Digit5", label: "5", flex: 1 },
  { code: "Digit6", label: "6", flex: 1 },
  { code: "Digit7", label: "7", flex: 1 },
  { code: "Digit8", label: "8", flex: 1 },
  { code: "Digit9", label: "9", flex: 1 },
  { code: "Digit0", label: "0", flex: 1 },
  { code: "Minus", label: "-", flex: 1 },
  { code: "Equal", label: "=", flex: 1 },
  { code: "Backspace", label: "Backspace", flex: 2 },
];

// ANSI keeps Backslash at the end of the QWERTY row with a single-row Enter
// below. ISO drops that Backslash (its Enter key physically wraps down and
// occupies that space instead — we approximate the wrap with a wider Enter
// rather than a true L-shape) and adds a separate "IntlBackslash" key
// between left Shift and Z, which is where ISO boards actually put it.
function qwertyRow(layout: BoardLayout): KeyDef[] {
  const base: KeyDef[] = [
    { code: "Tab", label: "Tab", flex: 1.5 },
    { code: "KeyQ", label: "Q", flex: 1 },
    { code: "KeyW", label: "W", flex: 1 },
    { code: "KeyE", label: "E", flex: 1 },
    { code: "KeyR", label: "R", flex: 1 },
    { code: "KeyT", label: "T", flex: 1 },
    { code: "KeyY", label: "Y", flex: 1 },
    { code: "KeyU", label: "U", flex: 1 },
    { code: "KeyI", label: "I", flex: 1 },
    { code: "KeyO", label: "O", flex: 1 },
    { code: "KeyP", label: "P", flex: 1 },
    { code: "BracketLeft", label: "[", flex: 1 },
    { code: "BracketRight", label: "]", flex: 1 },
  ];
  if (layout === "ansi") base.push({ code: "Backslash", label: "\\", flex: 1.5 });
  return base;
}

function asdfRow(layout: BoardLayout): KeyDef[] {
  return [
    { code: "CapsLock", label: "Caps", flex: 1.8 },
    { code: "KeyA", label: "A", flex: 1 },
    { code: "KeyS", label: "S", flex: 1 },
    { code: "KeyD", label: "D", flex: 1 },
    { code: "KeyF", label: "F", flex: 1 },
    { code: "KeyG", label: "G", flex: 1 },
    { code: "KeyH", label: "H", flex: 1 },
    { code: "KeyJ", label: "J", flex: 1 },
    { code: "KeyK", label: "K", flex: 1 },
    { code: "KeyL", label: "L", flex: 1 },
    { code: "Semicolon", label: ";", flex: 1 },
    { code: "Quote", label: "'", flex: 1 },
    { code: "Enter", label: "Enter", flex: layout === "iso" ? 2.6 : 2.2 },
  ];
}

function zxcvRow(layout: BoardLayout): KeyDef[] {
  const shiftLeft: KeyDef =
    layout === "iso" ? { code: "ShiftLeft", label: "Shift", flex: 1.3 } : { code: "ShiftLeft", label: "Shift", flex: 2.3 };
  const isoKey: KeyDef[] = layout === "iso" ? [{ code: "IntlBackslash", label: "\\", flex: 1 }] : [];

  return [
    shiftLeft,
    ...isoKey,
    { code: "KeyZ", label: "Z", flex: 1 },
    { code: "KeyX", label: "X", flex: 1 },
    { code: "KeyC", label: "C", flex: 1 },
    { code: "KeyV", label: "V", flex: 1 },
    { code: "KeyB", label: "B", flex: 1 },
    { code: "KeyN", label: "N", flex: 1 },
    { code: "KeyM", label: "M", flex: 1 },
    { code: "Comma", label: ",", flex: 1 },
    { code: "Period", label: ".", flex: 1 },
    { code: "Slash", label: "/", flex: 1 },
    { code: "ShiftRight", label: "Shift", flex: 2.7 },
  ];
}

function bottomRow(os: OS): KeyDef[] {
  const alt = os === "mac" ? "Option" : "Alt";
  const meta = os === "mac" ? "Cmd" : "Win";

  const left =
    os === "mac"
      ? [
          { code: "ControlLeft", label: "Ctrl", flex: 1.3 },
          { code: "AltLeft", label: alt, flex: 1.3 },
          { code: "MetaLeft", label: meta, flex: 1.3 },
        ]
      : [
          { code: "ControlLeft", label: "Ctrl", flex: 1.3 },
          { code: "MetaLeft", label: meta, flex: 1.3 },
          { code: "AltLeft", label: alt, flex: 1.3 },
        ];

  const right =
    os === "mac"
      ? [
          { code: "MetaRight", label: meta, flex: 1.3 },
          { code: "AltRight", label: alt, flex: 1.3 },
          { code: "ControlRight", label: "Ctrl", flex: 1.3 },
        ]
      : [
          { code: "AltRight", label: alt, flex: 1.3 },
          { code: "MetaRight", label: meta, flex: 1.3 },
          { code: "ContextMenu", label: "Menu", flex: 1.3 },
          { code: "ControlRight", label: "Ctrl", flex: 1.3 },
        ];

  return [...left, { code: "Space", label: "", flex: 6 }, ...right];
}

/** Main alphanumeric block — function row through the space bar row. */
export function getKeyboardRows(os: OS, layout: BoardLayout = "ansi"): KeyDef[][] {
  return [FUNCTION_ROW, NUMBER_ROW, qwertyRow(layout), asdfRow(layout), zxcvRow(layout), bottomRow(os)];
}

/**
 * Nav / system cluster, six rows to line up next to the main block:
 * PrtSc/ScrLk/Pause, Ins/Home/PgUp, Del/End/PgDn, a spacer (Caps row has no
 * neighbor), the Up arrow (Z row), then Left/Down/Right (bottom row).
 */
export function getNavCluster(): KeyDef[][] {
  return [
    [
      { code: "PrintScreen", label: "PrtSc", flex: 1 },
      { code: "ScrollLock", label: "ScrLk", flex: 1 },
      { code: "Pause", label: "Pause", flex: 1 },
    ],
    [
      { code: "Insert", label: "Ins", flex: 1 },
      { code: "Home", label: "Home", flex: 1 },
      { code: "PageUp", label: "PgUp", flex: 1 },
    ],
    [
      { code: "Delete", label: "Del", flex: 1 },
      { code: "End", label: "End", flex: 1 },
      { code: "PageDown", label: "PgDn", flex: 1 },
    ],
    [{ code: "__spacer_0", label: "", flex: 3 }],
    [
      { code: "__spacer_1", label: "", flex: 1 },
      { code: "ArrowUp", label: "↑", flex: 1 },
      { code: "__spacer_2", label: "", flex: 1 },
    ],
    [
      { code: "ArrowLeft", label: "←", flex: 1 },
      { code: "ArrowDown", label: "↓", flex: 1 },
      { code: "ArrowRight", label: "→", flex: 1 },
    ],
  ];
}

/** Numpad — CSS grid so NumpadAdd/NumpadEnter/Numpad0 can span cells like a real keyboard. */
export function getNumpadKeys(): GridKey[] {
  return [
    { code: "NumLock", label: "Num", row: 1, col: 1 },
    { code: "NumpadDivide", label: "/", row: 1, col: 2 },
    { code: "NumpadMultiply", label: "*", row: 1, col: 3 },
    { code: "NumpadSubtract", label: "-", row: 1, col: 4 },
    { code: "Numpad7", label: "7", row: 2, col: 1 },
    { code: "Numpad8", label: "8", row: 2, col: 2 },
    { code: "Numpad9", label: "9", row: 2, col: 3 },
    { code: "NumpadAdd", label: "+", row: 2, col: 4, rowSpan: 2 },
    { code: "Numpad4", label: "4", row: 3, col: 1 },
    { code: "Numpad5", label: "5", row: 3, col: 2 },
    { code: "Numpad6", label: "6", row: 3, col: 3 },
    { code: "Numpad1", label: "1", row: 4, col: 1 },
    { code: "Numpad2", label: "2", row: 4, col: 2 },
    { code: "Numpad3", label: "3", row: 4, col: 3 },
    { code: "NumpadEnter", label: "Enter", row: 4, col: 4, rowSpan: 2 },
    { code: "Numpad0", label: "0", row: 5, col: 1, colSpan: 2 },
    { code: "NumpadDecimal", label: ".", row: 5, col: 3 },
  ];
}

export function isSpacer(code: string): boolean {
  return code.startsWith("__spacer_");
}

/** Flat list of every real (non-spacer) key on the board, for counting and for the "not tested yet" list. */
export function getAllKeys(os: OS, layout: BoardLayout = "ansi"): { code: string; label: string }[] {
  const main = getKeyboardRows(os, layout)
    .flat()
    .filter((k) => !isSpacer(k.code));
  const nav = getNavCluster()
    .flat()
    .filter((k) => !isSpacer(k.code));
  const numpad = getNumpadKeys();
  return [...main, ...nav, ...numpad].map((k) => ({ code: k.code, label: k.label || k.code }));
}

export function countTotalKeys(os: OS, layout: BoardLayout = "ansi"): number {
  return getAllKeys(os, layout).length;
}
