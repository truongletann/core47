export interface ToolboxCategory {
  slug: string;
  name: string;
  icon: string;
}

export interface ToolboxTool {
  slug: string;
  name: string;
  shortName?: string; // short name shown in the sidebar, e.g. "Date" instead of "Date Converter"
  description: string;
  categorySlug: string;
  icon: string;
  implemented: boolean; // false = auto "Coming soon" page
}

export const TOOLBOX_CATEGORIES: ToolboxCategory[] = [
  { slug: "converters", name: "Converters", icon: "Repeat" },
  { slug: "encoders-decoders", name: "Encoders / Decoders", icon: "Binary" },
  { slug: "formatters", name: "Formatters", icon: "AlignLeft" },
  { slug: "generators", name: "Generators", icon: "Sparkles" },
];

export const TOOLBOX_TOOLS: ToolboxTool[] = [
  // Converters
  {
    slug: "cron-parser",
    shortName: "Cron parser",
    name: "Cron expression parser",
    description: "Parse Cron expression to get scheduled dates",
    categorySlug: "converters",
    icon: "Clock",
    implemented: true,
  },
  {
    slug: "date-converter",
    shortName: "Date",
    name: "Date Converter",
    description: "Convert date to human-readable date and vice versa",
    categorySlug: "converters",
    icon: "Calendar",
    implemented: false,
  },
  {
    slug: "json-to-table",
    shortName: "JSON > Table",
    name: "JSON Array to Table",
    description: "Convert a JSON array to tabular format, export to CSV or TSV",
    categorySlug: "converters",
    icon: "Database",
    implemented: false,
  },
  {
    slug: "json-yaml",
    shortName: "JSON <> YAML",
    name: "JSON <> YAML Converter",
    description: "Convert JSON data to YAML and vice versa",
    categorySlug: "converters",
    icon: "ArrowLeftRight",
    implemented: false,
  },
  {
    slug: "number-base",
    shortName: "Number Base",
    name: "Number Base Converter",
    description: "Convert numbers from one base to another",
    categorySlug: "converters",
    icon: "Hash",
    implemented: false,
  },

  // Encoders / Decoders
  {
    slug: "base64-image",
    shortName: "Base64 Image",
    name: "Base64 Image Encoder / Decoder",
    description: "Encode and decode Base64 image data",
    categorySlug: "encoders-decoders",
    icon: "ImageIcon",
    implemented: false,
  },
  {
    slug: "base64",
    shortName: "Base64 Text",
    name: "Base64 Text Encoder / Decoder",
    description: "Encode and decode Base64 text data",
    categorySlug: "encoders-decoders",
    icon: "Binary",
    implemented: true,
  },
  {
    slug: "certificate-decoder",
    shortName: "Certificate",
    name: "Certificate Decoder",
    description: "Decode a certificate",
    categorySlug: "encoders-decoders",
    icon: "FileText",
    implemented: false,
  },
  {
    slug: "gzip",
    shortName: "GZip",
    name: "GZip Compress / Decompress",
    description: "Compress or decompress a text in GZip",
    categorySlug: "encoders-decoders",
    icon: "FileArchive",
    implemented: false,
  },
  {
    slug: "html-encoder",
    shortName: "HTML",
    name: "HTML Text Encoder / Decoder",
    description: "Encode and decode HTML text data",
    categorySlug: "encoders-decoders",
    icon: "Code2",
    implemented: false,
  },
  {
    slug: "jwt",
    shortName: "JWT",
    name: "JWT Encoder / Decoder",
    description: "Encode and decode JSON Web Token",
    categorySlug: "encoders-decoders",
    icon: "Asterisk",
    implemented: false,
  },
  {
    slug: "qr-code",
    shortName: "QR Code",
    name: "QR Code Encoder / Decoder",
    description: "Read or generate a QR Code from text",
    categorySlug: "encoders-decoders",
    icon: "QrCode",
    implemented: false,
  },
  {
    slug: "url-encoder",
    shortName: "URL",
    name: "URL Encoder / Decoder",
    description: "Encode or decode URL components",
    categorySlug: "encoders-decoders",
    icon: "Link2",
    implemented: true,
  },

  // Formatters
  {
    slug: "json-formatter",
    shortName: "JSON",
    name: "JSON Formatter",
    description: "Indent or minify JSON data",
    categorySlug: "formatters",
    icon: "Braces",
    implemented: true,
  },
  {
    slug: "sql-formatter",
    shortName: "SQL",
    name: "SQL Formatter",
    description: "Format and prettify your SQL queries",
    categorySlug: "formatters",
    icon: "Database",
    implemented: false,
  },
  {
    slug: "xml-formatter",
    shortName: "XML",
    name: "XML Formatter",
    description: "Indent or minify XML data",
    categorySlug: "formatters",
    icon: "Code",
    implemented: false,
  },

  // Generators
  {
    slug: "hash-generator",
    shortName: "Hash / Checksum",
    name: "Hash / Checksum Generator",
    description: "Calculate hash from text using Web Crypto API",
    categorySlug: "generators",
    icon: "Fingerprint",
    implemented: true,
  },
  {
    slug: "lorem-ipsum",
    shortName: "Lorem Ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate Lorem Ipsum placeholder text",
    categorySlug: "generators",
    icon: "Type",
    implemented: false,
  },
  {
    slug: "password-generator",
    shortName: "Password",
    name: "Password Generator",
    description: "Generate strong random passwords",
    categorySlug: "generators",
    icon: "KeyRound",
    implemented: true,
  },
  {
    slug: "uuid-generator",
    shortName: "UUID",
    name: "UUID Generator",
    description: "Generate UUID v4 identifiers",
    categorySlug: "generators",
    icon: "Fingerprint",
    implemented: true,
  },
];

export function getToolBySlug(slug: string): ToolboxTool | undefined {
  return TOOLBOX_TOOLS.find((t) => t.slug === slug);
}

export function getCategoryBySlug(slug: string): ToolboxCategory | undefined {
  return TOOLBOX_CATEGORIES.find((c) => c.slug === slug);
}

// "Related tools" suggestions for the Output panel dropdown — same-category first.
export function getRelatedTools(slug: string, count = 4): ToolboxTool[] {
  const current = getToolBySlug(slug);
  const rest = TOOLBOX_TOOLS.filter((t) => t.slug !== slug && t.implemented);

  if (!current) return rest.slice(0, count);

  const sameCategory = rest.filter((t) => t.categorySlug === current.categorySlug);
  const others = rest.filter((t) => t.categorySlug !== current.categorySlug);
  return [...sameCategory, ...others].slice(0, count);
}
