import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CardConfig } from "./types.js";

/**
 * Visual config editor for pointsbot-person-card.
 *
 * Returned by PointsBotPersonCard.getConfigElement(). Rendered inside the HA
 * card editor panel. When the user selects an entity, this element fires a
 * `config-changed` CustomEvent with the updated CardConfig in `detail.config`.
 *
 * The `ha-entity-picker` element is an HA-native web component available at
 * runtime when the card is loaded inside Home Assistant. It is not importable
 * as a package dependency — the element is accessed by tag name.
 */
@customElement("pointsbot-person-card-editor")
export class PointsBotPersonCardEditor extends LitElement {
  @property({ attribute: false }) hass?: unknown;
  @state() private _config: CardConfig | null = null;

  static styles = css`
    .editor-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    ha-entity-picker {
      width: 100%;
    }
  `;

  /**
   * Called by HA with the current card configuration whenever the editor
   * panel opens or the config is changed externally.
   */
  setConfig(config: CardConfig): void {
    this._config = config;
  }

  /**
   * Fired when the entity picker selection changes. Dispatches a
   * `config-changed` event so HA can save the new configuration immediately.
   */
  private _entityChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const newEntityId: string = ev.detail?.value ?? "";
    const newConfig: CardConfig = {
      ...(this._config ?? { type: "custom:pointsbot-person-card", entity: "" }),
      entity: newEntityId,
    };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected render() {
    return html`
      <div class="editor-row">
        <label>Entity (sensor.pointsbot_*)</label>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config?.entity ?? ""}
          .includeDomains=${["sensor"]}
          allow-custom-entity
          @value-changed=${this._entityChanged}
        ></ha-entity-picker>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pointsbot-person-card-editor": PointsBotPersonCardEditor;
  }
}
