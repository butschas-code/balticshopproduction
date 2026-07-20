import type { MonitorReport } from "@/lib/product-monitor/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function productLine(item: { slug?: string; name?: string; sourceUrl?: string | null; status?: string; priceText?: string | null }) {
  const label = escapeHtml(item.name || item.slug || item.sourceUrl || "Product");
  const details = [item.status, item.priceText].filter(Boolean).map(String).join(" · ");
  const href = item.sourceUrl ? ` <a href="${escapeHtml(item.sourceUrl)}">source</a>` : "";
  return `<li><strong>${label}</strong>${details ? ` — ${escapeHtml(details)}` : ""}${href}</li>`;
}

function section(title: string, items: string[], empty: string) {
  return `
    <h2>${escapeHtml(title)}</h2>
    ${items.length > 0 ? `<ul>${items.join("")}</ul>` : `<p>${escapeHtml(empty)}</p>`}
  `;
}

export function buildProductMonitorEmail(report: MonitorReport) {
  const subjectParts = [
    `${report.statusChanges.length} changes`,
    `${report.newProducts.length} new`,
    `${report.unavailable.length + report.outOfStock.length} unavailable/out of stock`,
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2a24;line-height:1.5">
      <h1>Baltics Products daily catalog monitor</h1>
      <p>Checked ${report.checkedCount} products at ${escapeHtml(report.checkedAt)}. Missing source links: ${report.missingSourceCount}.</p>
      ${section(
        "Status or price changes",
        report.statusChanges.map((item) =>
          productLine({
            slug: item.slug,
            name: item.name,
            sourceUrl: item.sourceUrl,
            status: `${item.previousStatus || "new"} -> ${item.status}`,
            priceText:
              item.previousPriceText !== item.priceText
                ? `${item.previousPriceText || "no price"} -> ${item.priceText || "no price"}`
                : item.priceText,
          }),
        ),
        "No tracked product status or price changes.",
      )}
      ${section(
        "Unavailable or out of stock now",
        [...report.unavailable, ...report.outOfStock].map((item) => productLine(item)),
        "No tracked products appear unavailable or out of stock.",
      )}
      ${section(
        "New product URLs found on partner pages",
        report.newProducts.map((item) => productLine({ name: item.title || item.partnerName, sourceUrl: item.sourceUrl, priceText: item.priceText })),
        "No new product URLs found.",
      )}
      ${section(
        "Fetch errors",
        report.errors.map((item) => productLine({ slug: item.slug, sourceUrl: item.sourceUrl, status: item.error || item.status })),
        "No fetch errors.",
      )}
    </div>
  `;

  return {
    subject: `Baltics Products monitor: ${subjectParts.join(", ")}`,
    html,
  };
}
