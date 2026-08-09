"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ShieldQuestion, Upload } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { buildQrGrid, gridToSvg, type ErrorCorrectionLevel } from "@/lib/toolbox/qr";

const EC_LEVELS: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];
const MODULE_SIZE = 8;

// Chrome/Edge support scanning QR codes via the native Shape Detection API;
// Firefox/Safari don't, so decode falls back to a clear "unsupported" message
// instead of pulling in a JS decoder library just for those browsers.
declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats: string[] }) => {
      detect(source: ImageBitmapSource): Promise<{ rawValue: string }[]>;
    };
  }
}

export default function QrCodePage() {
  const [mode, setMode] = useState<"generate" | "scan">("generate");
  const [text, setText] = useState("https://core47.xyz");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState("");

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [detectorSupported, setDetectorSupported] = useState(true);

  useEffect(() => {
    setDetectorSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);

  useEffect(() => {
    if (mode !== "generate" || !text.trim()) {
      setSvgMarkup("");
      return;
    }
    try {
      const grid = buildQrGrid(text, ecLevel);
      setSvgMarkup(gridToSvg(grid, MODULE_SIZE));
      setGenError(null);

      const canvas = canvasRef.current;
      if (canvas) {
        const size = grid.length * MODULE_SIZE;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);
          ctx.fillStyle = "#000000";
          for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid.length; col++) {
              if (grid[row][col]) ctx.fillRect(col * MODULE_SIZE, row * MODULE_SIZE, MODULE_SIZE, MODULE_SIZE);
            }
          }
        }
      }
    } catch (e) {
      setSvgMarkup("");
      setGenError(e instanceof Error ? e.message : "Could not generate a QR code for this input.");
    }
  }, [text, ecLevel, mode]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
  }

  function downloadSvg() {
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleScanFile(file: File) {
    setScanResult(null);
    setScanError(null);
    if (!window.BarcodeDetector) {
      setScanError("This browser doesn't support scanning QR codes from an image.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const results = await detector.detect(bitmap);
      if (results.length === 0) {
        setScanError("No QR code found in this image.");
      } else {
        setScanResult(results[0].rawValue);
      }
    } catch {
      setScanError("Could not read this image.");
    }
  }

  return (
    <ToolShell slug="qr-code" title="QR Code Encoder / Decoder" description="Read or generate a QR Code from text.">
      <ConfigPanel>
        <ConfigRow icon={<Upload size={16} />} title="Mode" description="Generate a QR code, or scan one from an image">
          <span className="text-sm text-[rgb(var(--muted))]">{mode === "generate" ? "Generate" : "Scan"}</span>
          <ModeToggle checked={mode === "generate"} onChange={(v) => setMode(v ? "generate" : "scan")} />
        </ConfigRow>
        {mode === "generate" && (
          <ConfigRow icon={<ShieldQuestion size={16} />} title="Error correction" description="Higher levels tolerate more damage but produce denser codes">
            <select
              value={ecLevel}
              onChange={(e) => setEcLevel(e.target.value as ErrorCorrectionLevel)}
              className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            >
              {EC_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </ConfigRow>
        )}
      </ConfigPanel>

      {mode === "generate" ? (
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row">
          <div className="flex-1">
            <p className="mb-1 text-sm text-[rgb(var(--muted))]">Text or URL</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="font-data w-full resize-none rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
            {genError && <p className="mt-2 text-xs text-red-600">{genError}</p>}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-3">
              <canvas ref={canvasRef} className="block" style={{ imageRendering: "pixelated" }} />
            </div>
            {svgMarkup && (
              <div className="flex gap-2">
                <button
                  onClick={downloadPng}
                  className="flex items-center gap-1 rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  <Download size={13} /> PNG
                </button>
                <button
                  onClick={downloadSvg}
                  className="flex items-center gap-1 rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                >
                  <Download size={13} /> SVG
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {!detectorSupported && (
            <p className="mb-3 text-xs text-amber-600">
              Your browser doesn&apos;t support the native barcode scanner (Chrome/Edge only). Upload will fail.
            </p>
          )}
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[rgb(var(--border))] p-10 text-center hover:border-[rgb(var(--accent))]">
            <Upload size={20} className="text-[rgb(var(--muted))]" />
            <span className="text-sm text-[rgb(var(--muted))]">Click to choose an image containing a QR code</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleScanFile(file);
              }}
            />
          </label>

          {scanError && <p className="mt-3 text-xs text-red-600">{scanError}</p>}
          {scanResult && (
            <div className="mt-3 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
              <p className="mb-1 text-xs font-semibold text-[rgb(var(--muted))]">Decoded content</p>
              <p className="font-data break-all text-sm">{scanResult}</p>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
