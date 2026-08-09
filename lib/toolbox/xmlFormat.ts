// XML pretty-printer/minifier — native DOMParser/XMLSerializer, no dependency.
// Walks the parsed DOM instead of round-tripping through fast-xml-parser's JSON
// model so attribute order, mixed text content, comments and CDATA survive intact.

function parse(xml: string): Document {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) throw new Error(errorNode.textContent?.trim() || "Invalid XML.");
  return doc;
}

// DOM getters (textContent, attribute .value) hand back already-decoded text —
// re-escape before writing it back into XML syntax, or "&"/"<" in the original
// document turns into invalid, unparseable output.
function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string): string {
  return escapeText(s).replace(/"/g, "&quot;");
}

function serializeNode(node: Node, indent: number, indentSize: number): string {
  const pad = " ".repeat(indent * indentSize);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    return text ? `${pad}${escapeText(text)}\n` : "";
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    return `${pad}<!--${node.textContent}-->\n`;
  }
  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `${pad}<![CDATA[${node.textContent}]]>\n`;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const attrs = Array.from(el.attributes)
    .map((a) => ` ${a.name}="${escapeAttr(a.value)}"`)
    .join("");

  const children = Array.from(el.childNodes).filter(
    (n) => n.nodeType !== Node.TEXT_NODE || n.textContent?.trim(),
  );

  if (children.length === 0) {
    return `${pad}<${el.tagName}${attrs} />\n`;
  }

  const onlyText = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
  if (onlyText) {
    return `${pad}<${el.tagName}${attrs}>${escapeText(children[0].textContent?.trim() ?? "")}</${el.tagName}>\n`;
  }

  const inner = children.map((child) => serializeNode(child, indent + 1, indentSize)).join("");
  return `${pad}<${el.tagName}${attrs}>\n${inner}${pad}</${el.tagName}>\n`;
}

export function formatXml(xml: string, indentSize = 2): string {
  const doc = parse(xml);
  let out = "";
  const decl = xml.match(/^\s*<\?xml[^?]*\?>/);
  if (decl) out += decl[0] + "\n";
  for (const child of Array.from(doc.childNodes)) {
    out += serializeNode(child, 0, indentSize);
  }
  return out.trim() + "\n";
}

export function minifyXml(xml: string): string {
  const doc = parse(xml);
  const serialized = new XMLSerializer().serializeToString(doc);
  return serialized.replace(/>\s+</g, "><").trim();
}
