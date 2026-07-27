/**
 * Unit tests for AdjustPointsDialog.
 *
 * Test harness: Vitest + happy-dom (same pattern as Phase 2a card tests).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./adjust-points-dialog.js";
import type { AdjustPointsDialog } from "./adjust-points-dialog.js";
import * as confettiUtils from "./utils/confetti-utils.js";

// ---------------------------------------------------------------------------
// Confetti mock
// ---------------------------------------------------------------------------
//
// The dialog fires `playStarShower` from `./utils/confetti-utils.js` after a
// successful `adjust_points` submission with a positive amount. We mock the
// module at the test-file level so submission tests can assert whether the
// effect fires (and with which duration) without rendering anything to the
// (mocked) canvas.
// ---------------------------------------------------------------------------

vi.mock("./utils/confetti-utils.js", () => ({
  playCompletionBurst: vi.fn(),
  playPointsAnimation: vi.fn(),
  playStarShower: vi.fn(),
}));

const mockPlayStarShower = vi.mocked(confettiUtils.playStarShower);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface LitElement extends HTMLElement {
  updateComplete: Promise<boolean>;
}

function makeMockHass() {
  return { callService: vi.fn().mockResolvedValue(undefined) };
}

async function makeDialog(personId = "person.alice"): Promise<AdjustPointsDialog> {
  const el = document.createElement(
    "pointsbot-adjust-points-dialog"
  ) as AdjustPointsDialog;
  el.hass = makeMockHass() as never;
  el.personId = personId;
  document.body.appendChild(el);
  await (el as unknown as LitElement).updateComplete;
  return el;
}

function cleanup(el: HTMLElement) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

/** Click the "Adjust Points" open button to show the dialog form. */
async function openDialog(el: AdjustPointsDialog) {
  const openBtn = el.shadowRoot?.querySelector(
    ".add-button"
  ) as HTMLButtonElement;
  expect(openBtn).not.toBeNull();
  openBtn.click();
  await (el as unknown as LitElement).updateComplete;
}

