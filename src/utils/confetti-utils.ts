import confetti from "canvas-confetti";

interface Point {
  x: number;
  y: number;
}

const POINTS_ANIMATION_STYLE_ID = "pointsbot-float-points-style";
const POINTS_ANIMATION_DURATION = 2000;
const STAR_SHOWER_DURATION = 2500;

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function playCompletionBurst(origin: Point, colors: string[]): void {
  void confetti({
    particleCount: 30,
    spread: 70,
    startVelocity: 25,
    origin,
    colors,
    disableForReducedMotion: true,
  });
}

export function playStarShower(
  colors: string[],
  duration = STAR_SHOWER_DURATION,
): void {
  const animationEnd = Date.now() + duration;

  const frame = (): void => {
    void confetti({
      particleCount: 1,
      angle: 270,
      spread: 30,
      startVelocity: 10,
      origin: { x: Math.random(), y: 0 },
      colors,
      shapes: ["star"],
      gravity: randomInRange(1.2, 1.5),
      scalar: randomInRange(1.2, 2),
      disableForReducedMotion: true,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function playPointsAnimation(origin: Point, pointsValue: number): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (!document.getElementById(POINTS_ANIMATION_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = POINTS_ANIMATION_STYLE_ID;
    style.textContent = `
      @keyframes floatPoints {
        from {
          transform: translate(-50%, -50%);
          opacity: 1;
        }
        to {
          transform: translate(-50%, -100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const element = document.createElement("div");
  element.textContent = `+${pointsValue}`;
  Object.assign(element.style, {
    position: "fixed",
    left: `${origin.x}px`,
    top: `${origin.y}px`,
    zIndex: "10000",
    pointerEvents: "none",
    fontSize: "24px",
    fontWeight: "bold",
    color: "var(--pointsbot-accent-color, #B29FE8)",
    animation: `floatPoints ${POINTS_ANIMATION_DURATION}ms ease-out forwards`,
  });
  document.body.appendChild(element);

  window.setTimeout(() => element.remove(), POINTS_ANIMATION_DURATION);
}
