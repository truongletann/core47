import { NextRequest, NextResponse } from "next/server";
import { createShortLink } from "@/lib/shortlink/service";
import { CreateShortLinkSchema } from "@/lib/shortlink/schema";
import { SHORT_DOMAIN } from "@/lib/shortlink/config";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = CreateShortLinkSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_INPUT",
        issues: parseResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  const ipAddress = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for");
  const userAgent = req.headers.get("user-agent");

  try {
    const link = await createShortLink(parseResult.data, {
      userId: user?.id ?? null,
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      {
        success: true,
        data: {
          code: link.code,
          shortUrl: `https://${SHORT_DOMAIN}/${link.code}`,
          targetUrl: link.targetUrl,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "CODE_TAKEN") {
      return NextResponse.json({ success: false, error: "CODE_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}