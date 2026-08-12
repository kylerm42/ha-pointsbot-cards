import { describe, expect, it, vi } from "vitest";
import "./pointsbot-person-rewards-card.js";
import type { PointsBotPersonRewardsCard } from "./pointsbot-person-rewards-card.js";
import * as confetti from "./utils/confetti-utils.js";

vi.mock("./utils/confetti-utils.js", () => ({
  extractColorVariants: vi.fn(() => ({ accent: "#B29FE8", text: "#17151d" })),
  playStarShower: vi.fn(),
}));

const reward = {
  id: "reward-1", person_id: "person.alice", name: "Movie night", cost: 10,
  icon: "mdi:movie", enabled: true, description: "A film", created: "2026-01-01", modified: "2026-01-01",
};

function makeHass(rewards = [reward], balance = "12") {
  return {
    states: {
      "sensor.pointsbot_alice": { state: balance, attributes: { person_id: "person.alice", name: "Alice", rewards } },
    },
    callService: vi.fn().mockResolvedValue(undefined),
  };
}

async function renderCard(config = {}) {
  const card = document.createElement("pointsbot-person-rewards-card") as PointsBotPersonRewardsCard;
  card.setConfig({ type: "custom:pointsbot-person-rewards-card", person: "person.alice", ...config });
  const hass = makeHass();
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  return { card, hass };
}

