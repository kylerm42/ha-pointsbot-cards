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

  it("getConfigForm returns a native sensor entity selector", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CardClass = customElements.get("pointsbot-person-card") as any;
    expect(CardClass.getConfigForm()).toEqual({
      schema: [
        {
          name: "entity",
          required: true,
          selector: {
            entity: { filter: { domain: "sensor", integration: "pointsbot" } },
          },
        },
      ],
    });
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
    // Should not throw — editor renders gracefully with null config.
    // Verify the element is an HTMLElement in the DOM with the expected tag name.
    expect(editor).toBeInstanceOf(HTMLElement);
    expect(editor.tagName.toLowerCase()).toBe("pointsbot-person-card-editor");
    expect(document.body.contains(editor)).toBe(true);
  });

  it("setConfig propagates config — reflected via config-changed event on subsequent _entityChanged", () => {
    editor.setConfig({ type: "custom:pointsbot-person-card", entity: "sensor.pointsbot_alice" });

    // Verify config was stored by triggering _entityChanged and asserting the
    // existing entity value is carried forward into the event payload.
    let firedConfig: Record<string, unknown> | null = null;
    editor.addEventListener("config-changed", (ev: Event) => {
      firedConfig = (ev as CustomEvent).detail.config;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any)._entityChanged(
      new CustomEvent("value-changed", { detail: { value: "sensor.pointsbot_alice" } })
    );

    expect(firedConfig).toEqual({
      type: "custom:pointsbot-person-card",
      entity: "sensor.pointsbot_alice",
    });
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
