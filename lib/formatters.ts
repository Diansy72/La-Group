/**
 * lib/formatters.ts
 *
 * Centralized formatting utilities — single source of truth for the entire app.
 * Feature services (vehicles.ts, tours.ts, data.ts) re-export from here.
 * UI components call these functions; they never store pre-formatted strings in data.
 */

/**
 * Formats a vehicle's price-per-day into a compact Indonesian display string.
 * e.g. 110_000 → "110rb" | 1_250_000 → "1.25jt"
 */
export function formatVehiclePrice(pricePerDay: number): string {
  if (pricePerDay >= 1_000_000) {
    const jt = pricePerDay / 1_000_000;
    return `${jt % 1 === 0 ? jt.toFixed(0) : jt.toFixed(2)}jt`;
  }
  return `${pricePerDay / 1_000}rb`;
}

/**
 * Formats a tour package estimated price into a compact display string.
 * e.g. 650_000 → "Rp 650rb" | 2_000_000 → "Rp 2jt"
 */
export function formatTourPrice(price: number): string {
  if (price >= 1_000_000) {
    const jt = price / 1_000_000;
    return `Rp ${jt % 1 === 0 ? jt.toFixed(0) : jt.toFixed(1)}jt`;
  }
  return `Rp ${(price / 1_000).toFixed(0)}rb`;
}

/**
 * Formats a number as full Indonesian Rupiah currency.
 * e.g. 2_000_000 → "Rp 2.000.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
