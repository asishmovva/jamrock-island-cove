const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatUsd(cents: number) {
  return usdFormatter.format(cents / 100);
}
