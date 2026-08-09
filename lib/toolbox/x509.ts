// Minimal hand-rolled ASN.1 DER parser + X.509 certificate field extractor.
// Hand-rolled (instead of an npm cert-parsing lib) for the same reason the blog
// HTML sanitizer is hand-rolled — see CONVENTIONS.md's Worker bundle-size notes;
// full ASN.1/X.509 libraries pull in a lot of code for what is, here, a read-only
// "show me the fields" viewer. Covers the fields that matter for that use case;
// it does not verify signatures or chain trust.

interface DerNode {
  tagClass: number; // 0 = universal, 2 = context-specific
  constructed: boolean;
  tagNumber: number;
  value: Uint8Array; // raw content octets
  children: DerNode[]; // populated when constructed
}

function parseDer(bytes: Uint8Array, offset: number, end: number): { node: DerNode; next: number } {
  if (offset >= end) throw new Error("Unexpected end of DER data.");
  const tagByte = bytes[offset];
  const tagClass = (tagByte >> 6) & 0x03;
  const constructed = (tagByte & 0x20) !== 0;
  let tagNumber = tagByte & 0x1f;
  let pos = offset + 1;

  if (tagNumber === 0x1f) {
    // High-tag-number form (multi-byte tag) — not needed for X.509, but parsed
    // defensively so an unexpected extension doesn't crash the whole viewer.
    tagNumber = 0;
    let b: number;
    do {
      b = bytes[pos++];
      tagNumber = (tagNumber << 7) | (b & 0x7f);
    } while (b & 0x80);
  }

  const lenByte = bytes[pos++];
  let length: number;
  if ((lenByte & 0x80) === 0) {
    length = lenByte;
  } else {
    const numBytes = lenByte & 0x7f;
    if (numBytes === 0) throw new Error("Indefinite-length DER is not supported.");
    length = 0;
    for (let i = 0; i < numBytes; i++) length = (length << 8) | bytes[pos++];
  }

  const valueStart = pos;
  const valueEnd = valueStart + length;
  if (valueEnd > end) throw new Error("DER length exceeds available data.");
  const value = bytes.slice(valueStart, valueEnd);

  const children: DerNode[] = [];
  if (constructed) {
    let childPos = valueStart;
    while (childPos < valueEnd) {
      const { node, next } = parseDer(bytes, childPos, valueEnd);
      children.push(node);
      childPos = next;
    }
  }

  return { node: { tagClass, constructed, tagNumber, value, children }, next: valueEnd };
}

function parseDerRoot(bytes: Uint8Array): DerNode {
  return parseDer(bytes, 0, bytes.length).node;
}

function pemToDer(pem: string): Uint8Array {
  const match = pem.match(/-----BEGIN CERTIFICATE-----([\s\S]+?)-----END CERTIFICATE-----/);
  const body = (match ? match[1] : pem).replace(/[^A-Za-z0-9+/=]/g, "");
  if (!body) throw new Error("No PEM certificate block found (expecting -----BEGIN CERTIFICATE-----).");
  const binary = atob(body);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function decodeOid(value: Uint8Array): string {
  const parts: number[] = [];
  let first = true;
  let acc = BigInt(0);
  for (const byte of value) {
    acc = (acc << BigInt(7)) | BigInt(byte & 0x7f);
    if ((byte & 0x80) === 0) {
      if (first) {
        const n = Number(acc);
        parts.push(Math.floor(n / 40), n % 40);
        first = false;
      } else {
        parts.push(Number(acc));
      }
      acc = BigInt(0);
    }
  }
  return parts.join(".");
}

function decodeInteger(value: Uint8Array): string {
  let hex = Array.from(value)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  hex = hex.replace(/^0+(?=.)/, "");
  return hex.toUpperCase();
}

function decodeSerial(value: Uint8Array): string {
  return Array.from(value)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(":")
    .toUpperCase();
}

function decodeAsciiString(value: Uint8Array): string {
  return Array.from(value)
    .map((b) => String.fromCharCode(b))
    .join("");
}

function decodeUtf8String(value: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: false }).decode(value);
}

