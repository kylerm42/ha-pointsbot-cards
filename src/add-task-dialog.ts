import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface HomeAssistant {
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ) => Promise<void>;
}

type TaskType = "base" | "bonus";

/**
 * AddTaskDialog
 *
 * A button that opens a modal-style dialog for creating a new base or bonus
 * task for the configured person. Calls pointsbot.add_task with
 *   { person_id, task_type, name, [points_value] }
 *
 * Client-side validation mirrors the backend's requirements:
 *   - name must be a non-empty trimmed string
 *   - bonus tasks require a positive integer points_value of at least 1
 *   - base tasks must not include points_value
 */
@customElement("pointsbot-add-task-dialog")
export class AddTaskDialog extends LitElement {
  @property({ attribute: false }) hass: HomeAssistant | null = null;

  /** The person_id attribute from the sensor entity (e.g. "person.alice"). */
  @property({ type: String }) personId = "";

  @state() private _open = false;
  @state() private _taskType: TaskType = "base";
  @state() private _name = "";
  @state() private _pointsValue = "";
  @state() private _error = "";
  @state() private _submitting = false;

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }

    .add-button {
      border-radius: 12px;
      background: var(--card-background-color);
      border: 2px dashed transparent;
      padding: 0;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 80px;
      height: 80px;
      width: 100%;
    }

    .add-button:hover {
      border-color: var(--pointsbot-accent-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .add-button:active {
      transform: translateY(0);
      filter: brightness(0.95);
    }

    .button-icon-section {
      flex-shrink: 0;
      width: 80px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .add-button:hover .button-icon-section {
      background: color-mix(in srgb, var(--pointsbot-accent-color) 20%, var(--card-background-color));
    }

    .button-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      transition: all 0.2s ease;
    }

    .add-button:hover .button-icon {
      color: var(--pointsbot-accent-color);
    }

    .button-icon ha-icon {
      --mdc-icon-size: 36px;
    }

    .button-info {
      flex: 1;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .button-text {
      font-size: 18px;
      font-weight: 500;
      color: var(--secondary-text-color);
      transition: all 0.2s ease;
    }

    .add-button:hover .button-text {
      color: var(--pointsbot-accent-color);
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
    select {
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
    select:focus {
      border-color: var(--primary-color, #03a9f4);
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
    this._taskType = "base";
    this._name = "";
    this._pointsValue = "";
    this._error = "";
    this._submitting = false;
    this._open = true;
  }

  private _closeDialog() {
    this._open = false;
  }

  private _onTaskTypeChange(e: Event) {
    const next = (e.target as HTMLSelectElement).value as TaskType;
    // When switching to base, ensure no stale points_value can be sent in the
    // base payload. The backend rejects points_value for base tasks.
    if (next === "base") {
      this._pointsValue = "";
    }
    this._taskType = next;
    this._error = "";
  }

  private _onNameInput(e: Event) {
    this._name = (e.target as HTMLInputElement).value;
    this._error = "";
  }

  private _onPointsValueInput(e: Event) {
    this._pointsValue = (e.target as HTMLInputElement).value;
    this._error = "";
  }

  private async _submit() {
    // Client-side validation mirrors backend requirements.
    const name = this._name.trim();
    if (!name) {
      this._error = "Task name is required.";
      return;
    }

    if (this._taskType === "bonus") {
      const trimmed = this._pointsValue.trim();
      if (!trimmed) {
        this._error = "Points value is required for bonus tasks.";
        return;
      }
      const pointsNum = Number(trimmed);
      if (!Number.isInteger(pointsNum) || pointsNum < 1) {
        this._error = "Points value must be a positive integer of at least 1.";
        return;
      }
      if (!this.hass) {
        this._error = "Could not add task. Please try again.";
        return;
      }
      this._submitting = true;
      try {
        await this.hass.callService("pointsbot", "add_task", {
          person_id: this.personId,
          task_type: "bonus",
          name,
          points_value: pointsNum,
        });
        this._open = false;
      } catch {
        this._error = "Could not add task. Please try again.";
      } finally {
        this._submitting = false;
      }
      return;
    }

    // Base task — do not pass points_value.
    if (!this.hass) {
      this._error = "Could not add task. Please try again.";
      return;
    }
    this._submitting = true;
    try {
      await this.hass.callService("pointsbot", "add_task", {
        person_id: this.personId,
        task_type: "base",
        name,
      });
      this._open = false;
    } catch {
      this._error = "Could not add task. Please try again.";
    } finally {
      this._submitting = false;
    }
  }

  protected render() {
    return html`
      <button class="add-button" @click=${this._openDialog}>
        <span class="button-icon-section">
          <span class="button-icon"><ha-icon icon="mdi:plus"></ha-icon></span>
        </span>
        <span class="button-info">
          <span class="button-text">Add Task</span>
        </span>
      </button>

      ${this._open
        ? html`
            <div class="dialog-overlay" @click=${this._handleOverlayClick}>
              <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                <h3 class="dialog-title">Add Task</h3>

                <div class="field">
                  <label for="task-type">Task Type</label>
                  <select
                    id="task-type"
                    .value=${this._taskType}
                    @change=${this._onTaskTypeChange}
                  >
                    <option value="base">Base</option>
                    <option value="bonus">Bonus</option>
                  </select>
                </div>

                <div class="field">
                  <label for="task-name">Task Name</label>
                  <input
                    id="task-name"
                    type="text"
                    placeholder="e.g. Make bed"
                    .value=${this._name}
                    @input=${this._onNameInput}
                  />
                </div>

                ${this._taskType === "bonus"
                  ? html`
                      <div class="field">
                        <label for="points-value">Points Value</label>
                        <input
                          id="points-value"
                          type="number"
                          step="1"
                          min="1"
                          placeholder="e.g. 10"
                          .value=${this._pointsValue}
                          @input=${this._onPointsValueInput}
                        />
                      </div>
                    `
                  : nothing}

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
