import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

/**
 * PointsBotCollapsibleSection
 *
 * Reusable internal element for the three collapsible lists in the person card
 * (base tasks, bonus tasks, weekly adjustments).
 *
 * Visual style is modelled on ha-chorebot-cards' grouped-card collapsible
 * sections: grid-template-rows 0fr/1fr transition for smooth height animation,
 * opacity fade, and header hover state. The reference repo
 * (git@github.com:kylerm42/ha-chorebot-cards.git) was confirmed accessible and
 * cloned on 2026-07-16; the pattern in grouped-card.ts (.tag-group-tasks /
 * .collapsed using grid-template-rows + opacity transitions) matches this
 * implementation directly.
 *
 * Note: grouped-card.ts uses ha-icon (mdi:) for header controls rather than a
 * dedicated chevron; this component uses an inline SVG chevron instead to avoid
 * a runtime dependency on ha-icon at this level, while preserving the same
 * transition and open/closed semantics.
 */
@customElement("pointsbot-collapsible-section")
export class PointsBotCollapsibleSection extends LitElement {
  /** Visible label in the section header (e.g. "Base Tasks"). */
  @property({ type: String }) label = "";

  /** Item count shown in the header summary (e.g. 3 → "Base Tasks (3)"). */
  @property({ type: Number }) count = 0;

  /** Whether the section starts open. Defaults to false (collapsed). */
  @property({ type: Boolean }) open = false;

  @state() private _open = false;

  static styles = css`
    :host {
      display: block;
    }

    .section-container {
      border-radius: var(--ha-card-border-radius, 8px);
      overflow: hidden;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-bottom: 8px;
      transition: border-radius 0.3s ease;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      user-select: none;
      background-color: var(--secondary-background-color, #f5f5f5);
      transition: filter 0.2s ease;
    }

    .section-header:hover {
      filter: brightness(0.95);
    }

    .section-header:active {
      filter: brightness(0.88);
    }

    .section-header-label {
      flex: 1;
      color: var(--primary-text-color);
    }

    .section-header-chevron {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      color: var(--secondary-text-color, #727272);
    }

    .section-header-chevron.open {
      transform: rotate(180deg);
    }

    /* SVG chevron drawn inline to avoid depending on ha-icon at this level */
    .chevron-svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .section-content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 0.3s ease,
        opacity 0.3s ease;
    }

    .section-content.open {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .section-content-inner {
      overflow: hidden;
      padding: 0 14px;
    }

    .section-content.open .section-content-inner {
      padding: 10px 14px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._open = this.open;
  }

  private _toggle() {
    this._open = !this._open;
  }

  protected render() {
    const labelText =
      this.count > 0 ? `${this.label} (${this.count})` : this.label;

    return html`
      <div class="section-container">
        <div class="section-header" @click=${this._toggle}>
          <span class="section-header-label">${labelText}</span>
          <span class="section-header-chevron ${this._open ? "open" : ""}">
            <svg class="chevron-svg" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
        <div class="section-content ${this._open ? "open" : ""}">
          <div class="section-content-inner">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
