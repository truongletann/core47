import { NextRequest, NextResponse } from "next/server";
import { listBooks, createBook } from "@/lib/books/service";
import { CreateBookMetaSchema } from "@/lib/books/schema";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

const MAX_SIZE = 80 * 1024 * 1024; // 80MB — scanned PDFs can be large, stay under Workers' request body ceiling
const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB
const COVER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TYPE_BY_MIME: Record<string, "pdf" | "epub"> = {
  "application/pdf": "pdf",
  "application/epub+zip": "epub",
};

function detectFileType(file: File): "pdf" | "epub" | null {
  if (TYPE_BY_MIME[file.type]) return TYPE_BY_MIME[file.type];
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".epub")) return "epub";
  return null;
}

export async function GET() {
  const books = await listBooks();
  return NextResponse.json({ success: true, data: { books } });
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const allowed = await checkRateLimit(`books:upload:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_FORM" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "NO_FILE" }, { status: 400 });
  }

  const fileType = detectFileType(file);
  if (!fileType) {
    return NextResponse.json({ success: false, error: "INVALID_TYPE" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "TOO_LARGE" }, { status: 400 });
  }

  const parseResult = CreateBookMetaSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author") || undefined,
    description: formData.get("description") || undefined,
    genre: formData.get("genre") || undefined,
  });
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  let cover: { buffer: ArrayBuffer; contentType: string } | null = null;
  const coverFile = formData.get("cover");
  if (coverFile instanceof File && coverFile.size > 0) {
    if (!COVER_TYPES.includes(coverFile.type)) {
      return NextResponse.json({ success: false, error: "INVALID_COVER_TYPE" }, { status: 400 });
    }
    if (coverFile.size > MAX_COVER_SIZE) {
      return NextResponse.json({ success: false, error: "COVER_TOO_LARGE" }, { status: 400 });
    }
    cover = { buffer: await coverFile.arrayBuffer(), contentType: coverFile.type };
  }

  const book = await createBook(
    parseResult.data,
    {
      fileType,
      size: file.size,
      buffer: await file.arrayBuffer(),
      contentType: fileType === "pdf" ? "application/pdf" : "application/epub+zip",
    },
    cover,
    ip,
  );

  return NextResponse.json({ success: true, data: { book } }, { status: 201 });
}
