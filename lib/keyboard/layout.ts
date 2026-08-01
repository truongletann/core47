export type OS = "windows" | "mac";

export interface KeyDef {
  code: string; // KeyboardEvent.code
  label: string;
  flex: number; // relative width
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

const QWERTY_ROW: KeyDef[] = [
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
  { code: "Backslash", label: "\\", flex: 1.5 },
];

const ASDF_ROW: KeyDef[] = [
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
  { code: "Enter", label: "Enter", flex: 2.2 },
];

const ZXCV_ROW: KeyDef[] = [
  { code: "ShiftLeft", label: "Shift", flex: 2.3 },
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

const ARROW_CLUSTER: KeyDef[] = [
  { code: "ArrowUp", label: "↑", flex: 1 },
  { code: "ArrowLeft", label: "←", flex: 1 },
  { code: "ArrowDown", label: "↓", flex: 1 },
  { code: "ArrowRight", label: "→", flex: 1 },
];

function bottomRow(os: OS): KeyDef[] {
  const ctrl = { label: "Ctrl" };
  const alt = os === "mac" ? "Option" : "Alt";
  const meta = os === "mac" ? "Cmd" : "Win";

  const left =
    os === "mac"
      ? [
          { code: "ControlLeft", label: ctrl.label, flex: 1.3 },
          { code: "AltLeft", label: alt, flex: 1.3 },
          { code: "MetaLeft", label: meta, flex: 1.3 },
        ]
      : [
          { code: "ControlLeft", label: ctrl.label, flex: 1.3 },
          { code: "MetaLeft", label: meta, flex: 1.3 },
          { code: "AltLeft", label: alt, flex: 1.3 },
        ];

  const right =
    os === "mac"
      ? [
          { code: "MetaRight", label: meta, flex: 1.3 },
          { code: "AltRight", label: alt, flex: 1.3 },
          { code: "ControlRight", label: ctrl.label, flex: 1.3 },
        ]
      : [
          { code: "AltRight", label: alt, flex: 1.3 },
          { code: "MetaRight", label: meta, flex: 1.3 },
          { code: "ContextMenu", label: "Menu", flex: 1.3 },
          { code: "ControlRight", label: ctrl.label, flex: 1.3 },
        ];

  return [...left, { code: "Space", label: "", flex: 6 }, ...right];
}

export function getKeyboardRows(os: OS): KeyDef[][] {
  return [FUNCTION_ROW, NUMBER_ROW, QWERTY_ROW, ASDF_ROW, ZXCV_ROW, bottomRow(os), ARROW_CLUSTER];
}

export function countTotalKeys(os: OS): number {
  return getKeyboardRows(os).reduce((sum, row) => sum + row.length, 0);
}
