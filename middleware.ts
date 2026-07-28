import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = "core47.xyz";

// Domain riêng của từng tool (không phải subdomain của core47.xyz).
// Thêm tool nào có domain riêng thì khai báo thêm 1 dòng ở đây.
const STANDALONE_TOOL_DOMAINS: Record<string, string> = {
  "to2.site": "shortlink",
  "www.to2.site": "shortlink",
};

// LƯU Ý: dùng convention "middleware.ts" (không phải "proxy.ts") có chủ đích —
// proxy.ts của Next.js 16 chỉ chạy Node.js runtime, không hỗ trợ Edge Runtime,
// mà @opennextjs/cloudflare bắt buộc cần Edge Runtime. Giữ nguyên middleware.ts.
export function middleware(req: NextRequest) {
  const hostHeader = req.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0]; // bỏ port khi chạy local (vd: localhost:3000)
  const url = req.nextUrl.clone();

  // Domain riêng đứng độc lập (vd: to2.site) — CHỈ dùng để redirect mã code,
  // không hiện form tạo link (form tạo link nằm ở shortlink.core47.xyz).
  if (hostname in STANDALONE_TOOL_DOMAINS) {
    const toolSlug = STANDALONE_TOOL_DOMAINS[hostname];

    // Vào thẳng domain gốc (không có mã code) → đẩy sang trang tạo link thật
    if (url.pathname === "/") {
      return NextResponse.redirect(`https://${toolSlug}.${ROOT_DOMAIN}/`, 307);
    }

    // Có mã code phía sau (vd: /a782) → rewrite vào route xử lý redirect
    url.pathname = `/tools/${toolSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Domain gốc / localhost — không rewrite, phục vụ trang chủ hub bình thường
  if (
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost"
  ) {
    return NextResponse.next();
  }

  // Chỉ xử lý đúng dạng *.core47.xyz, host lạ khác thì bỏ qua không đụng vào
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  const subdomain = hostname.slice(0, -(`.${ROOT_DOMAIN}`.length));

  // Validate chặt — chỉ cho phép chữ thường/số/gạch ngang, chặn ký tự lạ
  // trước khi dùng để dựng lại pathname nội bộ (tránh path traversal).
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return NextResponse.next();
  }

  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/tools/${subdomain}${suffix}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};