/** Fill the amount and reason fields and click submit. */
async function fillAndSubmit(
  el: AdjustPointsDialog,
  amount: string,
  reason: string
) {
  const amountInput = el.shadowRoot?.querySelector(
    "#amount"
  ) as HTMLInputElement;
  const reasonInput = el.shadowRoot?.querySelector(
    "#reason"
  ) as HTMLTextAreaElement;
  const submitBtn = el.shadowRoot?.querySelector(
    ".submit-button"
  ) as HTMLButtonElement;

  if (amountInput) {
    amountInput.value = amount;
    amountInput.dispatchEvent(new Event("input"));
  }
  if (reasonInput) {
    reasonInput.value = reason;
    reasonInput.dispatchEvent(new Event("input"));
  }
  await (el as unknown as LitElement).updateComplete;

  submitBtn?.click();
  await (el as unknown as LitElement).updateComplete;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AdjustPointsDialog", () => {
  let el: AdjustPointsDialog;

  beforeEach(async () => {
    el = await makeDialog();
    mockPlayStarShower.mockClear();
  });

  afterEach(() => cleanup(el));

  describe("initial state", () => {
    it("renders the open button", () => {
      const btn = el.shadowRoot?.querySelector(".add-button");
      expect(btn).not.toBeNull();
      expect(btn?.textContent).toContain("Adjust Points");
    });

    it("does not show the dialog form before the button is clicked", () => {
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).toBeNull();
    });
  });

  describe("open / close", () => {
    it("shows the dialog form after clicking the open button", async () => {
      await openDialog(el);
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).not.toBeNull();
    });

    it("closes the dialog when Cancel is clicked", async () => {
      await openDialog(el);
      const cancelBtn = el.shadowRoot?.querySelector(
        ".cancel-button"
      ) as HTMLButtonElement;
      cancelBtn?.click();
      await (el as unknown as LitElement).updateComplete;
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).toBeNull();
    });

    it("clears the form fields when the dialog is reopened", async () => {
      await openDialog(el);
      // Type something
      const amountInput = el.shadowRoot?.querySelector(
        "#amount"
      ) as HTMLInputElement;
      amountInput.value = "99";
      amountInput.dispatchEvent(new Event("input"));
      await (el as unknown as LitElement).updateComplete;

      // Close and reopen
      const cancelBtn = el.shadowRoot?.querySelector(
        ".cancel-button"
      ) as HTMLButtonElement;
      cancelBtn?.click();
      await (el as unknown as LitElement).updateComplete;
      await openDialog(el);

      const freshAmount = el.shadowRoot?.querySelector(
        "#amount"
      ) as HTMLInputElement;
      expect(freshAmount?.value).toBe("");
    });
  });

  describe("validation", () => {
    beforeEach(() => openDialog(el));

    it("shows an error when amount is empty", async () => {
      await fillAndSubmit(el, "", "Some reason");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/non-zero integer/i);
    });

    it("shows an error when amount is zero", async () => {
      await fillAndSubmit(el, "0", "Some reason");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/non-zero integer/i);
    });

    it("shows an error when amount is not a number", async () => {
      await fillAndSubmit(el, "abc", "Some reason");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/non-zero integer/i);
    });

    it("shows an error when reason is empty", async () => {
      await fillAndSubmit(el, "10", "");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/reason.*required/i);
    });

    it("shows an error when reason is only whitespace", async () => {
      await fillAndSubmit(el, "10", "   ");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/reason.*required/i);
    });

    it("does not call hass.callService when validation fails", async () => {
      await fillAndSubmit(el, "0", "Some reason");
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      expect(mockHass.callService).not.toHaveBeenCalled();
    });
  });

  describe("successful submission", () => {
    it("calls hass.callService with correct parameters on valid input", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "-5", "Left dishes out");

      expect(mockHass.callService).toHaveBeenCalledOnce();
      expect(mockHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "adjust_points",
        {
          person_id: "person.alice",
          amount: -5,
          reason: "Left dishes out",
        }
      );
    });

    it("uses the person_id attribute, not a derived value", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      el.personId = "person.bob";
      await openDialog(el);
      await fillAndSubmit(el, "10", "Good work");

      const call = mockHass.callService.mock.calls[0];
      expect(call[2]).toMatchObject({ person_id: "person.bob" });
    });

    it("passes amount as a parsed integer, not a string", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "42", "Great job");

      const call = mockHass.callService.mock.calls[0];
      expect(typeof call[2].amount).toBe("number");
      expect(call[2].amount).toBe(42);
    });

    it("closes the dialog after a successful submission", async () => {
      await openDialog(el);
      await fillAndSubmit(el, "10", "Good job");

      // Wait for the async callService to resolve
      await Promise.resolve();
      await (el as unknown as LitElement).updateComplete;

      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).toBeNull();
    });

    it("trims whitespace from reason before submitting", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "5", "  nice work  ");

      const call = mockHass.callService.mock.calls[0];
      expect(call[2].reason).toBe("nice work");
    });
  });

  // -------------------------------------------------------------------------
  // Confetti trigger / suppression behavior
  // -------------------------------------------------------------------------
  //
  // These tests pin down the behavioral contract: a positive adjustment
  // fires `playStarShower` with duration 2500 ms; a negative adjustment or
  // a failed service call does not. The confetti-utils module is mocked
  // at the top of this file so the assertions can check call counts and
  // arguments directly.
  // -------------------------------------------------------------------------

  describe("confetti trigger — playStarShower", () => {
    it("fires playStarShower(colors, 2500) after a successful positive adjustment", async () => {
      el.confettiColors = ["#ff0000", "#00ff00", "#0000ff"];
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "5", "Good job");
      // Flush microtasks so the awaited callService resolves and the
      // post-await playStarShower call executes before we assert.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "adjust_points",
        { person_id: "person.alice", amount: 5, reason: "Good job" }
      );
      expect(mockPlayStarShower).toHaveBeenCalledOnce();
      expect(mockPlayStarShower).toHaveBeenCalledWith(
        ["#ff0000", "#00ff00", "#0000ff"],
        2500,
      );
    });

    it("does NOT fire playStarShower when the submitted amount is negative", async () => {
      el.confettiColors = ["#ff0000", "#00ff00"];
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "-5", "Left dishes out");
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "adjust_points",
        { person_id: "person.alice", amount: -5, reason: "Left dishes out" }
      );
      expect(mockPlayStarShower).not.toHaveBeenCalled();
    });

    it("does NOT fire playStarShower when the adjust_points service call rejects", async () => {
      el.confettiColors = ["#ff0000"];
      const mockHass = makeMockHass();
      mockHass.callService.mockRejectedValueOnce(new Error("backend rejected"));
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "5", "Good job");
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockHass.callService).toHaveBeenCalledOnce();
      expect(mockPlayStarShower).not.toHaveBeenCalled();
    });
  });
});
