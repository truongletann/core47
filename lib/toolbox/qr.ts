import qrcodeGenerator from "qrcode-generator";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export function buildQrGrid(text: string, ecLevel: ErrorCorrectionLevel): boolean[][] {
  const qr = qrcodeGenerator(0, ecLevel);
  qr.addData(text);
  qr.make();
  const count = qr.getModuleCount();
  const grid: boolean[][] = [];
  for (let row = 0; row < count; row++) {
    const line: boolean[] = [];
    for (let col = 0; col < count; col++) {
      line.push(qr.isDark(row, col));
    }
    grid.push(line);
  }
  return grid;
}

export function gridToSvg(grid: boolean[][], moduleSize = 8, dark = "#000000", light = "#ffffff"): string {
  const size = grid.length * moduleSize;
  let cells = "";
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      if (grid[row][col]) {
        cells += `<rect x="${col * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${light}"/><g fill="${dark}">${cells}</g></svg>`;
}
