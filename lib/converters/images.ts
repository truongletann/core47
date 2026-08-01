// Client-only image format conversion via canvas — no server round-trip.
export type ImageMime = "image/png" | "image/jpeg" | "image/webp" | "image/bmp";

export async function convertImage(file: File, targetMime: ImageMime, quality = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // JPEG/BMP have no alpha channel — flatten onto white first.
  if (targetMime === "image/jpeg" || targetMime === "image/bmp") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  // Canvas.toBlob doesn't support image/bmp natively in any browser —
  // fall back to PNG bytes re-labelled won't work either, so encode BMP by hand.
  if (targetMime === "image/bmp") {
    return encodeBmp(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Convert failed"))),
      targetMime,
      quality,
    );
  });
}

// Minimal uncompressed 24-bit BMP encoder (browsers can't produce BMP via canvas.toBlob).
function encodeBmp(imageData: ImageData): Blob {
  const { width, height, data } = imageData;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x42); // 'B'
  view.setUint8(1, 0x4d); // 'M'
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true); // pixel data offset
  view.setUint32(14, 40, true); // DIB header size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true); // planes
  view.setUint16(28, 24, true); // bits per pixel
  view.setUint32(34, pixelArraySize, true);

  const bytes = new Uint8Array(buffer);
  for (let y = 0; y < height; y++) {
    const srcRow = height - 1 - y; // BMP rows are bottom-up
    for (let x = 0; x < width; x++) {
      const srcIdx = (srcRow * width + x) * 4;
      const dstIdx = 54 + y * rowSize + x * 3;
      bytes[dstIdx] = data[srcIdx + 2]; // B
      bytes[dstIdx + 1] = data[srcIdx + 1]; // G
      bytes[dstIdx + 2] = data[srcIdx]; // R
    }
  }
  return new Blob([bytes], { type: "image/bmp" });
}

export function extensionForMime(mime: ImageMime): string {
  return { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/bmp": "bmp" }[mime];
}
