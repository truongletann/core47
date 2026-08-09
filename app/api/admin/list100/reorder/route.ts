import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { swapList100Rank, reorderList100Items } from "@/lib/admin/service";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const { idA, idB, orderedIds } = (body ?? {}) as {
    idA?: unknown;
    idB?: unknown;
    orderedIds?: unknown;
  };

  try {
    if (Array.isArray(orderedIds) && orderedIds.every((id) => typeof id === "string")) {
      await reorderList100Items(orderedIds);
      return NextResponse.json({ success: true });
    }

    if (typeof idA === "string" && typeof idB === "string" && idA && idB) {
      await swapList100Rank(idA, idB);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
