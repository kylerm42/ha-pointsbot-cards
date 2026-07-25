const LIGHTNESS_ADJUSTMENTS = [0.3, 0.15, 0, -0.15, -0.3];

function toHex(value: number): string {
  return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
}

function adjustChannel(channel: number, amount: number): number {
  return amount >= 0
    ? channel + (255 - channel) * amount
    : channel * (1 + amount);
}

/**
 * Returns five shades of a #RRGGBB color, ordered from lightest to darkest.
 */
export function extractColorVariants(baseHex: string): string[] {
  if (!/^#[0-9A-Fa-f]{6}$/.test(baseHex)) {
    throw new Error("baseHex must be a #RRGGBB color.");
  }

  const channels = [
    parseInt(baseHex.slice(1, 3), 16),
    parseInt(baseHex.slice(3, 5), 16),
    parseInt(baseHex.slice(5, 7), 16),
  ];

  return LIGHTNESS_ADJUSTMENTS.map((amount) =>
    `#${channels.map((channel) => toHex(adjustChannel(channel, amount))).join("")}`,
  );
}