describe("PointsBotPersonRewardsCard", () => {
  it("requires a person entity in card configuration", () => {
    const card = document.createElement("pointsbot-person-rewards-card") as PointsBotPersonRewardsCard;
    expect(() => card.setConfig({ type: "custom:pointsbot-person-rewards-card" })).toThrow("requires a person entity");
    expect(() => card.setConfig({ type: "custom:pointsbot-person-rewards-card", person: "sensor.points" })).toThrow("requires a person entity");
  });

  it("provides documented defaults and visual-editor options", () => {
    const config = (customElements.get("pointsbot-person-rewards-card") as typeof PointsBotPersonRewardsCard).getStubConfig();
    expect(config).toMatchObject({ show_disabled_rewards: false, sort_by: "cost", show_add_reward_button: true });
    expect(((customElements.get("pointsbot-person-rewards-card") as typeof PointsBotPersonRewardsCard).getConfigForm().schema as Array<{ name: string }>).map((field) => field.name))
      .toEqual(["person", "hide_card_background", "show_disabled_rewards", "sort_by", "show_add_reward_button", "accent_color"]);
  });

  it("shows only the configured person's rewards", async () => {
    const { card } = await renderCard({ show_add_reward_button: false });
    expect(card.shadowRoot?.textContent).toContain("Movie night");
    expect(card.shadowRoot?.textContent).not.toContain("No rewards available");
  });

  it("matches profiles by person_id and renders no runtime selector or fallback", async () => {
    const { card, hass } = await renderCard({ show_add_reward_button: false });
    (hass.states as Record<string, { state: string; attributes: Record<string, unknown> }>)["sensor.pointsbot_bob"] = {
      state: "99",
      attributes: { person_id: "person.bob", name: "Bob", rewards: [{ ...reward, id: "reward-2", person_id: "person.bob", name: "Bob's reward" }] },
    };
    card.hass = hass;
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).not.toContain("Bob's reward");
    expect(card.shadowRoot?.querySelector("select")).toBeNull();
    expect(card.shadowRoot?.querySelector("[aria-label*='Person']")).toBeNull();
  });

  it("fails closed when the configured profile is missing", async () => {
    const { card } = await renderCard({ person: "person.bob" });
    expect(card.shadowRoot?.textContent).toContain("No PointsBot profile is available");
    expect(card.shadowRoot?.textContent).not.toContain("Movie night");
  });

  it("fails closed for unavailable and non-PointsBot entities", async () => {
    const { card, hass } = await renderCard({ person: "person.bob" });
    const states = hass.states as Record<string, { state: string; attributes: Record<string, unknown> }>;
    states["sensor.pointsbot_bob"] = { state: "unavailable", attributes: { person_id: "person.bob", rewards: [reward] } };
    states["light.not_pointsbot"] = { state: "10", attributes: { person_id: "person.bob", rewards: [reward] } };
    card.hass = hass;
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("No PointsBot profile is available");
    expect(card.shadowRoot?.textContent).not.toContain("Movie night");
  });

  it("fails closed for an unknown PointsBot sensor", async () => {
    const { card, hass } = await renderCard({ person: "person.bob" });
    const states = hass.states as Record<string, { state: string; attributes: Record<string, unknown> }>;
    states["sensor.pointsbot_bob"] = { state: "unknown", attributes: { person_id: "person.bob", rewards: [reward] } };
    card.hass = hass;
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("No PointsBot profile is available");
    expect(card.shadowRoot?.textContent).not.toContain("Movie night");
  });

  it("filters contaminated reward snapshots before rendering actions", async () => {
    const contaminated = { ...reward, id: "reward-bob", person_id: "person.bob", name: "Bob's reward" };
    const { card } = await renderCard({ show_add_reward_button: false });
    card.hass = makeHass([reward, contaminated]);
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("Movie night");
    expect(card.shadowRoot?.textContent).not.toContain("Bob's reward");
    expect(card.shadowRoot?.querySelectorAll("button.reward-card")).toHaveLength(1);
  });

  it("allows disabled rewards to open detail while disabling redemption", async () => {
    const disabled = { ...reward, enabled: false };
    const { card } = await renderCard({ show_disabled_rewards: true });
    card.hass = makeHass([disabled]);
    await card.updateComplete;
    (card.shadowRoot?.querySelector("button.reward-card") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("Disabled reward");
    const redeem = Array.from(card.shadowRoot?.querySelectorAll("button") ?? []).find((button) => button.textContent?.includes("Redeem")) as HTMLButtonElement;
    expect(redeem.disabled).toBe(true);
  });

  it("locks reward ownership to the configured person", async () => {
    const { card, hass } = await renderCard();
    (card.shadowRoot?.querySelector("button.add-reward-card") as HTMLButtonElement).click();
    await card.updateComplete;
    card.shadowRoot?.querySelector("ha-form")?.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { name: "Snack", cost: 5, icon: "mdi:gift", description: "" } }, bubbles: true }));
    await card.updateComplete;
    (Array.from(card.shadowRoot?.querySelectorAll("button") ?? []).find((button) => button.textContent?.includes("Save")) as HTMLButtonElement).click();
    expect(hass.callService).toHaveBeenCalledWith("pointsbot", "manage_reward", expect.objectContaining({ person_id: "person.alice" }));
  });

  it("renders the reference horizontal tile structure and transparent card option", async () => {
    const { card } = await renderCard({ hide_card_background: true });
    expect(card.shadowRoot?.querySelector("ha-card.no-background")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".rewards-grid")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".reward-icon-section")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".reward-icon-section .reward-icon")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".reward-info")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".reward-card")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".add-reward-icon-section .add-reward-icon")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".add-reward-info .add-reward-text")).not.toBeNull();
  });

  it("renders reference modal structure and accessible disabled state", async () => {
    const { card } = await renderCard({ show_disabled_rewards: true });
    (card.shadowRoot?.querySelector("button.reward-card") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".modal-overlay")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".modal-content[role='dialog']")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".modal-header")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".modal-body")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".modal-info")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".modal-actions")).not.toBeNull();
    (card.shadowRoot?.querySelector("button.reward-card") as HTMLButtonElement).click();
    await card.updateComplete;
    (card.shadowRoot?.querySelector("button.add-reward-card") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector("ha-dialog[open]")).not.toBeNull();
    expect(card.shadowRoot?.querySelector("ha-form")).not.toBeNull();
  });

  it("sends a banked-only redemption and celebrates only after success", async () => {
    const { card, hass } = await renderCard();
    const tile = card.shadowRoot?.querySelector("button.reward-card") as HTMLButtonElement;
    tile.click();
    await card.updateComplete;
    const redeem = Array.from(card.shadowRoot?.querySelectorAll("button") ?? []).find((button) => button.textContent?.includes("Redeem")) as HTMLButtonElement;
    redeem.click();
    expect(hass.callService).toHaveBeenCalledWith("pointsbot", "redeem_reward", { person_id: "person.alice", reward_id: "reward-1" });
    await Promise.resolve();
    expect(confetti.playStarShower).toHaveBeenCalled();
  });

  it("does not call redemption for an unaffordable reward", async () => {
    const { card } = await renderCard();
    card.hass = makeHass([reward], "2");
    await card.updateComplete;
    const tile = card.shadowRoot?.querySelector("button.reward-card") as HTMLButtonElement;
    tile.click();
    await card.updateComplete;
    const redeem = Array.from(card.shadowRoot?.querySelectorAll("button") ?? []).find((button) => button.textContent?.includes("Redeem")) as HTMLButtonElement;
    expect(redeem.disabled).toBe(true);
  });

  it("shows service errors and clears pending state after a failed save", async () => {
    const { card, hass } = await renderCard();
    let rejectSave!: (error: Error) => void;
    hass.callService = vi.fn().mockReturnValue(new Promise<void>((_, reject) => { rejectSave = reject; }));
    (card.shadowRoot?.querySelector("button.add-reward-card") as HTMLButtonElement).click();
    await card.updateComplete;
    card.shadowRoot?.querySelector("ha-form")?.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { name: "Snack", cost: 5, icon: "mdi:gift", description: "" } }, bubbles: true }));
    await card.updateComplete;
    const save = Array.from(card.shadowRoot?.querySelectorAll("button") ?? []).find((button) => button.textContent?.includes("Save")) as HTMLButtonElement;
    save.click();
    await Promise.resolve();
    await card.updateComplete;
    expect(save.disabled).toBe(true);
    rejectSave(new Error("backend unavailable"));
    await Promise.resolve();
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("backend unavailable");
    expect(save.disabled).toBe(false);
  });

  it("removes modal listeners and restores focus through every close path", async () => {
    const { card } = await renderCard();
    const tile = card.shadowRoot?.querySelector("button.reward-card") as HTMLButtonElement;
    Object.defineProperty(document, "activeElement", { configurable: true, value: tile });
    const focusSpy = vi.spyOn(tile, "focus");
    tile.click();
    await card.updateComplete;
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".modal-overlay")).toBeNull();
    expect(focusSpy).toHaveBeenCalled();

    (card.shadowRoot?.querySelector("button.reward-card") as HTMLButtonElement).click();
    await card.updateComplete;
    const close = Array.from(card.shadowRoot?.querySelectorAll("button") ?? []).find((button) => button.textContent === "Close") as HTMLButtonElement;
    close.click();
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".modal-overlay")).toBeNull();
  });
});
