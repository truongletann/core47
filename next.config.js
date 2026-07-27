/** @type {import('next').NextConfig} */
const nextConfig = {
  // config options here (để trống ở Phase 1)
};

module.exports = nextConfig;

// Bật Cloudflare bindings (D1/R2) khi chạy `next dev` ở local.
// Nếu dòng dưới gây lỗi vì chưa cài @opennextjs/cloudflare, có thể comment lại,
// không ảnh hưởng đến việc chạy `npm run dev` bình thường.
try {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch (e) {
  // Bỏ qua nếu chưa cài package — không chặn dev server chạy
}