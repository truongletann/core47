-- PDF Toolkit (pdf.core47.xyz) and File Converter (file.core47.xyz) removed
-- entirely — source only, no DB tables (both were stateless, in-browser
-- conversion, nothing persisted) — just drops their tools-listing rows.
-- Part of the same Worker-bundle-size cleanup as 0033 (Books removal).

DELETE FROM tools WHERE slug IN ('pdf', 'file');
