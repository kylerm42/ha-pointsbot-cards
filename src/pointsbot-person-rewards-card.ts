import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { Reward, RewardsCardConfig, PointsBotEntityAttributes } from "./types.js";
import { extractColorVariants } from "./utils/color-utils.js";
import { playStarShower } from "./utils/confetti-utils.js";

interface Hass { states: Record<string, { state: string; attributes: Record<string, unknown> }>; callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>; }
const ACCENT = "#B29FE8";
const ACCENT_TEXT_DARK = "#17151d";
const ACCENT_TEXT_LIGHT = "#ffffff";
const MDI_ICON = /^mdi:[a-z0-9][a-z0-9-]*$/;

declare global { interface Window { customCards?: Array<{ type: string; name: string; description: string; preview?: boolean }> } }
window.customCards = window.customCards ?? [];
window.customCards.push({ type: "pointsbot-person-rewards-card", name: "PointsBot Person Rewards Card", description: "Browse and redeem PointsBot rewards.", preview: false });

@customElement("pointsbot-person-rewards-card")
export class PointsBotPersonRewardsCard extends LitElement {
  @state() private _config: Partial<RewardsCardConfig> = { type: "custom:pointsbot-person-rewards-card" };
  @state() private _hass: Hass | null = null;
  @state() private _detail: Reward | null = null;
  @state() private _editing: Reward | null = null;
  @state() private _formOpen = false;
  @state() private _confirmDelete: Reward | null = null;
  @state() private _form = { name: "", cost: 0, icon: "mdi:gift", description: "" };
  @state() private _error = "";
  @state() private _pending = false;
  private _restoreFocus: HTMLElement | null = null;
  private _modalKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); this._closeActiveModal(); return; }
    if (event.key !== "Tab") return;
    const modal = this.shadowRoot?.querySelector<HTMLElement>(".modal-content");
    if (!modal) return;
    const focusable = [...modal.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((element) => !element.hasAttribute("disabled"));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  private readonly _formSchema = [
    { name: "name", required: true, selector: { text: {} } },
    { name: "cost", required: true, selector: { number: { min: 1, mode: "box" } } },
    { name: "icon", required: true, selector: { icon: {} } },
    { name: "description", selector: { text: { multiline: true } } },
  ];

  static styles = css`
    :host { display:block; --mdc-dialog-content-ink-color:var(--primary-text-color); --mdc-dialog-heading-ink-color:var(--primary-text-color) }
    ha-card { padding:16px; border:none; background:var(--card-background-color) } ha-card.no-background { padding:0; background:transparent; box-shadow:none }
    .card { color:var(--primary-text-color) } .rewards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:16px }
    .reward-card, .add-reward-card { min-height:80px; height:80px; border:1px solid var(--divider-color); border-radius:12px; padding:0; background:var(--card-background-color); cursor:pointer; text-align:left; display:flex; flex-direction:row; overflow:hidden; transition:all .2s ease }
    .reward-card:hover, .add-reward-card:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.15) } .reward-card.disabled { opacity:.6 }
    .reward-icon-section, .add-reward-icon-section { flex-shrink:0; width:80px; display:flex; align-items:center; justify-content:center; background:var(--pointsbot-accent-color); color:var(--pointsbot-accent-text-color) } .reward-icon, .add-reward-icon { display:flex; align-items:center; justify-content:center } .reward-icon-section ha-icon, .add-reward-icon-section ha-icon { --mdc-icon-size:36px }
    .reward-info { flex:1; min-width:0; padding:12px 16px; display:flex; flex-direction:column; justify-content:center; gap:6px } .reward-header { display:flex; align-items:center; justify-content:space-between; gap:12px; line-height:1 } .reward-name { font-size:18px; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; min-width:0 } .reward-cost { color:var(--pointsbot-accent-color); font-size:20px; font-weight:bold; white-space:nowrap } .reward-description { font-size:13px; color:var(--secondary-text-color); overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-height:1.3 }
    .add-reward-card { border:2px dashed var(--divider-color); color:var(--secondary-text-color) } .add-reward-icon-section { background:color-mix(in srgb,var(--divider-color) 50%,transparent); color:var(--secondary-text-color) } .add-reward-info { flex:1; display:flex; align-items:center; padding:12px 16px; font-size:18px } .add-reward-text { font-size:18px; font-weight:500 }
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000 } .modal-content { background:var(--card-background-color); border-radius:12px; padding:24px; width:min(400px,90vw); max-height:90vh; overflow-y:auto; box-shadow:0 8px 32px rgba(0,0,0,.3) } .modal-header { font-size:20px; font-weight:500; margin-bottom:16px } .modal-body { margin-bottom:24px } .modal-info { display:grid; gap:12px; padding:16px; background:var(--secondary-background-color); border-radius:8px } .modal-info-row { display:flex; justify-content:space-between; gap:16px } .modal-info-label { color:var(--secondary-text-color); font-size:14px } .modal-info-value { color:var(--primary-text-color); font-size:14px; font-weight:500 } .modal-actions { display:flex; justify-content:flex-end; gap:12px; flex-wrap:wrap } .modal-button { border:0; border-radius:8px; padding:10px 20px; cursor:pointer; font:inherit } .modal-button.confirm { background:var(--pointsbot-accent-color); color:var(--pointsbot-accent-text-color) } .modal-button:disabled { opacity:.5; cursor:not-allowed } .error { color:var(--error-color) }
    ha-dialog { --mdc-dialog-min-width:min(500px,90vw) } ha-form { display:block }
  `;

  set hass(value: Hass) { this._hass = value; this.requestUpdate(); }
  setConfig(config: Partial<RewardsCardConfig>): void { if (!config.person || !config.person.startsWith("person.")) throw new Error("The PointsBot rewards card requires a person entity."); this._config = { type: "custom:pointsbot-person-rewards-card", ...config } as RewardsCardConfig; }
  getCardSize(): number { return 4; }
  static getConfigForm() { return { schema: [{ name:"person", required:true, selector:{entity:{filter:{domain:"person"}}} }, { name:"hide_card_background", default:false, selector:{boolean:{}} }, { name:"show_disabled_rewards", default:false, selector:{boolean:{}} }, { name:"sort_by", default:"cost", selector:{select:{options:["cost","name","created"]}} }, { name:"show_add_reward_button", default:true, selector:{boolean:{}} }, { name:"accent_color", default:ACCENT, selector:{text:{}} }] }; }
  static getStubConfig(): RewardsCardConfig { return { type:"custom:pointsbot-person-rewards-card", person:"person.example", hide_card_background:false, show_disabled_rewards:false, sort_by:"cost", show_add_reward_button:true, accent_color:ACCENT }; }
  private _profile() { return Object.entries(this._hass?.states ?? {}).map(([id, state]) => ({ id, attrs: state.attributes as unknown as PointsBotEntityAttributes, state: state.state })).find((p) => p.id.startsWith("sensor.pointsbot_") && p.attrs.person_id === this._config.person && !["unavailable","unknown"].includes(p.state) && Array.isArray(p.attrs.rewards)); }
  private _owned(r: Reward) { return r.person_id === this._config.person; }
  private _rewards() { const rewards = (this._profile()?.attrs.rewards ?? []).filter((r) => this._owned(r) && (this._config.show_disabled_rewards || r.enabled)); return [...rewards].sort((a,b) => this._config.sort_by === "name" ? a.name.localeCompare(b.name) : this._config.sort_by === "created" ? (Date.parse(a.created)||0)-(Date.parse(b.created)||0) : a.cost-b.cost); }
  private _contrast(hex: string) { const lum=(v:string)=>{const rgb=[1,3,5].map(i=>parseInt(v.slice(i,i+2),16)/255).map(c=>c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4));return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}; const a=lum(hex),d=lum(ACCENT_TEXT_DARK),l=lum(ACCENT_TEXT_LIGHT); return (Math.max(a,d)+.05)/(Math.min(a,d)+.05)>=(Math.max(a,l)+.05)/(Math.min(a,l)+.05)?ACCENT_TEXT_DARK:ACCENT_TEXT_LIGHT; }
   private _openModal = () => { this._restoreFocus = document.activeElement as HTMLElement; window.addEventListener("keydown", this._modalKeydown); };
   private _closeActiveModal = (restoreFocus = true) => { this._detail=null; this._confirmDelete=null; this._closeForm(); window.removeEventListener("keydown", this._modalKeydown); const focus=this._restoreFocus; this._restoreFocus=null; if (restoreFocus) focus?.focus(); };
   private _openDetail = (r: Reward) => { this._detail=r; this._openModal(); };
  private _openAdd = () => { this._editing=null; this._form={name:"",cost:0,icon:"mdi:gift",description:""}; this._error=""; this._formOpen=true; this._openModal(); };
   private _openEdit = (r: Reward) => { if (!this._owned(r)) return; this._closeActiveModal(false); this._editing=r; this._form={name:r.name,cost:r.cost,icon:r.icon,description:r.description??""}; this._error=""; this._formOpen=true; this._openModal(); };
   private _closeForm = () => { this._formOpen=false; this._editing=null; this._error=""; };
   private async _save() { const f=this._form, name=f.name.trim(), icon=f.icon.trim(); if(!name || !Number.isInteger(f.cost) || f.cost<=0 || !MDI_ICON.test(icon)){this._error="Name, positive whole-number cost, and an mdi:name icon are required.";return} this._pending=true; try { await this._hass!.callService("pointsbot","manage_reward",{...(this._editing?{reward_id:this._editing.id}:{}),name,cost:f.cost,icon,description:f.description.trim(),person_id:this._config.person}); this._closeActiveModal(); } catch(e) { this._error=e instanceof Error?e.message:"Unable to save reward."; } finally { this._pending=false; } }
   private async _redeem(r: Reward) { const balance=Number(this._profile()?.state??0); if(!this._owned(r)||!r.enabled||r.cost>balance)return; this._pending=true; try { await this._hass!.callService("pointsbot","redeem_reward",{person_id:this._config.person,reward_id:r.id}); this._closeActiveModal(); playStarShower(extractColorVariants(this._config.accent_color??ACCENT)); } catch(e) { this._error=e instanceof Error?e.message:"Unable to redeem reward."; } finally { this._pending=false; } }
   private async _delete(r: Reward) { if(!this._owned(r))return; this._pending=true; try { await this._hass!.callService("pointsbot","delete_reward",{reward_id:r.id}); this._closeActiveModal(); } catch(e) { this._error=e instanceof Error?e.message:"Unable to delete reward."; } finally { this._pending=false; } }
   protected render() { if(!this._hass)return nothing; if(!this._config.person)return html`<ha-card><div class="error">Configure a person entity for this card.</div></ha-card>`; const p=this._profile(), accent=this._config.accent_color&&/^#[0-9a-f]{6}$/i.test(this._config.accent_color)?this._config.accent_color:ACCENT; if(!p)return html`<ha-card><div class="error">No PointsBot profile is available for ${this._config.person}.</div></ha-card>`; const rewards=this._rewards(), balance=Number(p.state); return html`<ha-card class=${this._config.hide_card_background?"no-background":""}><div class="card" style="--pointsbot-accent-color:${accent};--pointsbot-accent-text-color:${this._contrast(accent)}"><div class="rewards-grid">${rewards.map(r=>html`<button class="reward-card ${r.enabled&&r.cost<=balance?"":"disabled"}" aria-label=${r.name} @click=${()=>this._openDetail(r)}><div class="reward-icon-section"><div class="reward-icon"><ha-icon icon=${r.icon}></ha-icon></div></div><div class="reward-info"><div class="reward-header"><span class="reward-name">${r.name}</span><span class="reward-cost">${r.cost} <ha-icon icon="mdi:star-circle"></ha-icon></span></div>${r.description?html`<div class="reward-description">${r.description}</div>`:nothing}</div></button>`)}${this._config.show_add_reward_button!==false?html`<button class="add-reward-card" aria-label="Add Reward" @click=${this._openAdd}><div class="add-reward-icon-section"><div class="add-reward-icon"><ha-icon icon="mdi:plus"></ha-icon></div></div><div class="add-reward-info"><span class="add-reward-text">Add Reward</span></div></button>`:nothing}</div>${!rewards.length?html`<p>No rewards available for this person.</p>`:nothing}${this._error?html`<div class="error" role="alert">${this._error}</div>`:nothing}</div></ha-card>${this._detail?this._detailModal(this._detail,balance):nothing}${this._formOpen?this._formModal():nothing}${this._confirmDelete?this._deleteModal(this._confirmDelete):nothing}`; }
   private _detailModal(r:Reward,balance:number) { const affordable=r.enabled&&r.cost<=balance; return html`<div class="modal-overlay" role="presentation" @click=${this._closeActiveModal}><section class="modal-content" role="dialog" aria-modal="true" aria-labelledby="reward-dialog-title" @click=${(e:Event)=>e.stopPropagation()}><div class="modal-header" id="reward-dialog-title">${r.name}</div><div class="modal-body"><p>${r.description||"No description."}</p><div class="modal-info"><div class="modal-info-row"><span>Banked balance</span><b>${balance}</b></div><div class="modal-info-row"><span>Cost</span><b>${r.cost}</b></div><div class="modal-info-row"><span>Remaining balance</span><b>${balance-r.cost}</b></div></div>${!r.enabled?html`<p class="error" role="status">Disabled reward.</p>`:!affordable?html`<p class="error" role="status">Insufficient banked points.</p>`:nothing}</div><div class="modal-actions"><button class="modal-button" @click=${this._closeActiveModal}>Close</button><button class="modal-button" @click=${()=>this._openEdit(r)}>Edit</button><button class="modal-button" @click=${()=>{this._confirmDelete=r;}}>Delete</button><button class="modal-button confirm" ?disabled=${!affordable||this._pending} @click=${()=>this._redeem(r)}>Redeem</button></div></section></div>`; }
   private _formModal() { return html`<ha-dialog open heading=${this._editing?"Edit Reward":"Add Reward"} @closed=${this._closeActiveModal}><ha-form .hass=${this._hass} .schema=${this._formSchema} .data=${this._form} @value-changed=${(e:CustomEvent)=>this._form={...this._form,...e.detail.value}}></ha-form>${this._error?html`<div class="error" role="alert">${this._error}</div>`:nothing}<button slot="secondaryAction" @click=${this._closeActiveModal}>Cancel</button><button slot="primaryAction" ?disabled=${this._pending} @click=${()=>this._save()}>Save</button></ha-dialog>`; }
   private _deleteModal(r:Reward) { return html`<div class="modal-overlay" role="presentation" @click=${this._closeActiveModal}><section class="modal-content" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" @click=${(e:Event)=>e.stopPropagation()}><div class="modal-header" id="delete-dialog-title">Delete ${r.name}?</div><div class="modal-body">This action cannot be undone.</div><div class="modal-actions"><button class="modal-button" @click=${this._closeActiveModal}>Cancel</button><button class="modal-button confirm" ?disabled=${this._pending} @click=${()=>this._delete(r)}>Delete</button></div></section></div>`; }
}