function decodeTime(node: DerNode): Date {
  const s = decodeAsciiString(node.value);
  // UTCTime: YYMMDDHHMMSSZ, GeneralizedTime: YYYYMMDDHHMMSSZ
  if (node.tagNumber === 0x17) {
    const yy = parseInt(s.slice(0, 2), 10);
    const year = yy < 50 ? 2000 + yy : 1900 + yy;
    const rest = s.slice(2);
    return new Date(
      Date.UTC(
        year,
        parseInt(rest.slice(0, 2), 10) - 1,
        parseInt(rest.slice(2, 4), 10),
        parseInt(rest.slice(4, 6), 10),
        parseInt(rest.slice(6, 8), 10),
        parseInt(rest.slice(8, 10), 10) || 0,
      ),
    );
  }
  return new Date(
    Date.UTC(
      parseInt(s.slice(0, 4), 10),
      parseInt(s.slice(4, 6), 10) - 1,
      parseInt(s.slice(6, 8), 10),
      parseInt(s.slice(8, 10), 10),
      parseInt(s.slice(10, 12), 10),
      parseInt(s.slice(12, 14), 10) || 0,
    ),
  );
}

const OID_NAMES: Record<string, string> = {
  "2.5.4.3": "CN",
  "2.5.4.6": "C",
  "2.5.4.7": "L",
  "2.5.4.8": "ST",
  "2.5.4.10": "O",
  "2.5.4.11": "OU",
  "1.2.840.113549.1.9.1": "emailAddress",
  "1.2.840.113549.1.1.1": "RSA",
  "1.2.840.113549.1.1.5": "SHA-1 with RSA",
  "1.2.840.113549.1.1.11": "SHA-256 with RSA",
  "1.2.840.113549.1.1.12": "SHA-384 with RSA",
  "1.2.840.113549.1.1.13": "SHA-512 with RSA",
  "1.2.840.10045.2.1": "EC Public Key",
  "1.2.840.10045.4.3.2": "ECDSA with SHA-256",
  "1.2.840.10045.4.3.3": "ECDSA with SHA-384",
  "1.2.840.10045.4.3.4": "ECDSA with SHA-512",
};

function decodeName(node: DerNode): string {
  const parts: string[] = [];
  for (const rdn of node.children) {
    for (const attr of rdn.children) {
      const [oidNode, valueNode] = attr.children;
      if (!oidNode || !valueNode) continue;
      const oid = decodeOid(oidNode.value);
      const label = OID_NAMES[oid] ?? oid;
      const value = valueNode.tagNumber === 0x0c ? decodeUtf8String(valueNode.value) : decodeAsciiString(valueNode.value);
      parts.push(`${label}=${value}`);
    }
  }
  return parts.join(", ");
}

export interface CertificateInfo {
  subject: string;
  issuer: string;
  serialNumber: string;
  notBefore: Date;
  notAfter: Date;
  isExpired: boolean;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  version: number;
}

export function decodeCertificate(pem: string): CertificateInfo {
  const der = pemToDer(pem);
  const cert = parseDerRoot(der);
  if (cert.tagNumber !== 0x10 || !cert.constructed) throw new Error("Not a valid DER SEQUENCE — is this a certificate?");

  const [tbs, sigAlgNode] = cert.children;
  if (!tbs) throw new Error("Missing TBSCertificate.");

  let idx = 0;
  let version = 1;
  // version is an OPTIONAL context-specific [0] EXPLICIT tag — only present for v2/v3 certs.
  if (tbs.children[idx]?.tagClass === 2 && tbs.children[idx]?.tagNumber === 0) {
    const versionInt = tbs.children[idx].children[0];
    version = versionInt ? parseInt(decodeInteger(versionInt.value) || "0", 16) + 1 : 1;
    idx++;
  }

  const serialNode = tbs.children[idx++];
  const sigAlgInTbs = tbs.children[idx++];
  const issuerNode = tbs.children[idx++];
  const validityNode = tbs.children[idx++];
  const subjectNode = tbs.children[idx++];
  const spkiNode = tbs.children[idx++];

  const [notBeforeNode, notAfterNode] = validityNode.children;
  const notBefore = decodeTime(notBeforeNode);
  const notAfter = decodeTime(notAfterNode);

  const sigAlgOid = decodeOid((sigAlgNode ?? sigAlgInTbs).children[0].value);
  const pubKeyAlgOid = decodeOid(spkiNode.children[0].children[0].value);

  return {
    subject: decodeName(subjectNode),
    issuer: decodeName(issuerNode),
    serialNumber: decodeSerial(serialNode.value),
    notBefore,
    notAfter,
    isExpired: notAfter.getTime() < Date.now(),
    signatureAlgorithm: OID_NAMES[sigAlgOid] ?? sigAlgOid,
    publicKeyAlgorithm: OID_NAMES[pubKeyAlgOid] ?? pubKeyAlgOid,
    version,
  };
}
