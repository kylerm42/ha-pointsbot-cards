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
    callService: vi.fn(),
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
        callService: vi.fn(),
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
});
