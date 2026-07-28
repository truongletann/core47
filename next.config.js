/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép Next.js dev server nhận request từ core47.xyz và mọi subdomain của nó
  // (mặc định Next.js chỉ tin tưởng "localhost", chặn bớt tài nguyên dev với host khác
  // để chống DNS rebinding attack — đây là nguyên nhân gây lỗi CSS/JS/nút bấm không
  // phản hồi khi test qua *.core47.xyz:3000 thay vì localhost:3000).
  allowedDevOrigins: ["core47.xyz", "*.core47.xyz"],
};

module.exports = nextConfig;

// Bật Cloudflare bindings (D1/R2) khi chạy `next dev` ở local.
try {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch (e) {
  // Bỏ qua nếu chưa cài package — không chặn dev server chạy
}