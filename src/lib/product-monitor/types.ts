export type MonitorProduct = {
  id: string;
  slug: string;
  partnerSlug: string | null;
  partnerName: string | null;
  name: string;
  priceAmount: number | null;
  currencyCode: string | null;
  shopVisible: boolean;
  sourceUrl: string | null;
  metadata: Record<string, unknown>;
  previousStatus: string | null;
  previousPriceText: string | null;
};

export type ProductAvailabilityResult = {
  slug: string;
  sourceUrl: string | null;
  status: "available" | "out_of_stock" | "unavailable" | "unknown" | "missing_source";
  httpStatus: number | null;
  priceText: string | null;
  error: string | null;
};

export type DiscoveredProduct = {
  partnerSlug: string;
  partnerName: string;
  title: string | null;
  sourceUrl: string;
  priceText: string | null;
  imageUrl: string | null;
};

export type MonitorReport = {
  checkedAt: string;
  checkedCount: number;
  missingSourceCount: number;
  unavailable: ProductAvailabilityResult[];
  outOfStock: ProductAvailabilityResult[];
  statusChanges: Array<{
    slug: string;
    name: string;
    sourceUrl: string | null;
    previousStatus: string | null;
    status: ProductAvailabilityResult["status"];
    previousPriceText: string | null;
    priceText: string | null;
  }>;
  errors: ProductAvailabilityResult[];
  newProducts: DiscoveredProduct[];
};
