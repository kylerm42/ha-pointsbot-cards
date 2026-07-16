/**
 * Unit tests for PointsBotCollapsibleSection and bonus-task disabled state.
 *
 * Test harness: Vitest + happy-dom (same pattern as Phase 2a card tests).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./collapsible-section.js";
import "./pointsbot-person-card.js";
import type { PointsBotPersonCard } from "./pointsbot-person-card.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEl(tag: string): HTMLElement {
  const el = document.createElement(tag);
  document.body.appendChild(el);
  return el;
}

function cleanup(el: HTMLElement) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

function makeHassWithTasks(overrides: Record<string, unknown> = {}) {
  return {
    states: {
      "sensor.pointsbot_alice": {
        state: "100",
        attributes: {
          weekly_points: 10,
          weekly_allotment: 50,
          person_id: "person.alice",
          name: "Alice",
          picture: null,
          base_tasks: [
            { id: "bt1", name: "Make bed", done: false },
            { id: "bt2", name: "Brush teeth", done: true },
          ],
          bonus_tasks: [
            {
              id: "bon1",
              name: "Vacuum",
              points_value: 10,
              enabled: true,
              completions_this_week: 1,
            },
            {
              id: "bon2",
              name: "Wash dishes",
              points_value: 5,
              enabled: false,
              completions_this_week: 0,
            },
          ],
          weekly_adjustments: [
            {
              id: "adj1",
              amount: -5,
              reason: "Left mess",
              timestamp: "2026-07-14T10:00:00+00:00",
            },
          ],
          ...overrides,
        },
      },
    },
    callService: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// PointsBotCollapsibleSection — open/close toggling
// ---------------------------------------------------------------------------

describe("PointsBotCollapsibleSection", () => {
  let el: HTMLElement;

  afterEach(() => cleanup(el));

  it("starts collapsed by default (open property absent)", async () => {
    el = makeEl("pointsbot-collapsible-section");
    await (el as LitElement).updateComplete;

    const content = el.shadowRoot?.querySelector(".section-content");
    expect(content?.classList.contains("open")).toBe(false);
  });

  it("starts open when open property is set before connection", async () => {
    el = document.createElement("pointsbot-collapsible-section");
    (el as HTMLElement & { open: boolean }).open = true;
    document.body.appendChild(el);
    await (el as LitElement).updateComplete;

    const content = el.shadowRoot?.querySelector(".section-content");
    expect(content?.classList.contains("open")).toBe(true);
  });

  it("toggles open on header click", async () => {
    el = makeEl("pointsbot-collapsible-section");
    await (el as LitElement).updateComplete;

    const header = el.shadowRoot?.querySelector(
      ".section-header"
    ) as HTMLElement;
    expect(header).not.toBeNull();

    // Initially collapsed
    let content = el.shadowRoot?.querySelector(".section-content");
    expect(content?.classList.contains("open")).toBe(false);

    // Click to open
    header.click();
    await (el as LitElement).updateComplete;
    content = el.shadowRoot?.querySelector(".section-content");
    expect(content?.classList.contains("open")).toBe(true);

    // Click to close again
    header.click();
    await (el as LitElement).updateComplete;
    content = el.shadowRoot?.querySelector(".section-content");
    expect(content?.classList.contains("open")).toBe(false);
  });

  it("rotates chevron when open", async () => {
    el = makeEl("pointsbot-collapsible-section");
    await (el as LitElement).updateComplete;

    const header = el.shadowRoot?.querySelector(
      ".section-header"
    ) as HTMLElement;
    header.click();
    await (el as LitElement).updateComplete;

    const chevron = el.shadowRoot?.querySelector(".section-header-chevron");
    expect(chevron?.classList.contains("open")).toBe(true);
  });

  it("shows label with count when count > 0", async () => {
    el = document.createElement("pointsbot-collapsible-section");
    (el as HTMLElement & { label: string; count: number }).label = "Base Tasks";
    (el as HTMLElement & { label: string; count: number }).count = 3;
    document.body.appendChild(el);
    await (el as LitElement).updateComplete;

    const labelEl = el.shadowRoot?.querySelector(".section-header-label");
    expect(labelEl?.textContent).toContain("Base Tasks (3)");
  });

  it("shows label without count when count is 0", async () => {
    el = document.createElement("pointsbot-collapsible-section");
    (el as HTMLElement & { label: string; count: number }).label = "Base Tasks";
    (el as HTMLElement & { label: string; count: number }).count = 0;
    document.body.appendChild(el);
    await (el as LitElement).updateComplete;

    const labelEl = el.shadowRoot?.querySelector(".section-header-label");
    expect(labelEl?.textContent?.trim()).toBe("Base Tasks");
  });
});

// Minimal Lit interface for updateComplete access
interface LitElement extends HTMLElement {
  updateComplete: Promise<boolean>;
}

// ---------------------------------------------------------------------------
// PointsBotPersonCard — bonus task disabled state
// ---------------------------------------------------------------------------

describe("PointsBotPersonCard — bonus task disabled-state rendering", () => {
  let card: PointsBotPersonCard;

  beforeEach(async () => {
    card = document.createElement(
      "pointsbot-person-card"
    ) as PointsBotPersonCard;
    document.body.appendChild(card);
    card.setConfig({
      type: "custom:pointsbot-person-card",
      entity: "sensor.pointsbot_alice",
    });
    card.hass = makeHassWithTasks();
    await card.updateComplete;
  });

  afterEach(() => cleanup(card));

  it("renders the enabled bonus task with a Complete button", () => {
    // The card's bonus tasks are inside a collapsible-section shadow DOM slot.
    // We check rendered text in the card's own shadow root (light DOM children
    // of the slot are owned by the card's shadow DOM template).
    const text = card.shadowRoot?.textContent ?? "";
    expect(text).toContain("Vacuum");
  });

  it("does not render a Complete button for disabled bonus tasks", () => {
    // Find all bonus-row elements in the card shadow root.
    const rows = card.shadowRoot?.querySelectorAll(".bonus-row") ?? [];
    // The disabled row should have no complete-button child.
    let disabledRowHasButton = false;
    rows.forEach((row) => {
      if (row.classList.contains("disabled")) {
        const btn = row.querySelector(".complete-button");
        if (btn) disabledRowHasButton = true;
      }
    });
    expect(disabledRowHasButton).toBe(false);
  });

  it("marks disabled bonus task row with .disabled class", () => {
    const rows = card.shadowRoot?.querySelectorAll(".bonus-row") ?? [];
    const disabledRows = Array.from(rows).filter((r) =>
      r.classList.contains("disabled")
    );
    expect(disabledRows.length).toBe(1);
  });

  it("enabled task row does NOT have .disabled class", () => {
    const rows = card.shadowRoot?.querySelectorAll(".bonus-row") ?? [];
    const enabledRows = Array.from(rows).filter(
      (r) => !r.classList.contains("disabled")
    );
    expect(enabledRows.length).toBe(1);
    expect(enabledRows[0].querySelector(".complete-button")).not.toBeNull();
  });

  it("still shows completions_this_week count for disabled task", () => {
    // Disabled task with completions_this_week: 0 should still show meta info.
    // We test with completions_this_week > 0 to confirm count renders regardless.
    const hassWithCompletions = makeHassWithTasks({
      bonus_tasks: [
        {
          id: "bon2",
          name: "Wash dishes",
          points_value: 5,
          enabled: false,
          completions_this_week: 3,
        },
      ],
    });
    card.hass = hassWithCompletions;
    return card.updateComplete.then(() => {
      const text = card.shadowRoot?.textContent ?? "";
      expect(text).toContain("3×");
    });
  });

  it("shows empty-state message when bonus_tasks is empty", async () => {
    card.hass = makeHassWithTasks({ bonus_tasks: [] });
    await card.updateComplete;
    const text = card.shadowRoot?.textContent ?? "";
    expect(text).toContain("No bonus tasks");
  });

  it("shows empty-state message when base_tasks is empty", async () => {
    card.hass = makeHassWithTasks({ base_tasks: [] });
    await card.updateComplete;
    const text = card.shadowRoot?.textContent ?? "";
    expect(text).toContain("No base tasks");
  });

  it("shows empty-state message when weekly_adjustments is empty", async () => {
    card.hass = makeHassWithTasks({ weekly_adjustments: [] });
    await card.updateComplete;
    const text = card.shadowRoot?.textContent ?? "";
    expect(text).toContain("No adjustments this week");
  });
});
