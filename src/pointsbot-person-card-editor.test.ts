/**
 * Unit tests for PointsBotPersonCardEditor and getConfigElement/getStubConfig
 * on PointsBotPersonCard.
 *
 * Test harness: Vitest + happy-dom
 *
 * The ha-entity-picker element is not available in happy-dom (it is a runtime
 * HA web component). Tests focus on the editor's config-changed event
 * emission, setConfig() wiring, and the static methods on the main card.
 */

import { describe, it, expect, beforeEach } from "vitest";
import "./pointsbot-person-card-editor.js";
import "./pointsbot-person-card.js";
import type { PointsBotPersonCardEditor } from "./pointsbot-person-card-editor.js";
import type { PointsBotPersonCard } from "./pointsbot-person-card.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createElement<T extends HTMLElement>(tag: string): T {
  return document.createElement(tag) as T;
}

// ---------------------------------------------------------------------------
// PointsBotPersonCard static API
// ---------------------------------------------------------------------------

describe("PointsBotPersonCard — static methods", () => {
  it("getStubConfig returns a valid CardConfig with empty entity", () => {
    // Access via the registered custom element class
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CardClass = customElements.get("pointsbot-person-card") as any;
    const stub = CardClass.getStubConfig();
    expect(stub.type).toBe("custom:pointsbot-person-card");
    expect(stub.entity).toBe("");
  });

  it("getConfigElement returns an HTMLElement", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CardClass = customElements.get("pointsbot-person-card") as any;
    const el = CardClass.getConfigElement();
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName.toLowerCase()).toBe("pointsbot-person-card-editor");
  });
});

// ---------------------------------------------------------------------------
// PointsBotPersonCardEditor
// ---------------------------------------------------------------------------

describe("PointsBotPersonCardEditor", () => {
  let editor: PointsBotPersonCardEditor;

  beforeEach(() => {
    editor = createElement<PointsBotPersonCardEditor>(
      "pointsbot-person-card-editor"
    );
    document.body.appendChild(editor);
  });

  it("renders without throwing when no config is set", () => {
    // Should not throw — editor renders gracefully with null config
    expect(editor).toBeTruthy();
  });

  it("setConfig stores the config", () => {
    editor.setConfig({ type: "custom:pointsbot-person-card", entity: "sensor.pointsbot_alice" });
    // No public accessor — verify indirectly via config-changed event round-trip
    // (see next test)
    expect(editor).toBeTruthy();
  });

  it("fires config-changed with updated entity when _entityChanged is triggered", () => {
    editor.setConfig({ type: "custom:pointsbot-person-card", entity: "sensor.pointsbot_alice" });

    let firedConfig: unknown = null;
    editor.addEventListener("config-changed", (ev: Event) => {
      firedConfig = (ev as CustomEvent).detail.config;
    });

    // Simulate the ha-entity-picker value-changed event
    const pickerEvent = new CustomEvent("value-changed", {
      detail: { value: "sensor.pointsbot_bob" },
      bubbles: true,
      composed: true,
    });
    editor.dispatchEvent(pickerEvent);
    // _entityChanged is wired to ha-entity-picker's value-changed in the shadow
    // DOM, not directly on the editor host. Invoke it directly via the private
    // method to test the event emission logic.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any)._entityChanged(
      new CustomEvent("value-changed", { detail: { value: "sensor.pointsbot_bob" } })
    );

    expect(firedConfig).toEqual({
      type: "custom:pointsbot-person-card",
      entity: "sensor.pointsbot_bob",
    });
  });

  it("fires config-changed with empty entity when value is undefined", () => {
    editor.setConfig({ type: "custom:pointsbot-person-card", entity: "sensor.pointsbot_alice" });

    let firedConfig: unknown = null;
    editor.addEventListener("config-changed", (ev: Event) => {
      firedConfig = (ev as CustomEvent).detail.config;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any)._entityChanged(
      new CustomEvent("value-changed", { detail: {} })
    );

    expect(firedConfig).toEqual({
      type: "custom:pointsbot-person-card",
      entity: "",
    });
  });

  it("fires config-changed using stub config when no prior config is set", () => {
    // No setConfig called — _entityChanged must still produce a valid CardConfig
    let firedConfig: unknown = null;
    editor.addEventListener("config-changed", (ev: Event) => {
      firedConfig = (ev as CustomEvent).detail.config;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any)._entityChanged(
      new CustomEvent("value-changed", { detail: { value: "sensor.pointsbot_charlie" } })
    );

    expect(firedConfig).toEqual({
      type: "custom:pointsbot-person-card",
      entity: "sensor.pointsbot_charlie",
    });
  });

  it("config-changed event bubbles and is composed", () => {
    editor.setConfig({ type: "custom:pointsbot-person-card", entity: "" });

    let captured: CustomEvent | null = null;
    document.body.addEventListener("config-changed", (ev: Event) => {
      captured = ev as CustomEvent;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any)._entityChanged(
      new CustomEvent("value-changed", { detail: { value: "sensor.pointsbot_alice" } })
    );

    expect(captured).not.toBeNull();
    expect(captured!.bubbles).toBe(true);
    expect(captured!.composed).toBe(true);
  });
});
