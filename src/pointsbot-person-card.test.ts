/**
 * Unit tests for PointsBotPersonCard shell.
 *
 * Test harness: Vitest + happy-dom
 *
 * Rationale: The card shell's testable behavior (config validation, entity
 * lookup, state rendering) is driven by plain JS logic in setConfig() and
 * render(). Vitest + happy-dom provides a lightweight DOM environment
 * sufficient for exercising these code paths without spinning up a real
 * browser, keeping the test loop fast and the dev-dependency surface small.
 * Full browser-based rendering tests (interaction, CSS, shadow DOM) are
 * deferred to Phase 2b's test pass once the interactive elements are in place.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./pointsbot-person-card.js";
import type { PointsBotPersonCard } from "./pointsbot-person-card.js";
import type { AddTaskDialog } from "./add-task-dialog.js";
import type { AdjustPointsDialog } from "./adjust-points-dialog.js";
import * as confettiUtils from "./utils/confetti-utils.js";

// ---------------------------------------------------------------------------
// Confetti mocks
// ---------------------------------------------------------------------------
//
// The card delegates confetti effects to the playCompletionBurst /
// playPointsAnimation helpers in `./utils/confetti-utils.js`. We mock the
// module at the test-file level so that interaction tests can assert
// *behavior* (which effect fires, with which arguments, after which user
// gesture) without actually rendering canvas effects. Note that the
// module-level canvas-confetti mock in `test-setup.ts` is still required
// for any code path that resolves the real confetti helper; this mock
// short-circuits before that code runs.
// ---------------------------------------------------------------------------

vi.mock("./utils/confetti-utils.js", () => ({
  playCompletionBurst: vi.fn(),
  playPointsAnimation: vi.fn(),
  playStarShower: vi.fn(),
}));

const mockPlayCompletionBurst = vi.mocked(
  confettiUtils.playCompletionBurst,
);
const mockPlayPointsAnimation = vi.mocked(confettiUtils.playPointsAnimation);
const mockPlayStarShower = vi.mocked(confettiUtils.playStarShower);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeHass(
  entityId: string,
  stateValue: string,
  attrs: Record<string, unknown>
) {
  return {
    states: {
      [entityId]: {
        state: stateValue,
        attributes: attrs,
      },
    },
    callService: vi.fn().mockResolvedValue(undefined),
  };
}

const DEFAULT_ATTRS = {
  weekly_points: 12,
  weekly_allotment: 50,
  base_tasks: [],
  bonus_tasks: [],
  weekly_adjustments: [],
  person_id: "person.alice",
  name: "Alice",
  picture: null,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

// Reset confetti mocks between tests so call counts and arguments are
// scoped per-test. (Module-level vi.fn() mocks otherwise accumulate state
// across the whole file, leaking call history into later tests.)
beforeEach(() => {
  mockPlayCompletionBurst.mockClear();
  mockPlayPointsAnimation.mockClear();
  mockPlayStarShower.mockClear();
});

describe("PointsBotPersonCard", () => {
  describe("window.customCards registration", () => {
    it("registers the card type on module load", () => {
      const cards = (window as Window & { customCards?: unknown[] }).customCards;
      expect(cards).toBeDefined();
      const entry = cards!.find(
        (c: unknown) =>
          typeof c === "object" &&
          c !== null &&
          (c as Record<string, unknown>)["type"] === "pointsbot-person-card"
      );
      expect(entry).toBeDefined();
    });
  });

  describe("setConfig()", () => {
    it("throws when entity is missing", () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      expect(() => el.setConfig({} as never)).toThrow(/entity.*required/i);
    });

    it("throws when entity is an empty string", () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      expect(() => el.setConfig({ entity: "" } as never)).toThrow(
        /entity.*required/i
      );
    });

    it("accepts a valid config without throwing", () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      expect(() =>
        el.setConfig({
          type: "custom:pointsbot-person-card",
          entity: "sensor.pointsbot_alice",
        })
      ).not.toThrow();
    });
  });

  describe("getCardSize()", () => {
    it("returns a positive integer", () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      expect(typeof el.getCardSize()).toBe("number");
      expect(el.getCardSize()).toBeGreaterThan(0);
    });
  });

  describe("hide_card_background", () => {
    async function renderCard(
      hide_card_background?: boolean,
    ): Promise<PointsBotPersonCard> {
      const el = document.createElement(
        "pointsbot-person-card",
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      const config = {
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      } as Partial<Parameters<PointsBotPersonCard["setConfig"]>[0]>;
      if (hide_card_background !== undefined) {
        (config as Record<string, unknown>).hide_card_background =
          hide_card_background;
      }
      el.setConfig(config as Parameters<PointsBotPersonCard["setConfig"]>[0]);

      el.hass = makeHass("sensor.pointsbot_alice", "340", DEFAULT_ATTRS);
      await el.updateComplete;
      return el;
    }

    it("does not add the .no-background class when hide_card_background is omitted", async () => {
      const el = await renderCard();
      const header = el.shadowRoot?.querySelector(".header");
      expect(header).not.toBeNull();
      expect(header!.classList.contains("no-background")).toBe(false);
      document.body.removeChild(el);
    });

    it("does not add the .no-background class when hide_card_background is explicitly false", async () => {
      const el = await renderCard(false);
      const header = el.shadowRoot?.querySelector(".header");
      expect(header).not.toBeNull();
      expect(header!.classList.contains("no-background")).toBe(false);
      document.body.removeChild(el);
    });

    it("adds the .no-background class when hide_card_background is true", async () => {
      const el = await renderCard(true);
      const header = el.shadowRoot?.querySelector(".header");
      expect(header).not.toBeNull();
      expect(header!.classList.contains("no-background")).toBe(true);
      document.body.removeChild(el);
    });
  });

  describe("render — missing entity", () => {
    it("shows an error message when entity is not in hass.states", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_missing",
      });
      el.hass = {
        states: {},
        callService: vi.fn().mockResolvedValue(undefined),
      };

      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toMatch(/not found/i);
      document.body.removeChild(el);
    });
  });

  describe("render — unavailable entity", () => {
    it("shows an unavailable error when state is 'unavailable'", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = makeHass("sensor.pointsbot_alice", "unavailable", {});

      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toMatch(/unavailable/i);
      document.body.removeChild(el);
    });

    it("shows an unknown error when state is 'unknown'", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = makeHass("sensor.pointsbot_alice", "unknown", {});

      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toMatch(/unknown/i);
      document.body.removeChild(el);
    });
  });

  describe("render — normal entity", () => {
    let el: PointsBotPersonCard;

    beforeEach(async () => {
      el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = makeHass("sensor.pointsbot_alice", "340", DEFAULT_ATTRS);
      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it("displays the person name", () => {
      expect(el.shadowRoot?.textContent).toContain("Alice");
    });

    it("displays total_points from entity state", () => {
      expect(el.shadowRoot?.textContent).toContain("340");
    });

    it("displays weekly_points from entity attributes", () => {
      expect(el.shadowRoot?.textContent).toContain("12");
    });

    it("renders a placeholder when picture is null", () => {
      const placeholder = el.shadowRoot?.querySelector(".avatar-placeholder");
      expect(placeholder).not.toBeNull();
    });

    it("renders an img when picture is provided", async () => {
      el.hass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        picture: "/api/image/proxy?url=http://example.com/pic.jpg",
      });
      await el.updateComplete;

      const img = el.shadowRoot?.querySelector("img.avatar");
      expect(img).not.toBeNull();
      expect(img?.getAttribute("src")).toContain("example.com");
    });

    it("falls back to entity id as name when name attribute is null", async () => {
      el.hass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        name: null,
      });
      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toContain("sensor.pointsbot_alice");
    });

    it("parses fractional state values correctly", async () => {
      el.hass = makeHass("sensor.pointsbot_alice", "42.5", DEFAULT_ATTRS);
      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toContain("42.5");
    });

    it("rerenders when Home Assistant publishes updated entity state", async () => {
      el.hass = makeHass("sensor.pointsbot_alice", "341", {
        ...DEFAULT_ATTRS,
        weekly_points: 13,
      });
      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toContain("341");
      expect(el.shadowRoot?.textContent).toContain("13");
    });
  });

  describe("render — secondary_value_entity", () => {
    let el: PointsBotPersonCard;

    beforeEach(() => {
      el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    const baseConfig = {
      type: "custom:pointsbot-person-card",
      entity: "sensor.pointsbot_alice",
    } as const;

    it("renders nothing in the extra slot when secondary_value_entity is unset", async () => {
      el.setConfig({ ...baseConfig });
      el.hass = makeHass("sensor.pointsbot_alice", "340", DEFAULT_ATTRS);
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector(".points-extra")).toBeNull();
    });

    it("renders the configured entity's state in the extra slot", async () => {
      el.setConfig({
        ...baseConfig,
        secondary_value_entity: "sensor.streak",
      });
      el.hass = {
        states: {
          "sensor.pointsbot_alice": {
            state: "340",
            attributes: DEFAULT_ATTRS,
          },
          "sensor.streak": {
            state: "7",
            attributes: {},
          },
        },
        callService: vi.fn().mockResolvedValue(undefined),
      };
      await el.updateComplete;

      const extra = el.shadowRoot?.querySelector(".points-extra");
      expect(extra).not.toBeNull();
      expect(extra?.textContent).toBe("7");
    });

    it("renders nothing when the configured entity is missing from hass", async () => {
      el.setConfig({
        ...baseConfig,
        secondary_value_entity: "sensor.does_not_exist",
      });
      el.hass = makeHass("sensor.pointsbot_alice", "340", DEFAULT_ATTRS);
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector(".points-extra")).toBeNull();
    });

    it("renders nothing when the configured entity state is unavailable", async () => {
      el.setConfig({
        ...baseConfig,
        secondary_value_entity: "sensor.streak",
      });
      el.hass = {
        states: {
          "sensor.pointsbot_alice": {
            state: "340",
            attributes: DEFAULT_ATTRS,
          },
          "sensor.streak": {
            state: "unavailable",
            attributes: {},
          },
        },
        callService: vi.fn().mockResolvedValue(undefined),
      };
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector(".points-extra")).toBeNull();
    });
  });

  describe("service calls — toggle_base_task", () => {
    it("calls hass.callService with correct arguments when a base task checkbox is clicked", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      const mockHass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        base_tasks: [{ id: "task-uuid-1", name: "Make bed", done: false }],
      });

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = mockHass;
      await el.updateComplete;

      const completeButton = el.shadowRoot?.querySelector(
        "button.circle-button"
      ) as HTMLButtonElement | null;
      expect(completeButton).not.toBeNull();
      completeButton!.click();
      await el.updateComplete;

      expect(mockHass.callService).toHaveBeenCalledOnce();
      expect(mockHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "toggle_base_task",
        { person_id: "person.alice", task_id: "task-uuid-1" }
      );

      document.body.removeChild(el);
    });
  });

  describe("service calls — complete_bonus_task", () => {
    it("calls hass.callService with correct arguments when a bonus task Complete button is clicked", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      const mockHass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        bonus_tasks: [
          {
            id: "bonus-uuid-1",
            name: "Vacuum living room",
            points_value: 10,
            enabled: true,
            completions_this_week: 0,
          },
        ],
      });

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = mockHass;
      await el.updateComplete;

      // The collapsible section hides content via CSS (not DOM removal),
      // so the button is queryable regardless of collapsed state.
      const completeBtn = el.shadowRoot?.querySelector(
        ".bonus-actions .circle-button:last-of-type"
      ) as HTMLButtonElement | null;
      expect(completeBtn).not.toBeNull();
      completeBtn!.click();
      await el.updateComplete;

      expect(mockHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "complete_bonus_task",
        { person_id: "person.alice", task_id: "bonus-uuid-1" }
      );

      document.body.removeChild(el);
    });

    it("disables both controls for disabled bonus tasks", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      const mockHass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        bonus_tasks: [
          {
            id: "bonus-uuid-2",
            name: "Clean bathroom",
            points_value: 15,
            enabled: false,
            completions_this_week: 0,
          },
        ],
      });

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = mockHass;
      await el.updateComplete;

      const bonusButtons = el.shadowRoot?.querySelectorAll(
        ".bonus-actions button"
      );
      expect(bonusButtons).toHaveLength(2);
      bonusButtons?.forEach((button) =>
        expect((button as HTMLButtonElement).disabled).toBe(true)
      );

      document.body.removeChild(el);
    });
  });

  describe("bonus row — points-badge pill", () => {
    it("renders a .points-badge pill with '+' prefix, points_value, and star icon for an enabled bonus task", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        bonus_tasks: [
          {
            id: "bonus-uuid-pill",
            name: "Vacuum living room",
            points_value: 5,
            enabled: true,
            completions_this_week: 0,
          },
        ],
      });
      await el.updateComplete;

      const pill = el.shadowRoot?.querySelector(
        ".bonus-row .points-badge"
      ) as HTMLElement | null;
      expect(pill).not.toBeNull();
      // "+5" should be the first text content of the pill
      expect(pill?.textContent?.trim().startsWith("+5")).toBe(true);
      // The pill should contain the configured icon (mdi:star-circle)
      const icon = pill?.querySelector("ha-icon");
      expect(icon).not.toBeNull();
      expect(icon?.getAttribute("icon")).toBe("mdi:star-circle");

      document.body.removeChild(el);
    });

    it("does not render a '· disabled' text label for disabled bonus tasks", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        bonus_tasks: [
          {
            id: "bonus-uuid-disabled",
            name: "Clean bathroom",
            points_value: 15,
            enabled: false,
            completions_this_week: 0,
          },
        ],
      });
      await el.updateComplete;

      const text = el.shadowRoot?.textContent ?? "";
      // The task name is rendered; the pill is rendered; but no "· disabled"
      // suffix should appear in the row's text.
      expect(text).toContain("Clean bathroom");
      expect(text).toContain("+15");
      expect(text).not.toMatch(/·\s*disabled/);
      // The disabled state is still communicated via the row's class
      const disabledRow = el.shadowRoot?.querySelector(
        ".bonus-row.disabled"
      );
      expect(disabledRow).not.toBeNull();

      document.body.removeChild(el);
    });
  });

  describe("render — live hass updates", () => {
    it("re-renders when hass is updated with new state", async () => {
      const el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      el.hass = makeHass("sensor.pointsbot_alice", "100", DEFAULT_ATTRS);
      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toContain("100");

      el.hass = makeHass("sensor.pointsbot_alice", "150", {
        ...DEFAULT_ATTRS,
        weekly_points: 20,
      });
      await el.updateComplete;

      expect(el.shadowRoot?.textContent).toContain("150");
      expect(el.shadowRoot?.textContent).toContain("20");

      document.body.removeChild(el);
    });
  });

  describe("action row — Add Task and Adjust Points dialogs", () => {
    let el: PointsBotPersonCard;
    let mockHass: ReturnType<typeof makeHass>;

    beforeEach(async () => {
      el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);

      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      mockHass = makeHass("sensor.pointsbot_alice", "340", DEFAULT_ATTRS);
      el.hass = mockHass;
      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it("renders a single .action-row containing both dialog elements", () => {
      const actionRows = el.shadowRoot?.querySelectorAll(".action-row");
      expect(actionRows).toHaveLength(1);

      const row = actionRows![0];
      const addTask = row.querySelector("pointsbot-add-task-dialog");
      const adjustPoints = row.querySelector("pointsbot-adjust-points-dialog");

      expect(addTask).not.toBeNull();
      expect(adjustPoints).not.toBeNull();
    });

    it("renders the Add Task dialog before the Adjust Points dialog in DOM order", () => {
      const row = el.shadowRoot?.querySelector(".action-row") as HTMLElement;
      const children = Array.from(row.children);
      const addTaskIdx = children.findIndex(
        (c) => c.tagName.toLowerCase() === "pointsbot-add-task-dialog"
      );
      const adjustIdx = children.findIndex(
        (c) => c.tagName.toLowerCase() === "pointsbot-adjust-points-dialog"
      );

      expect(addTaskIdx).toBeGreaterThanOrEqual(0);
      expect(adjustIdx).toBeGreaterThanOrEqual(0);
      expect(addTaskIdx).toBeLessThan(adjustIdx);
    });

    it("wires the card's hass to both embedded dialog elements", () => {
      const addTask = el.shadowRoot?.querySelector(
        "pointsbot-add-task-dialog"
      ) as AddTaskDialog;
      const adjustPoints = el.shadowRoot?.querySelector(
        "pointsbot-adjust-points-dialog"
      ) as AdjustPointsDialog;

      expect(addTask).not.toBeNull();
      expect(adjustPoints).not.toBeNull();

      // Both dialogs should hold the same hass reference the card was
      // configured with.
      expect(addTask.hass).toBe(mockHass);
      expect(adjustPoints.hass).toBe(mockHass);
    });

    it("wires the sensor's person_id to both embedded dialog elements (verified via a successful service call)", async () => {
      const addTask = el.shadowRoot?.querySelector(
        "pointsbot-add-task-dialog"
      ) as AddTaskDialog;
      const adjustPoints = el.shadowRoot?.querySelector(
        "pointsbot-adjust-points-dialog"
      ) as AdjustPointsDialog;
      expect(addTask).not.toBeNull();
      expect(adjustPoints).not.toBeNull();

      // Trigger a successful Add Task submission from the embedded dialog.
      const addTaskOpen = addTask.shadowRoot?.querySelector(
        ".add-button"
      ) as HTMLButtonElement;
      addTaskOpen.click();
      await addTask.updateComplete;
      const addTaskName = addTask.shadowRoot?.querySelector(
        "#task-name"
      ) as HTMLInputElement;
      addTaskName.value = "Make bed";
      addTaskName.dispatchEvent(new Event("input"));
      await addTask.updateComplete;
      const addTaskSubmit = addTask.shadowRoot?.querySelector(
        ".submit-button"
      ) as HTMLButtonElement;
      addTaskSubmit.click();
      await addTask.updateComplete;
      await Promise.resolve();

      // Trigger a successful Adjust Points submission from the embedded dialog.
      const adjustOpen = adjustPoints.shadowRoot?.querySelector(
        ".add-button"
      ) as HTMLButtonElement;
      adjustOpen.click();
      await adjustPoints.updateComplete;
      const amountInput = adjustPoints.shadowRoot?.querySelector(
        "#amount"
      ) as HTMLInputElement;
      const reasonInput = adjustPoints.shadowRoot?.querySelector(
        "#reason"
      ) as HTMLTextAreaElement;
      amountInput.value = "5";
      amountInput.dispatchEvent(new Event("input"));
      reasonInput.value = "Good job";
      reasonInput.dispatchEvent(new Event("input"));
      await adjustPoints.updateComplete;
      const adjustSubmit = adjustPoints.shadowRoot?.querySelector(
        ".submit-button"
      ) as HTMLButtonElement;
      adjustSubmit.click();
      await adjustPoints.updateComplete;
      await Promise.resolve();

      // Both service calls should have routed through the card's mock hass
      // and used the sensor's person_id attribute ("person.alice").
      const addTaskCall = mockHass.callService.mock.calls.find(
        (c) => c[1] === "add_task"
      );
      const adjustCall = mockHass.callService.mock.calls.find(
        (c) => c[1] === "adjust_points"
      );
      expect(addTaskCall).toBeDefined();
      expect(adjustCall).toBeDefined();
      expect(addTaskCall![2]).toMatchObject({ person_id: "person.alice" });
      expect(adjustCall![2]).toMatchObject({ person_id: "person.alice" });
    });

    it("renders both .add-button elements with an mdi:plus ha-icon in a separate icon section", async () => {
      const addTask = el.shadowRoot?.querySelector(
        "pointsbot-add-task-dialog"
      ) as AddTaskDialog;
      const adjustPoints = el.shadowRoot?.querySelector(
        "pointsbot-adjust-points-dialog"
      ) as AdjustPointsDialog;
      expect(addTask).not.toBeNull();
      expect(adjustPoints).not.toBeNull();

      const addButton = addTask.shadowRoot?.querySelector(
        ".add-button",
      ) as HTMLElement | null;
      const adjustButton = adjustPoints.shadowRoot?.querySelector(
        ".add-button",
      ) as HTMLElement | null;
      expect(addButton).not.toBeNull();
      expect(adjustButton).not.toBeNull();

      for (const [button, expectedText] of [
        [addButton, "Add Task"] as const,
        [adjustButton, "Adjust Points"] as const,
      ]) {
        // The icon section is the first child, containing the ha-icon.
        const iconSection = button!.querySelector(".button-icon-section");
        expect(iconSection).not.toBeNull();
        const icon = iconSection!.querySelector("ha-icon");
        expect(icon).not.toBeNull();
        expect(icon!.getAttribute("icon")).toBe("mdi:plus");

        // The text area is the last child.
        const textArea = button!.querySelector(".button-info");
        expect(textArea).not.toBeNull();
        expect(textArea!.textContent?.trim()).toBe(expectedText);
      }
    });
  });

  // -------------------------------------------------------------------------
  // Confetti trigger / suppression behavior
  // -------------------------------------------------------------------------
  //
  // These tests pin down *behavioral* contracts that would otherwise only
  // be verifiable by code inspection: which user gestures fire which
  // confetti effects, and whether a failed service call suppresses them.
  // The confetti-utils module is mocked at the top of this file so these
  // tests can assert call counts and arguments directly.
  // -------------------------------------------------------------------------

  describe("confetti triggers — bonus tasks", () => {
    let el: PointsBotPersonCard;
    let hass: ReturnType<typeof makeHass>;

    // Some assertions in this block make `callService` return a rejected
    // promise. The card's async handlers now catch these, so no
    // unhandledRejection suppression is needed.
    beforeEach(async () => {
      el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);
      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      hass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        bonus_tasks: [
          {
            id: "bonus-uuid-1",
            name: "Vacuum living room",
            points_value: 10,
            enabled: true,
            completions_this_week: 0,
          },
        ],
      });
      el.hass = hass;
      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it("fires both playCompletionBurst and playPointsAnimation after a successful complete_bonus_task service call", async () => {
      const completeBtn = el.shadowRoot?.querySelector(
        ".bonus-actions .circle-button:last-of-type"
      ) as HTMLButtonElement | null;
      expect(completeBtn).not.toBeNull();

      completeBtn!.click();
      await el.updateComplete;
      // Flush microtasks so the awaited callService resolves and the
      // post-await confetti calls execute before we assert.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(hass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "complete_bonus_task",
        { person_id: "person.alice", task_id: "bonus-uuid-1" }
      );
      expect(mockPlayCompletionBurst).toHaveBeenCalledOnce();
      // playPointsAnimation receives the pixel origin (x, y in CSS px)
      // and the points_value, both captured synchronously in the click
      // handler before the await.
      expect(mockPlayPointsAnimation).toHaveBeenCalledOnce();
      expect(mockPlayPointsAnimation).toHaveBeenCalledWith(
        { x: expect.any(Number), y: expect.any(Number) },
        10,
      );
      expect(mockPlayStarShower).not.toHaveBeenCalled();
    });

    it("does NOT fire any confetti function when uncompleting a bonus task (the '−' button)", async () => {
      // The uncomplete button is disabled when completions_this_week is 0,
      // so bump it to a non-zero count to enable the gesture under test.
      hass.states["sensor.pointsbot_alice"].attributes = {
        ...hass.states["sensor.pointsbot_alice"].attributes as object,
        bonus_tasks: [
          {
            id: "bonus-uuid-1",
            name: "Vacuum living room",
            points_value: 10,
            enabled: true,
            completions_this_week: 1,
          },
        ],
      };
      el.hass = hass;
      await el.updateComplete;

      const uncompleteBtn = el.shadowRoot?.querySelector(
        ".bonus-actions .circle-button:first-of-type"
      ) as HTMLButtonElement | null;
      expect(uncompleteBtn).not.toBeNull();
      expect(uncompleteBtn!.disabled).toBe(false);

      uncompleteBtn!.click();
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(hass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "uncomplete_bonus_task",
        { person_id: "person.alice", task_id: "bonus-uuid-1" }
      );
      expect(mockPlayCompletionBurst).not.toHaveBeenCalled();
      expect(mockPlayPointsAnimation).not.toHaveBeenCalled();
    });

    it("does NOT fire any confetti function when the complete_bonus_task service call rejects", async () => {
      hass.callService.mockRejectedValueOnce(new Error("backend rejected"));

      const completeBtn = el.shadowRoot?.querySelector(
        ".bonus-actions .circle-button:last-of-type"
      ) as HTMLButtonElement | null;
      completeBtn!.click();
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      // The card's async handler catches the rejection; no confetti fires.
      expect(mockPlayCompletionBurst).not.toHaveBeenCalled();
      expect(mockPlayPointsAnimation).not.toHaveBeenCalled();
    });
  });

  describe("confetti triggers — base tasks", () => {
    let el: PointsBotPersonCard;
    let hass: ReturnType<typeof makeHass>;

    beforeEach(async () => {
      el = document.createElement(
        "pointsbot-person-card"
      ) as PointsBotPersonCard;
      document.body.appendChild(el);
      el.setConfig({
        type: "custom:pointsbot-person-card",
        entity: "sensor.pointsbot_alice",
      });
      hass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        base_tasks: [{ id: "task-uuid-1", name: "Make bed", done: false }],
      });
      el.hass = hass;
      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it("fires playCompletionBurst (only) after toggling an incomplete base task", async () => {
      const button = el.shadowRoot?.querySelector(
        "button.circle-button"
      ) as HTMLButtonElement | null;
      expect(button).not.toBeNull();

      button!.click();
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(hass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "toggle_base_task",
        { person_id: "person.alice", task_id: "task-uuid-1" }
      );
      expect(mockPlayCompletionBurst).toHaveBeenCalledOnce();
      // playCompletionBurst consumes the normalized origin — verify it's
      // in [0, 1] viewport-fraction space (not raw pixels).
      const burstArgs = mockPlayCompletionBurst.mock.calls[0][0];
      expect(burstArgs.x).toBeGreaterThanOrEqual(0);
      expect(burstArgs.x).toBeLessThanOrEqual(1);
      expect(burstArgs.y).toBeGreaterThanOrEqual(0);
      expect(burstArgs.y).toBeLessThanOrEqual(1);
      expect(mockPlayPointsAnimation).not.toHaveBeenCalled();
      expect(mockPlayStarShower).not.toHaveBeenCalled();
    });

    it("does NOT fire any confetti function when toggling a *completed* base task (wasDone=true)", async () => {
      // Replace the hass with one carrying a completed task. Capture the
      // new hass so we can assert on its callService mock (the button
      // click goes through `this._hass.callService`, which is now the
      // replacement).
      const completedHass = makeHass("sensor.pointsbot_alice", "340", {
        ...DEFAULT_ATTRS,
        base_tasks: [{ id: "task-uuid-1", name: "Make bed", done: true }],
      });
      el.hass = completedHass;
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector(
        "button.circle-button"
      ) as HTMLButtonElement | null;
      expect(button).not.toBeNull();

      button!.click();
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(completedHass.callService).toHaveBeenCalledWith(
        "pointsbot",
        "toggle_base_task",
        { person_id: "person.alice", task_id: "task-uuid-1" }
      );
      // No confetti for an "uncomplete" gesture on a base task.
      expect(mockPlayCompletionBurst).not.toHaveBeenCalled();
      expect(mockPlayPointsAnimation).not.toHaveBeenCalled();
    });

    it("does NOT fire any confetti function when the toggle_base_task service call rejects", async () => {
      hass.callService.mockRejectedValueOnce(new Error("backend rejected"));

      const button = el.shadowRoot?.querySelector(
        "button.circle-button"
      ) as HTMLButtonElement | null;
      button!.click();
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockPlayCompletionBurst).not.toHaveBeenCalled();
      expect(mockPlayPointsAnimation).not.toHaveBeenCalled();
    });
  });
});
