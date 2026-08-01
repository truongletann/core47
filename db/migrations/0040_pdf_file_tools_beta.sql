-- Migration: 0040_pdf_file_tools_beta
-- PDF Toolkit and File Converter now have working client-side features
-- (merge/split/PDF<->image/PDF<->Word for pdf; image format conversion and
-- docx<->pdf for file) — flip from "soon" placeholders to "beta" (best-effort
-- text-only Word conversion, no video support yet).

UPDATE tools SET status = 'beta', updated_at = datetime('now') WHERE slug = 'pdf';
UPDATE tools SET status = 'beta', updated_at = datetime('now') WHERE slug = 'file';
