/**
 * Unit tests for AddTaskDialog.
 *
 * Test harness: Vitest + happy-dom (same pattern as adjust-points-dialog.test.ts).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./add-task-dialog.js";
import type { AddTaskDialog } from "./add-task-dialog.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface LitElement extends HTMLElement {
  updateComplete: Promise<boolean>;
}

function makeMockHass() {
  return { callService: vi.fn().mockResolvedValue(undefined) };
}

async function makeDialog(personId = "person.alice"): Promise<AddTaskDialog> {
  const el = document.createElement(
    "pointsbot-add-task-dialog"
  ) as AddTaskDialog;
  el.hass = makeMockHass() as never;
  el.personId = personId;
  document.body.appendChild(el);
  await (el as unknown as LitElement).updateComplete;
  return el;
}

function cleanup(el: HTMLElement) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

/** Click the "Add Task" open button to show the dialog form. */
async function openDialog(el: AddTaskDialog) {
  const openBtn = el.shadowRoot?.querySelector(
    ".add-button"
  ) as HTMLButtonElement;
  expect(openBtn).not.toBeNull();
  openBtn.click();
  await (el as unknown as LitElement).updateComplete;
}

/** Close the dialog via the Cancel button. */
async function cancelDialog(el: AddTaskDialog) {
  const cancelBtn = el.shadowRoot?.querySelector(
    ".cancel-button"
  ) as HTMLButtonElement;
  cancelBtn?.click();
  await (el as unknown as LitElement).updateComplete;
}

/** Switch the task type by selecting an option in the #task-type select. */
async function switchTaskType(el: AddTaskDialog, value: "base" | "bonus") {
  const select = el.shadowRoot?.querySelector("#task-type") as HTMLSelectElement;
  expect(select).not.toBeNull();
  select.value = value;
  select.dispatchEvent(new Event("change"));
  await (el as unknown as LitElement).updateComplete;
}

