/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the Next.js dev server to accept requests from core47.xyz and all
  // its subdomains (by default Next.js only trusts "localhost" and blocks
  // dev assets from other hosts to guard against DNS rebinding attacks —
  // this is what causes CSS/JS/buttons to silently not respond when testing
  // via *.core47.xyz:3000 instead of localhost:3000).
  allowedDevOrigins: ["core47.xyz", "*.core47.xyz"],
};

module.exports = nextConfig;

// Enable Cloudflare bindings (D1/R2) when running `next dev` locally.
try {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch (e) {
  // Ignore if the package isn't installed yet — don't block the dev server
}
