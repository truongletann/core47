import { getDownloaderSettings } from "./settingsService";
import { ResolveDownloadSchema, type ResolveDownloadInput } from "./schema";

export interface ResolvedPickerItem {
  type: string; // "photo" | "video" | "gif"
  url: string;
  thumb?: string;
}

export interface ResolveOutcome {
  status: "tunnel" | "redirect" | "picker" | "error";
  url?: string;
  filename?: string;
  items?: ResolvedPickerItem[];
  audioUrl?: string;
  errorMessage?: string;
}

export class DownloaderNotConfiguredError extends Error {}

// Cloudflare Workers can't run yt-dlp/ffmpeg, so this calls out to an
// external Cobalt-API-compatible resolver (self-hosted or third-party) that
// the admin configures — see lib/downloader/settingsService.ts. Never call
// the public api.cobalt.tools instance here: its docs explicitly forbid
// third-party programmatic use without permission.
export async function resolveDownload(raw: ResolveDownloadInput): Promise<ResolveOutcome> {
  const input = ResolveDownloadSchema.parse(raw);
  const settings = await getDownloaderSettings();

  if (!settings.apiBaseUrl) {
    throw new DownloaderNotConfiguredError("DOWNLOADER_NOT_CONFIGURED");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (settings.apiKey) {
    headers.Authorization = `Api-Key ${settings.apiKey}`;
  }

  let res: Response;
  try {
    res = await fetch(settings.apiBaseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        url: input.url,
        videoQuality: input.videoQuality,
        audioFormat: input.audioFormat,
        downloadMode: input.downloadMode,
        filenameStyle: "pretty",
      }),
    });
  } catch {
    return { status: "error", errorMessage: "Couldn't reach the downloader backend." };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { status: "error", errorMessage: "Downloader backend returned an invalid response." };
  }

  return normalizeResponse(json);
}

function normalizeResponse(json: unknown): ResolveOutcome {
  if (typeof json !== "object" || json === null || !("status" in json)) {
    return { status: "error", errorMessage: "Unexpected response from downloader backend." };
  }
  const body = json as Record<string, unknown>;
  const status = body.status;

  if (status === "tunnel" || status === "redirect") {
    return {
      status,
      url: typeof body.url === "string" ? body.url : undefined,
      filename: typeof body.filename === "string" ? body.filename : undefined,
    };
  }

  if (status === "picker") {
    const rawItems = Array.isArray(body.picker) ? body.picker : [];
    const items: ResolvedPickerItem[] = rawItems
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item) => ({
        type: typeof item.type === "string" ? item.type : "video",
        url: typeof item.url === "string" ? item.url : "",
        thumb: typeof item.thumb === "string" ? item.thumb : undefined,
      }))
      .filter((item) => item.url);

    return {
      status: "picker",
      items,
      audioUrl: typeof body.audio === "string" ? body.audio : undefined,
    };
  }

  if (status === "error") {
    const errorObj = body.error as Record<string, unknown> | undefined;
    const code = errorObj && typeof errorObj.code === "string" ? errorObj.code : "UNKNOWN_ERROR";
    return { status: "error", errorMessage: code };
  }

  // "local-processing" and any other unsupported status — we have no
  // client-side ffmpeg/wasm transcoder wired up, so surface it as an error.
  return { status: "error", errorMessage: "This link needs a processing mode we don't support yet." };
}
