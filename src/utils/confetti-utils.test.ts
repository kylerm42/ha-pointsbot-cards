import { afterEach, describe, expect, it, vi } from "vitest";
import { playPointsAnimation } from "./confetti-utils.js";

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = originalMatchMedia;
  document.body.replaceChildren();
  document.getElementById("pointsbot-float-points-style")?.remove();
});

describe("playPointsAnimation", () => {
  it("creates a points element and removes it after two seconds", () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    playPointsAnimation({ x: 100, y: 200 }, 10);

    const element = document.body.lastElementChild as HTMLDivElement | null;
    expect(element?.textContent).toBe("+10");
    expect(element?.style.position).toBe("fixed");
    expect(document.getElementById("pointsbot-float-points-style")).not.toBeNull();

    vi.advanceTimersByTime(2000);
    expect(element?.isConnected).toBe(false);
  });

  it("does not create an element when reduced motion is preferred", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    playPointsAnimation({ x: 100, y: 200 }, 10);

    expect(document.body.children).toHaveLength(0);
  });
});
