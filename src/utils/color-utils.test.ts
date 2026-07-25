import { describe, expect, it } from "vitest";
import { extractColorVariants } from "./color-utils.js";

function luminance(hex: string): number {
  const [red, green, blue] = [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16),
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

describe("extractColorVariants", () => {
  it("returns five valid shades ordered from lightest to darkest", () => {
    const variants = extractColorVariants("#B29FE8");

    expect(variants).toHaveLength(5);
    expect(variants).toEqual([
      "#C9BCEF",
      "#BEADEB",
      "#B29FE8",
      "#9787C5",
      "#7D6FA2",
    ]);
    variants.forEach((variant) => expect(variant).toMatch(/^#[0-9A-F]{6}$/));
    expect(variants.map(luminance)).toEqual(
      [...variants.map(luminance)].sort((a, b) => b - a),
    );
  });

  it("rejects colors outside the #RRGGBB format", () => {
    expect(() => extractColorVariants("red")).toThrow(/#RRGGBB/);
  });
});
