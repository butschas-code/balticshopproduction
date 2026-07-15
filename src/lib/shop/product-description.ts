export type ProductSpec = {
  label: string;
  value: string;
};

export type ParsedProductDescription = {
  intro: string;
  specs: ProductSpec[];
};

const SPEC_LABELS = [
  "Color",
  "Size",
  "Composition",
  "Material",
  "Materials",
  "Dimensions",
  "Weight",
  "Product reference",
  "Care instructions",
  "Warning",
  "Note",
];

export function decodeProductText(text: string): string {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\"")
    .replace(/&#8221;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseProductDescription(description: string): ParsedProductDescription {
  const decoded = decodeProductText(description);
  if (!decoded) return { intro: "", specs: [] };

  const [introPart, ...specParts] = decoded.split("---split---");
  const intro = introPart.trim();
  const specSource = specParts.join(" ").trim();

  if (!specSource) {
    return { intro, specs: [] };
  }

  const markers: Array<{ label: string; index: number; valueStart: number }> = [];
  for (const label of SPEC_LABELS) {
    const pattern = new RegExp(`\\b${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*`, "i");
    const match = pattern.exec(specSource);
    if (match) {
      markers.push({
        label,
        index: match.index,
        valueStart: match.index + match[0].length,
      });
    }
  }

  markers.sort((a, b) => a.index - b.index);

  const specs = markers.map((marker, index) => ({
    label: marker.label,
    value: specSource
      .slice(marker.valueStart, markers[index + 1]?.index ?? specSource.length)
      .trim(),
  }));

  return { intro, specs };
}

export function isPlaceholderDetail(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    !normalized ||
    normalized === "natural materials" ||
    normalized === "handcrafted" ||
    normalized === "traditional craftsmanship" ||
    normalized === "craft" ||
    normalized === "detail"
  );
}
