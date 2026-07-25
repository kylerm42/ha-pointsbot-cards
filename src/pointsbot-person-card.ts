import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { CardConfig, PointsBotEntityAttributes } from "./types.js";

// Side-effect imports so the custom elements are registered when the card loads.
import "./collapsible-section.js";
import "./adjust-points-dialog.js";
import "./add-task-dialog.js";

/**
 * Default accent color used when `CardConfig.accent_color` is unset or invalid.
 * This is a fallback only — the active accent color is propagated at runtime
 * via the `--pointsbot-accent-color` CSS custom property (see `render()`).
 */
const ACCENT_COLOR = "#B29FE8";

/**
 * Default text color drawn on top of the accent background, used when the
 * configured accent color resolves to a dark (low-luminance) tone. When the
 * accent is light, the dynamic helper flips this to dark text. See
 * `_computeContrastTextColor`.
 */
const ACCENT_TEXT_DARK = "#17151d";
const ACCENT_TEXT_LIGHT = "#ffffff";

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
    serviceData?: Record<string, unknown>,
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

    ha-card {
      background: transparent;
      box-shadow: none;
      border: none;
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 16px;
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
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      background-color: var(--pointsbot-accent-color);
    }

    .avatar-placeholder {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--pointsbot-accent-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .name {
      font-size: 24px;
      font-weight: 500;
      line-height: 1;
    }

    .person-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .person-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .points-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    .points-block {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .points-value {
      font-size: 20px;
      font-weight: bold;
      line-height: 1;
      color: var(--secondary-text-color, #9e9e9e);
    }

    .points-label {
      font-size: 12px;
      color: var(--secondary-text-color, #9e9e9e);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .weekly-points {
      color: var(--pointsbot-accent-color);
      font-size: 24px;
      font-weight: bold;
      white-space: nowrap;
    }

    .action-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-items: stretch;
    }

    /* ---------- Base tasks ---------- */

    .section-item-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .section-item-row:last-child {
      border-bottom: none;
    }

    .task-checkbox {
      width: 48px;
      height: 48px;
      margin-left: auto;
      order: 2;
      cursor: pointer;
      accent-color: var(--pointsbot-accent-color);
      flex-shrink: 0;
    }

    .section-item-title {
      flex: 1;
      font-size: 20px;
      color: var(--primary-text-color);
    }

    .section-item-subtitle {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 14px;
      color: var(--secondary-text-color, #727272);
    }

    /* ---------- Bonus tasks ---------- */

    .points-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      background: var(--pointsbot-accent-color);
      color: var(--pointsbot-accent-text-color);
    }

    .points-badge ha-icon {
      --mdc-icon-size: 14px;
      display: flex;
    }

    .bonus-row.disabled {
      opacity: 0.45;
    }

    .section-item-info {
      flex: 1;
      min-width: 0;
    }

    .bonus-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      flex-shrink: 0;
    }

    .bonus-count {
      min-width: 24px;
      text-align: center;
      font-size: 24px;
    }

    .circle-button,
    .adjustment-amount {
      width: 48px;
      height: 48px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid var(--pointsbot-accent-color);
      background: transparent;
      color: var(--pointsbot-accent-color);
      line-height: 1;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      font-family: inherit;
      transition: background 0.15s ease;
    }

    .circle-button {
      font-size: 28px;
    }

    .adjustment-amount {
      font-size: 18px;
    }

    .circle-button:hover:not(:disabled) {
      background: color-mix(
        in srgb,
        var(--pointsbot-accent-color) 15%,
        transparent
      );
    }

    .circle-button.completed {
      background: var(--pointsbot-accent-color);
      color: var(--pointsbot-accent-text-color);
    }

    .circle-button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .circle-button ha-icon {
      --mdc-icon-size: 28px;
    }

    /* ---------- Weekly adjustments ---------- */

    .adjustment-amount {
      min-width: 40px;
      width: auto;
      height: 40px;
      padding: 0 10px;
      font-weight: 600;
      margin-left: auto;
      order: 2;
      cursor: default;
      border: none;
      color: var(--pointsbot-accent-text-color);
      white-space: nowrap;
      border-radius: 24px;
    }

    .adjustment-amount.positive {
      background: var(--success-color, #4caf50);
    }

    .adjustment-amount.negative {
      background: var(--error-color, #db4437);
    }

    .adjustment-info {
      flex: 1;
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
    this.requestUpdate();
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
   * Returns the declarative schema used by HA's form-based editor and the YAML
   * config form.
   */
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: {
            entity: {
              filter: { domain: "sensor", integration: "pointsbot" },
            },
          },
        },
        {
          name: "accent_color",
          default: ACCENT_COLOR,
          helper: "Hex color code (e.g. #B29FE8) or CSS variable (e.g. var(--primary-color))",
          selector: {
            text: {},
          },
        },
      ],
    };
  }

  /**
   * Returns a minimal valid config used as a starting point when the card is
   * added from the HA "Add Card" GUI picker.
   */
  static getStubConfig(): CardConfig {
    return {
      type: "custom:pointsbot-person-card",
      entity: "",
      accent_color: ACCENT_COLOR,
    };
  }

  // -----------------------------------------------------------------
  // Accent color helpers
  // -----------------------------------------------------------------

  /**
   * Resolves the configured accent color, falling back to the default
   * `ACCENT_COLOR` if the value is missing or not a valid `#RRGGBB` string.
   * Validation prevents arbitrary CSS from being injected via the custom
   * property value.
   */
  private _resolveAccentColor(): string {
    const configured = this._config?.accent_color;
    if (configured && /^#[0-9A-Fa-f]{6}$/.test(configured)) {
      return configured;
    }
    return ACCENT_COLOR;
  }

  /**
   * Computes a high-contrast text color for use on top of the accent
   * background, using the WCAG contrast-ratio formula. Compares the
   * accent color against both dark and light text options and picks
   * whichever yields the higher contrast ratio.
   * See: https://www.w3.org/TR/WCAG20/#relativeluminancedef
   */
  private _computeContrastTextColor(hex: string): string {
    const accentLum = this._relativeLuminance(hex);
    const darkLum = this._relativeLuminance(ACCENT_TEXT_DARK);
    const lightLum = this._relativeLuminance(ACCENT_TEXT_LIGHT);

    const darkRatio =
      (Math.max(accentLum, darkLum) + 0.05) /
      (Math.min(accentLum, darkLum) + 0.05);
    const lightRatio =
      (Math.max(accentLum, lightLum) + 0.05) /
      (Math.min(accentLum, lightLum) + 0.05);

    return darkRatio >= lightRatio ? ACCENT_TEXT_DARK : ACCENT_TEXT_LIGHT;
  }

  /** WCAG relative luminance for a #RRGGBB hex color. */
  private _relativeLuminance(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const [rL, gL, bL] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );

    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
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

  private _uncompleteBonusTask(personId: string, taskId: string) {
    this._hass?.callService("pointsbot", "uncomplete_bonus_task", {
      person_id: personId,
      task_id: taskId,
    });
  }

  private _renderSectionItemInfo(title: string, subtitle?: unknown) {
    return html`
      <div class="section-item-info">
        <div class="section-item-title">${title}</div>
        ${subtitle === undefined
          ? nothing
          : html`<div class="section-item-subtitle">${subtitle}</div>`}
      </div>
    `;
  }

  private _formatAdjustmentTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleString(undefined, {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
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
    const icon = attrs.icon ?? "mdi:star-circle";
    const personId = attrs.person_id;
    const baseTasks = attrs.base_tasks ?? [];
    const bonusTasks = attrs.bonus_tasks ?? [];
    const adjustments = attrs.weekly_adjustments ?? [];
    const accentColor = this._resolveAccentColor();
    const accentTextColor = this._computeContrastTextColor(accentColor);

    return html`
      <ha-card>
        <div
          class="card"
          style="--pointsbot-accent-color: ${accentColor}; --pointsbot-accent-text-color: ${accentTextColor};"
        >
          <div class="header">
            ${picture
              ? html`<img class="avatar" src="${picture}" alt="${name}" />`
              : html`<div class="avatar-placeholder">👤</div>`}
            <div class="person-info">
              <div class="points-row">
                <span class="name person-name">${name}</span>
                <span class="weekly-points">
                  ${weeklyPoints} <ha-icon icon="${icon}"></ha-icon>
                </span>
              </div>
              <div class="points-block">
                <span class="points-value">${totalPoints}</span>
                <span class="points-label">Total</span>
              </div>
            </div>
          </div>

          <!-- Base Tasks -->
          <pointsbot-collapsible-section label="Standard" open>
            ${baseTasks.length === 0
              ? html`<p class="empty-state">No standard tasks.</p>`
              : baseTasks.map(
                  (task) => html`
                    <div class="section-item-row task-row">
                      ${this._renderSectionItemInfo(task.name)}
                      <button
                        class="circle-button ${task.done ? "completed" : ""}"
                        aria-label="${task.done
                          ? "Uncomplete"
                          : "Complete"} ${task.name}"
                        @click=${() => this._toggleBaseTask(personId, task.id)}
                      >
                        <ha-icon icon="mdi:check"></ha-icon>
                      </button>
                    </div>
                  `,
                )}
          </pointsbot-collapsible-section>

          <!-- Bonus Tasks -->
          <pointsbot-collapsible-section label="Bonus" open>
            ${bonusTasks.length === 0
              ? html`<p class="empty-state">No bonus tasks.</p>`
              : bonusTasks.map(
                  (task) => html`
                    <div
                      class="section-item-row bonus-row ${task.enabled
                        ? ""
                        : "disabled"}"
                    >
                      <div class="section-item-info">
                        <div class="section-item-title">${task.name}</div>
                        <span class="points-badge"
                          >+${task.points_value}<ha-icon
                            icon="${icon}"
                          ></ha-icon
                        ></span>
                      </div>
                      <div class="bonus-actions">
                        <button
                          class="circle-button"
                          ?disabled=${!task.enabled ||
                          task.completions_this_week === 0}
                          aria-label="Uncomplete ${task.name}"
                          @click=${() =>
                            this._uncompleteBonusTask(personId, task.id)}
                        >
                          −
                        </button>
                        <span class="bonus-count"
                          >${task.completions_this_week}</span
                        >
                        <button
                          class="circle-button"
                          ?disabled=${!task.enabled}
                          aria-label="Complete ${task.name}"
                          @click=${() =>
                            this._completeBonusTask(personId, task.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  `,
                )}
          </pointsbot-collapsible-section>

          <!-- Weekly Adjustments -->
          <pointsbot-collapsible-section label="Adjustments" open>
            ${adjustments.length === 0
              ? html`<p class="empty-state">No adjustments this week.</p>`
              : adjustments.map(
                  (adj) => html`
                    <div class="section-item-row adjustment-row">
                      ${this._renderSectionItemInfo(
                        adj.reason,
                        this._formatAdjustmentTimestamp(adj.timestamp),
                      )}
                      <span
                        class="adjustment-amount ${adj.amount >= 0
                          ? "positive"
                          : "negative"}"
                      >
                        ${adj.amount >= 0 ? "+" : ""}${adj.amount}
                      </span>
                    </div>
                  `,
                )}
          </pointsbot-collapsible-section>

          <div class="action-row">
            <pointsbot-add-task-dialog
              .hass=${hass}
              .personId=${personId}
            ></pointsbot-add-task-dialog>
            <pointsbot-adjust-points-dialog
              .hass=${hass}
              .personId=${personId}
            ></pointsbot-adjust-points-dialog>
          </div>
        </div>
      </ha-card>
    `;
  }
}
