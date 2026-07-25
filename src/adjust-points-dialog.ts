import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { playStarShower } from "./utils/confetti-utils.js";

interface HomeAssistant {
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ) => Promise<void>;
}

/**
 * AdjustPointsDialog
 *
 * A button that opens a modal-style dialog for submitting a manual point
 * adjustment. Calls pointsbot.adjust_points with { person_id, amount, reason }.
 * Client-side validation mirrors the backend's requirements:
 *   - amount must be a non-zero integer
 *   - reason must be a non-empty string
 */
@customElement("pointsbot-adjust-points-dialog")
export class AdjustPointsDialog extends LitElement {
  @property({ attribute: false }) hass: HomeAssistant | null = null;

  /** The person_id attribute from the sensor entity (e.g. "person.alice"). */
  @property({ type: String }) personId = "";

  @property({ type: Array }) confettiColors: string[] = [];

  @state() private _open = false;
  @state() private _amount = "";
  @state() private _reason = "";
  @state() private _error = "";
  @state() private _submitting = false;

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }

    .open-button {
      cursor: pointer;
      border-radius: var(--ha-card-border-radius, 8px);
      border: none;
      background: var(--pointsbot-accent-color);
      color: var(--pointsbot-accent-text-color);
      font-size: 18px;
      font-weight: 500;
      padding: 16px 32px;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    }

    .open-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 24px;
      min-width: 320px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .dialog-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 20px;
      color: var(--primary-text-color);
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--secondary-text-color, #727272);
    }

    input,
    textarea {
      padding: 8px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      font-size: 0.95rem;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, #f5f5f5);
      outline: none;
      transition: border-color 0.2s ease;
    }

    input:focus,
    textarea:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    textarea {
      resize: vertical;
      min-height: 60px;
      font-family: inherit;
    }

    .error-message {
      color: var(--error-color, #db4437);
      font-size: 0.85rem;
      margin-bottom: 12px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .cancel-button {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: transparent;
      color: var(--secondary-text-color, #727272);
      cursor: pointer;
      font-size: 0.9rem;
    }

    .submit-button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      background: var(--primary-color, #03a9f4);
      color: #fff;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: opacity 0.2s ease;
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  private _openDialog() {
    this._amount = "";
    this._reason = "";
    this._error = "";
    this._submitting = false;
    this._open = true;
  }

  private _closeDialog() {
    this._open = false;
  }

  private _onAmountInput(e: Event) {
    this._amount = (e.target as HTMLInputElement).value;
    this._error = "";
  }

  private _onReasonInput(e: Event) {
    this._reason = (e.target as HTMLTextAreaElement).value;
    this._error = "";
  }

  private async _submit() {
    // Client-side validation mirrors backend requirements.
    const amountNum = parseInt(this._amount, 10);
    if (!this._amount || isNaN(amountNum) || amountNum === 0) {
      this._error = "Amount must be a non-zero integer.";
      return;
    }
    const reason = this._reason.trim();
    if (!reason) {
      this._error = "Reason is required.";
      return;
    }

    if (!this.hass) {
      this._error = "Home Assistant is not available.";
      return;
    }

    this._submitting = true;
    try {
      await this.hass.callService("pointsbot", "adjust_points", {
        person_id: this.personId,
        amount: amountNum,
        reason,
      });
      if (amountNum > 0 && this.confettiColors.length > 0) {
        playStarShower(this.confettiColors, 2500);
      }
      this._open = false;
    } catch {
      this._error = "Service call failed. Please try again.";
    } finally {
      this._submitting = false;
    }
  }

  protected render() {
    return html`
      <button class="open-button" @click=${this._openDialog}>
        Adjust Points
      </button>

      ${this._open
        ? html`
            <div class="dialog-overlay" @click=${this._handleOverlayClick}>
              <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                <h3 class="dialog-title">Adjust Points</h3>

                <div class="field">
                  <label for="amount">Amount (non-zero integer)</label>
                  <input
                    id="amount"
                    type="number"
                    step="1"
                    placeholder="e.g. -5 or 10"
                    .value=${this._amount}
                    @input=${this._onAmountInput}
                  />
                </div>

                <div class="field">
                  <label for="reason">Reason</label>
                  <textarea
                    id="reason"
                    placeholder="e.g. Left dishes out"
                    .value=${this._reason}
                    @input=${this._onReasonInput}
                  ></textarea>
                </div>

                ${this._error
                  ? html`<p class="error-message">${this._error}</p>`
                  : nothing}

                <div class="dialog-actions">
                  <button class="cancel-button" @click=${this._closeDialog}>
                    Cancel
                  </button>
                  <button
                    class="submit-button"
                    ?disabled=${this._submitting}
                    @click=${this._submit}
                  >
                    ${this._submitting ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          `
        : nothing}
    `;
  }

  private _handleOverlayClick() {
    this._closeDialog();
  }
}
