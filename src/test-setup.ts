/**
 * Global Vitest setup — runs before every test file in the suite.
 *
 * Why this mock exists
 * --------------------
 * `canvas-confetti` renders its particle effects onto a real `<canvas>`
 * using a 2D rendering context (e.g. `ctx.clearRect`, `ctx.fillRect`).
 * `happy-dom` does not provide a functional 2D canvas context, so any
 * call to `confetti(...)` from inside a test would throw a `clearRect`
 * (or similar) error during interaction tests that exercise code paths
 * which trigger the effect.
 *
 * Scope
 * -----
 * This mock is intentionally global — i.e. applied to every test file
 * via `vitest.config.ts → setupFiles`, not scoped per-file. Any test in
 * the frontend suite that exercises a code path which calls `confetti()`
 * (transitively, via `playCompletionBurst`, `playStarShower`, etc.)
 * relies on this mock being in place. The per-file `vi.mock` calls in
 * the behavioral test suites short-circuit before this `canvas-confetti`
 * import is ever resolved, but this global mock is the safety net for
 * the rest.
 */
import { vi } from "vitest";

vi.mock("canvas-confetti", () => ({
  default: vi.fn().mockResolvedValue(null),
}));
