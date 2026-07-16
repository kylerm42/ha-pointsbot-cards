import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { CardConfig, PointsBotEntityAttributes } from "./types.js";

// Side-effect imports so the custom elements are registered when the card loads.
import "./collapsible-section.js";
import "./adjust-points-dialog.js";
import "./pointsbot-person-card-editor.js";

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
      margin-bottom: 16px;
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

    .adjust-row {
      margin-bottom: 16px;
    }

    /* ---------- Base tasks ---------- */

    .task-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .task-row:last-child {
      border-bottom: none;
    }

    .task-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-color, #03a9f4);
      flex-shrink: 0;
    }

    .task-name {
      flex: 1;
      font-size: 0.9rem;
      color: var(--primary-text-color);
    }

    /* ---------- Bonus tasks ---------- */

    .bonus-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .bonus-row:last-child {
      border-bottom: none;
    }

    .bonus-row.disabled {
      opacity: 0.45;
    }

    .bonus-info {
      flex: 1;
    }

    .bonus-name {
      font-size: 0.9rem;
      color: var(--primary-text-color);
    }

    .bonus-meta {
      font-size: 0.78rem;
      color: var(--secondary-text-color, #727272);
    }

    .complete-button {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--primary-color, #03a9f4);
      background: transparent;
      color: var(--primary-color, #03a9f4);
      font-size: 0.8rem;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s ease;
    }

    .complete-button:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
    }

    /* ---------- Weekly adjustments ---------- */

    .adjustment-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .adjustment-row:last-child {
      border-bottom: none;
    }

    .adjustment-amount {
      font-weight: 600;
      font-size: 0.9rem;
      flex-shrink: 0;
      min-width: 40px;
    }

    .adjustment-amount.positive {
      color: var(--success-color, #4caf50);
    }

    .adjustment-amount.negative {
      color: var(--error-color, #db4437);
    }

    .adjustment-info {
      flex: 1;
    }

    .adjustment-reason {
      font-size: 0.9rem;
      color: var(--primary-text-color);
    }

    .adjustment-timestamp {
      font-size: 0.78rem;
      color: var(--secondary-text-color, #727272);
    }

    /* ---------- Empty state ---------- */

    .empty-state {
      padding: 10px 0;
      font-size: 0.85rem;
      color: var(--secondary-text-color, #727272);
      font-style: italic;
      text-align: center;
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

  /**
   * Returns the visual config editor element for the HA card editor panel.
   * HA calls this method when the user opens the card's visual editor.
   */
  static getConfigElement(): HTMLElement {
    return document.createElement("pointsbot-person-card-editor");
  }

  /**
   * Returns a minimal valid config used as a starting point when the card is
   * added from the HA "Add Card" GUI picker.
   */
  static getStubConfig(): CardConfig {
    return {
      type: "custom:pointsbot-person-card",
      entity: "",
    };
  }

  // -----------------------------------------------------------------
  // Service call helpers
  // -----------------------------------------------------------------

  private _toggleBaseTask(personId: string, taskId: string) {
    this._hass?.callService("pointsbot", "toggle_base_task", {
      person_id: personId,
      task_id: taskId,
    });
  }

  private _completeBonusTask(personId: string, taskId: string) {
    this._hass?.callService("pointsbot", "complete_bonus_task", {
      person_id: personId,
      task_id: taskId,
    });
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
    const personId = attrs.person_id;
    const baseTasks = attrs.base_tasks ?? [];
    const bonusTasks = attrs.bonus_tasks ?? [];
    const adjustments = attrs.weekly_adjustments ?? [];

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

          <div class="adjust-row">
            <pointsbot-adjust-points-dialog
              .hass=${hass}
              personId=${personId}
            ></pointsbot-adjust-points-dialog>
          </div>

          <!-- Base Tasks -->
          <pointsbot-collapsible-section
            label="Base Tasks"
            count=${baseTasks.length}
          >
            ${baseTasks.length === 0
              ? html`<p class="empty-state">No base tasks.</p>`
              : baseTasks.map(
                  (task) => html`
                    <div class="task-row">
                      <input
                        class="task-checkbox"
                        type="checkbox"
                        .checked=${task.done}
                        @change=${() =>
                          this._toggleBaseTask(personId, task.id)}
                      />
                      <span class="task-name">${task.name}</span>
                    </div>
                  `
                )}
          </pointsbot-collapsible-section>

          <!-- Bonus Tasks -->
          <pointsbot-collapsible-section
            label="Bonus Tasks"
            count=${bonusTasks.length}
          >
            ${bonusTasks.length === 0
              ? html`<p class="empty-state">No bonus tasks.</p>`
              : bonusTasks.map(
                  (task) => html`
                    <div class="bonus-row ${task.enabled ? "" : "disabled"}">
                      <div class="bonus-info">
                        <div class="bonus-name">${task.name}</div>
                        <div class="bonus-meta">
                          ${task.points_value} pts ·
                          ${task.completions_this_week}× this week
                          ${task.enabled ? "" : " · disabled"}
                        </div>
                      </div>
                      ${task.enabled
                        ? html`
                            <button
                              class="complete-button"
                              @click=${() =>
                                this._completeBonusTask(personId, task.id)}
                            >
                              Complete
                            </button>
                          `
                        : nothing}
                    </div>
                  `
                )}
          </pointsbot-collapsible-section>

          <!-- Weekly Adjustments -->
          <pointsbot-collapsible-section
            label="Adjustments"
            count=${adjustments.length}
          >
            ${adjustments.length === 0
              ? html`<p class="empty-state">No adjustments this week.</p>`
              : adjustments.map(
                  (adj) => html`
                    <div class="adjustment-row">
                      <span
                        class="adjustment-amount ${adj.amount >= 0
                          ? "positive"
                          : "negative"}"
                      >
                        ${adj.amount >= 0 ? "+" : ""}${adj.amount}
                      </span>
                      <div class="adjustment-info">
                        <div class="adjustment-reason">${adj.reason}</div>
                        <div class="adjustment-timestamp">
                          ${new Date(adj.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  `
                )}
          </pointsbot-collapsible-section>
        </div>
      </ha-card>
    `;
  }
}
