const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.core47.xyz wss://www.fxtin.com:39555 https://www.fxtin.com wss://stream.binance.com https://api.binance.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the Next.js dev server to accept requests from core47.xyz and all
  // its subdomains (by default Next.js only trusts "localhost" and blocks
  // dev assets from other hosts to guard against DNS rebinding attacks —
  // this is what causes CSS/JS/buttons to silently not respond when testing
  // via *.core47.xyz:3000 instead of localhost:3000).
  allowedDevOrigins: ["core47.xyz", "*.core47.xyz"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

// Enable Cloudflare bindings (D1/R2) when running `next dev` locally.
try {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch (e) {
  // Ignore if the package isn't installed yet — don't block the dev server
}