/** Fill the name (and optionally points) and click submit. */
async function fillAndSubmit(
  el: AddTaskDialog,
  name: string,
  pointsValue?: string
) {
  const nameInput = el.shadowRoot?.querySelector(
    "#task-name"
  ) as HTMLInputElement;
  expect(nameInput).not.toBeNull();
  nameInput.value = name;
  nameInput.dispatchEvent(new Event("input"));

  if (pointsValue !== undefined) {
    const pointsInput = el.shadowRoot?.querySelector(
      "#points-value"
    ) as HTMLInputElement;
    expect(pointsInput).not.toBeNull();
    pointsInput.value = pointsValue;
    pointsInput.dispatchEvent(new Event("input"));
  }
  await (el as unknown as LitElement).updateComplete;

  const submitBtn = el.shadowRoot?.querySelector(
    ".submit-button"
  ) as HTMLButtonElement;
  expect(submitBtn).not.toBeNull();
  submitBtn.click();
  await (el as unknown as LitElement).updateComplete;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AddTaskDialog", () => {
  let el: AddTaskDialog;

  beforeEach(async () => {
    el = await makeDialog();
  });

  afterEach(() => cleanup(el));

  describe("initial state", () => {
    it("renders the open button with text 'Add Task'", () => {
      const btn = el.shadowRoot?.querySelector(".add-button");
      expect(btn).not.toBeNull();
      expect(btn?.textContent).toContain("Add Task");
    });

    it("does not show the dialog form before the open button is clicked", () => {
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).toBeNull();
    });
  });

  describe("open / close / reset", () => {
    it("shows the dialog form after clicking the open button", async () => {
      await openDialog(el);
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).not.toBeNull();
    });

    it("closes the dialog when Cancel is clicked", async () => {
      await openDialog(el);
      await cancelDialog(el);
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).toBeNull();
    });

    it("closes the dialog when the overlay is clicked", async () => {
      await openDialog(el);
      const overlay = el.shadowRoot?.querySelector(
        ".dialog-overlay"
      ) as HTMLElement;
      expect(overlay).not.toBeNull();
      overlay.click();
      await (el as unknown as LitElement).updateComplete;
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).toBeNull();
    });

    it("does not close the dialog when clicking inside the dialog (e.g. the title)", async () => {
      await openDialog(el);
      const title = el.shadowRoot?.querySelector(".dialog-title") as HTMLElement;
      expect(title).not.toBeNull();
      title.click();
      await (el as unknown as LitElement).updateComplete;
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).not.toBeNull();
    });

    it("resets the form to defaults when reopened", async () => {
      await openDialog(el);
      // Fill in some values and switch to bonus
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Anything", "5");
      // After invalid submission, error should be set; reopen should clear it.
      // First, force a re-open cycle to confirm reset behavior.
      await cancelDialog(el);
      await openDialog(el);

      const select = el.shadowRoot?.querySelector("#task-type") as HTMLSelectElement;
      const nameInput = el.shadowRoot?.querySelector(
        "#task-name"
      ) as HTMLInputElement;
      const submitBtn = el.shadowRoot?.querySelector(
        ".submit-button"
      ) as HTMLButtonElement;
      const error = el.shadowRoot?.querySelector(".error-message");

      expect(select?.value).toBe("base");
      expect(nameInput?.value).toBe("");
      // Points field is absent for base
      const pointsInput = el.shadowRoot?.querySelector("#points-value");
      expect(pointsInput).toBeNull();
      expect(error).toBeNull();
      expect(submitBtn?.disabled).toBe(false);
    });
  });

  describe("task type switching", () => {
    it("shows the points field when switching from Base to Bonus", async () => {
      await openDialog(el);
      expect(el.shadowRoot?.querySelector("#points-value")).toBeNull();
      await switchTaskType(el, "bonus");
      const pointsInput = el.shadowRoot?.querySelector("#points-value");
      expect(pointsInput).not.toBeNull();
    });

    it("removes the points field when switching back from Bonus to Base", async () => {
      await openDialog(el);
      await switchTaskType(el, "bonus");
      expect(el.shadowRoot?.querySelector("#points-value")).not.toBeNull();
      await switchTaskType(el, "base");
      expect(el.shadowRoot?.querySelector("#points-value")).toBeNull();
    });

    it("does not include points_value in the Base payload after switching from Bonus", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      // Switch to bonus, type a points value, then switch back to base
      await switchTaskType(el, "bonus");
      const pointsInput = el.shadowRoot?.querySelector(
        "#points-value"
      ) as HTMLInputElement;
      pointsInput.value = "42";
      pointsInput.dispatchEvent(new Event("input"));
      await (el as unknown as LitElement).updateComplete;
      await switchTaskType(el, "base");
      await fillAndSubmit(el, "Make bed");

      expect(mockHass.callService).toHaveBeenCalledOnce();
      const call = mockHass.callService.mock.calls[0];
      expect(call[2]).toMatchObject({
        person_id: "person.alice",
        task_type: "base",
        name: "Make bed",
      });
      // Strict guarantee: points_value must be absent in the Base payload.
      expect(call[2].points_value).toBeUndefined();
    });
  });

  describe("validation", () => {
    beforeEach(() => openDialog(el));

    it("shows an error when name is empty and does not call hass.callService", async () => {
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await fillAndSubmit(el, "");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/task name.*required/i);
      expect(mockHass.callService).not.toHaveBeenCalled();
    });

    it("shows an error when name is whitespace-only and does not call hass.callService", async () => {
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await fillAndSubmit(el, "   ");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/task name.*required/i);
      expect(mockHass.callService).not.toHaveBeenCalled();
    });

    it("accepts a valid Base task and calls the service", async () => {
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await fillAndSubmit(el, "Make bed");
      expect(mockHass.callService).toHaveBeenCalledOnce();
    });

    it("shows an error when Bonus task has empty points_value and does not call the service", async () => {
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/points value.*required/i);
      expect(mockHass.callService).not.toHaveBeenCalled();
    });

    it("shows an error when Bonus task has points_value of 0 and does not call the service", async () => {
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum", "0");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/positive integer/i);
      expect(mockHass.callService).not.toHaveBeenCalled();
    });

    it("shows an error when Bonus task has a negative points_value and does not call the service", async () => {
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum", "-5");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/positive integer/i);
      expect(mockHass.callService).not.toHaveBeenCalled();
    });

    it("rejects Bonus tasks when the points_value input cannot yield a positive integer", async () => {
      // <input type="number"> strips non-numeric characters before the input
      // event fires, so passing "abc" to a happy-dom number input arrives in
      // the dialog state as an empty string. This tests that the same required
      // validation (positive integer) guards both "no digits" and "no value
      // at all" cases — the bonus-input contract is upheld via whichever
      // rejection path the input event produces.
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum", "abc");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error).not.toBeNull();
      expect(error?.textContent).toMatch(/required|integer/i);
      expect(mockHass.callService).not.toHaveBeenCalled();
    });

    it("shows an error when Bonus task has a non-integer points_value and does not call the service", async () => {
      const mockHass = el.hass as unknown as { callService: ReturnType<typeof vi.fn> };
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum", "1.5");
      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/positive integer/i);
      expect(mockHass.callService).not.toHaveBeenCalled();
    });

    it("clears the validation error when the user edits a field", async () => {
      // Trigger a validation error
      await fillAndSubmit(el, "");
      let error = el.shadowRoot?.querySelector(".error-message");
      expect(error).not.toBeNull();

      // Editing the name should clear the error
      const nameInput = el.shadowRoot?.querySelector(
        "#task-name"
      ) as HTMLInputElement;
      nameInput.value = "M";
      nameInput.dispatchEvent(new Event("input"));
      await (el as unknown as LitElement).updateComplete;

      error = el.shadowRoot?.querySelector(".error-message");
      expect(error).toBeNull();
    });
  });

  describe("successful submission — Base", () => {
    it("calls hass.callService with the exact Base payload (no points_value)", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "Make bed");

      expect(mockHass.callService).toHaveBeenCalledOnce();
      expect(mockHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "add_task",
        {
          person_id: "person.alice",
          task_type: "base",
          name: "Make bed",
        }
      );
      const call = mockHass.callService.mock.calls[0];
      expect(call[2].points_value).toBeUndefined();
    });

    it("trims whitespace from the name before submitting", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "  Make bed  ");

      const call = mockHass.callService.mock.calls[0];
      expect(call[2].name).toBe("Make bed");
    });

    it("uses the supplied personId rather than deriving it from the entity id", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      el.personId = "person.bob";
      await openDialog(el);
      await fillAndSubmit(el, "Make bed");

      const call = mockHass.callService.mock.calls[0];
      expect(call[2]).toMatchObject({ person_id: "person.bob" });
    });
  });

  describe("successful submission — Bonus", () => {
    it("calls hass.callService with the exact Bonus payload", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum living room", "10");

      expect(mockHass.callService).toHaveBeenCalledOnce();
      expect(mockHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "add_task",
        {
          person_id: "person.alice",
          task_type: "bonus",
          name: "Vacuum living room",
          points_value: 10,
        }
      );
    });

    it("passes points_value as a number, not a string", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum", "15");

      const call = mockHass.callService.mock.calls[0];
      expect(typeof call[2].points_value).toBe("number");
      expect(call[2].points_value).toBe(15);
    });

    it("trims whitespace from the name before submitting", async () => {
      const mockHass = makeMockHass();
      el.hass = mockHass as never;
      await openDialog(el);
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "  Vacuum  ", "10");

      const call = mockHass.callService.mock.calls[0];
      expect(call[2].name).toBe("Vacuum");
    });

    it("closes the dialog after a successful submission", async () => {
      await openDialog(el);
      await switchTaskType(el, "bonus");
      await fillAndSubmit(el, "Vacuum", "10");

      // Wait for the async callService to resolve
      await Promise.resolve();
      await (el as unknown as LitElement).updateComplete;

      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).toBeNull();
    });
  });

  describe("submission lifecycle", () => {
    it("disables the submit button while the service call is pending", async () => {
      // Create a mock whose callService returns a never-resolving promise so
      // the submitting state stays true while we assert.
      let resolveService!: () => void;
      const pending = new Promise<void>((resolve) => {
        resolveService = resolve;
      });
      const mockHass = { callService: vi.fn().mockReturnValue(pending) };
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "Make bed");

      const submitBtn = el.shadowRoot?.querySelector(
        ".submit-button"
      ) as HTMLButtonElement;
      expect(submitBtn.disabled).toBe(true);

      // Resolve the pending call so cleanup does not hang.
      resolveService();
      await (el as unknown as LitElement).updateComplete;
    });

    it("shows the retry error and does not call the service when hass is null", async () => {
      el.hass = null;
      await openDialog(el);
      await fillAndSubmit(el, "Make bed");

      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/try again/i);
      // The form should remain open
      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).not.toBeNull();
    });

    it("keeps the dialog open, preserves entered values, and shows a retry error when the service rejects", async () => {
      const mockHass = {
        callService: vi
          .fn()
          .mockRejectedValueOnce(new Error("backend blew up")),
      };
      el.hass = mockHass as never;
      await openDialog(el);
      await fillAndSubmit(el, "Make bed");

      // Let the rejection flush through the async try/catch finally block.
      await Promise.resolve();
      await Promise.resolve();
      await (el as unknown as LitElement).updateComplete;

      const dialog = el.shadowRoot?.querySelector(".dialog");
      expect(dialog).not.toBeNull();

      const error = el.shadowRoot?.querySelector(".error-message");
      expect(error?.textContent).toMatch(/try again/i);

      const submitBtn = el.shadowRoot?.querySelector(
        ".submit-button"
      ) as HTMLButtonElement;
      expect(submitBtn.disabled).toBe(false);

      // Entered values must be preserved.
      const nameInput = el.shadowRoot?.querySelector(
        "#task-name"
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("Make bed");
    });
  });
});
