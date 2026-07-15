import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { CardConfig, PointsBotEntityAttributes } from "./types.js";

/**
 * Minimal HomeAssistant interface — only the surface area consumed by this
 * card. The full HA frontend type definitions are not imported as a package
 * dependency to keep the bundle lean.
 */
interface HomeAssistant {
  states: Record<
    string,
    {
      state: string;
      attributes: Record<string, unknown>;
    }
  >;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ) => Promise<void>;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

// Register card in the HA "Add Card" picker.
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "pointsbot-person-card",
  name: "PointsBot Person Card",
  description:
    "Displays a family member's points, tasks, and weekly adjustments.",
  preview: false,
});

@customElement("pointsbot-person-card")
export class PointsBotPersonCard extends LitElement {
  @state() private _config: CardConfig | null = null;
  @state() private _hass: HomeAssistant | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .card {
      padding: 16px;
    }

    .error {
      padding: 16px;
      color: var(--error-color, #db4437);
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      background-color: var(--secondary-background-color, #e0e0e0);
    }

    .avatar-placeholder {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--secondary-background-color, #e0e0e0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .name {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .points-row {
      display: flex;
      gap: 24px;
    }

    .points-block {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .points-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }

    .points-label {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #727272);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `;

  // -----------------------------------------------------------------
  // Lovelace card API
  // -----------------------------------------------------------------

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  setConfig(config: Partial<CardConfig>): void {
    if (!config.entity) {
      throw new Error("PointsBot card: 'entity' is required in card config.");
    }
    this._config = config as CardConfig;
  }

  getCardSize(): number {
    return 3;
  }

  // -----------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------

  protected render() {
    if (!this._config) {
      return nothing;
    }

    const hass = this._hass;
    if (!hass) {
      return nothing;
    }

    const entityId = this._config.entity;
    const stateObj = hass.states[entityId];

    if (!stateObj) {
      return html`
        <ha-card>
          <div class="error">
            Entity <strong>${entityId}</strong> not found. Check your card
            configuration.
          </div>
        </ha-card>
      `;
    }

    if (stateObj.state === "unavailable" || stateObj.state === "unknown") {
      return html`
        <ha-card>
          <div class="error">
            Entity <strong>${entityId}</strong> is ${stateObj.state}.
          </div>
        </ha-card>
      `;
    }

    const attrs = stateObj.attributes as unknown as PointsBotEntityAttributes;
    const totalPoints = parseFloat(stateObj.state) || 0;
    const weeklyPoints = attrs.weekly_points ?? 0;
    const name = attrs.name ?? entityId;
    const picture = attrs.picture ?? null;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            ${picture
              ? html`<img class="avatar" src="${picture}" alt="${name}" />`
              : html`<div class="avatar-placeholder">👤</div>`}
            <span class="name">${name}</span>
          </div>

          <div class="points-row">
            <div class="points-block">
              <span class="points-value">${totalPoints}</span>
              <span class="points-label">Total Points</span>
            </div>
            <div class="points-block">
              <span class="points-value">${weeklyPoints}</span>
              <span class="points-label">This Week</span>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}
