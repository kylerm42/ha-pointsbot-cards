/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const LIGHTNESS_ADJUSTMENTS = [0.3, 0.15, 0, -0.15, -0.3];
function toHex(value) {
    return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
}
function adjustChannel(channel, amount) {
    return amount >= 0
        ? channel + (255 - channel) * amount
        : channel * (1 + amount);
}
/**
 * Returns five shades of a #RRGGBB color, ordered from lightest to darkest.
 */
function extractColorVariants(baseHex) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(baseHex)) {
        throw new Error("baseHex must be a #RRGGBB color.");
    }
    const channels = [
        parseInt(baseHex.slice(1, 3), 16),
        parseInt(baseHex.slice(3, 5), 16),
        parseInt(baseHex.slice(5, 7), 16),
    ];
    return LIGHTNESS_ADJUSTMENTS.map((amount) => `#${channels.map((channel) => toHex(adjustChannel(channel, amount))).join("")}`);
}

// canvas-confetti v1.9.4 built on 2025-10-25T05:14:56.640Z
var module$1 = {};

// source content
/* globals Map */

(function main(global, module, isWorker, workerSize) {
  var canUseWorker = !!(
    global.Worker &&
    global.Blob &&
    global.Promise &&
    global.OffscreenCanvas &&
    global.OffscreenCanvasRenderingContext2D &&
    global.HTMLCanvasElement &&
    global.HTMLCanvasElement.prototype.transferControlToOffscreen &&
    global.URL &&
    global.URL.createObjectURL);

  var canUsePaths = typeof Path2D === 'function' && typeof DOMMatrix === 'function';
  var canDrawBitmap = (function () {
    // this mostly supports ssr
    if (!global.OffscreenCanvas) {
      return false;
    }

    try {
      var canvas = new OffscreenCanvas(1, 1);
      var ctx = canvas.getContext('2d');
      ctx.fillRect(0, 0, 1, 1);
      var bitmap = canvas.transferToImageBitmap();
      ctx.createPattern(bitmap, 'no-repeat');
    } catch (e) {
      return false;
    }

    return true;
  })();

  function noop() {}

  // create a promise if it exists, otherwise, just
  // call the function directly
  function promise(func) {
    var ModulePromise = module.exports.Promise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;

    if (typeof Prom === 'function') {
      return new Prom(func);
    }

    func(noop, noop);

    return null;
  }

  var bitmapMapper = (function (skipTransform, map) {
    // see https://github.com/catdad/canvas-confetti/issues/209
    // creating canvases is actually pretty expensive, so we should create a
    // 1:1 map for bitmap:canvas, so that we can animate the confetti in
    // a performant manner, but also not store them forever so that we don't
    // have a memory leak
    return {
      transform: function(bitmap) {
        if (skipTransform) {
          return bitmap;
        }

        if (map.has(bitmap)) {
          return map.get(bitmap);
        }

        var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);

        map.set(bitmap, canvas);

        return canvas;
      },
      clear: function () {
        map.clear();
      }
    };
  })(canDrawBitmap, new Map());

  var raf = (function () {
    var TIME = Math.floor(1000 / 60);
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;

    if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
      frame = function (cb) {
        var id = Math.random();

        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
            lastFrameTime = time;
            delete frames[id];

            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });

        return id;
      };
      cancel = function (id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function (cb) {
        return setTimeout(cb, TIME);
      };
      cancel = function (timer) {
        return clearTimeout(timer);
      };
    }

    return { frame: frame, cancel: cancel };
  }());

  var getWorker = (function () {
    var worker;
    var prom;
    var resolves = {};

    function decorate(worker) {
      function execute(options, callback) {
        worker.postMessage({ options: options || {}, callback: callback });
      }
      worker.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ canvas: offscreen }, [offscreen]);
      };

      worker.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }

        var id = Math.random().toString(36).slice(2);

        prom = promise(function (resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }

            delete resolves[id];
            worker.removeEventListener('message', workerDone);

            prom = null;

            bitmapMapper.clear();

            done();
            resolve();
          }

          worker.addEventListener('message', workerDone);
          execute(options, id);

          resolves[id] = workerDone.bind(null, { data: { callback: id }});
        });

        return prom;
      };

      worker.reset = function resetWorker() {
        worker.postMessage({ reset: true });

        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }

    return function () {
      if (worker) {
        return worker;
      }

      if (!isWorker && canUseWorker) {
        var code = [
          'var CONFETTI, SIZE = {}, module = {};',
          '(' + main.toString() + ')(this, module, true, SIZE);',
          'onmessage = function(msg) {',
          '  if (msg.data.options) {',
          '    CONFETTI(msg.data.options).then(function () {',
          '      if (msg.data.callback) {',
          '        postMessage({ callback: msg.data.callback });',
          '      }',
          '    });',
          '  } else if (msg.data.reset) {',
          '    CONFETTI && CONFETTI.reset();',
          '  } else if (msg.data.resize) {',
          '    SIZE.width = msg.data.resize.width;',
          '    SIZE.height = msg.data.resize.height;',
          '  } else if (msg.data.canvas) {',
          '    SIZE.width = msg.data.canvas.width;',
          '    SIZE.height = msg.data.canvas.height;',
          '    CONFETTI = module.exports.create(msg.data.canvas);',
          '  }',
          '}',
        ].join('\n');
        try {
          worker = new Worker(URL.createObjectURL(new Blob([code])));
        } catch (e) {
          // eslint-disable-next-line no-console
          typeof console !== 'undefined' && typeof console.warn === 'function' ? console.warn('🎊 Could not load worker', e) : null;

          return null;
        }

        decorate(worker);
      }

      return worker;
    };
  })();

  var defaults = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ['square', 'circle'],
    zIndex: 100,
    colors: [
      '#26ccff',
      '#a25afd',
      '#ff5e7e',
      '#88ff5a',
      '#fcff42',
      '#ffa62d',
      '#ff36ff'
    ],
    // probably should be true, but back-compat
    disableForReducedMotion: false,
    scalar: 1
  };

  function convert(val, transform) {
    return transform ? transform(val) : val;
  }

  function isOk(val) {
    return !(val === null || val === undefined);
  }

  function prop(options, name, transform) {
    return convert(
      options && isOk(options[name]) ? options[name] : defaults[name],
      transform
    );
  }

  function onlyPositiveInt(number){
    return number < 0 ? 0 : Math.floor(number);
  }

  function randomInt(min, max) {
    // [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function toDecimal(str) {
    return parseInt(str, 16);
  }

  function colorsToRgb(colors) {
    return colors.map(hexToRgb);
  }

  function hexToRgb(str) {
    var val = String(str).replace(/[^0-9a-f]/gi, '');

    if (val.length < 6) {
        val = val[0]+val[0]+val[1]+val[1]+val[2]+val[2];
    }

    return {
      r: toDecimal(val.substring(0,2)),
      g: toDecimal(val.substring(2,4)),
      b: toDecimal(val.substring(4,6))
    };
  }

  function getOrigin(options) {
    var origin = prop(options, 'origin', Object);
    origin.x = prop(origin, 'x', Number);
    origin.y = prop(origin, 'y', Number);

    return origin;
  }

  function setCanvasWindowSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }

  function setCanvasRectSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function getCanvas(zIndex) {
    var canvas = document.createElement('canvas');

    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = zIndex;

    return canvas;
  }

  function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(radiusX, radiusY);
    context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    context.restore();
  }

  function randomPhysics(opts) {
    var radAngle = opts.angle * (Math.PI / 180);
    var radSpread = opts.spread * (Math.PI / 180);

    return {
      x: opts.x,
      y: opts.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: (opts.startVelocity * 0.5) + (Math.random() * opts.startVelocity),
      angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: opts.color,
      shape: opts.shape,
      tick: 0,
      totalTicks: opts.ticks,
      decay: opts.decay,
      drift: opts.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: opts.gravity * 3,
      ovalScalar: 0.6,
      scalar: opts.scalar,
      flat: opts.flat
    };
  }

  function updateFetti(context, fetti) {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.velocity *= fetti.decay;

    if (fetti.flat) {
      fetti.wobble = 0;
      fetti.wobbleX = fetti.x + (10 * fetti.scalar);
      fetti.wobbleY = fetti.y + (10 * fetti.scalar);

      fetti.tiltSin = 0;
      fetti.tiltCos = 0;
      fetti.random = 1;
    } else {
      fetti.wobble += fetti.wobbleSpeed;
      fetti.wobbleX = fetti.x + ((10 * fetti.scalar) * Math.cos(fetti.wobble));
      fetti.wobbleY = fetti.y + ((10 * fetti.scalar) * Math.sin(fetti.wobble));

      fetti.tiltAngle += 0.1;
      fetti.tiltSin = Math.sin(fetti.tiltAngle);
      fetti.tiltCos = Math.cos(fetti.tiltAngle);
      fetti.random = Math.random() + 2;
    }

    var progress = (fetti.tick++) / fetti.totalTicks;

    var x1 = fetti.x + (fetti.random * fetti.tiltCos);
    var y1 = fetti.y + (fetti.random * fetti.tiltSin);
    var x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
    var y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);

    context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - progress) + ')';

    context.beginPath();

    if (canUsePaths && fetti.shape.type === 'path' && typeof fetti.shape.path === 'string' && Array.isArray(fetti.shape.matrix)) {
      context.fill(transformPath2D(
        fetti.shape.path,
        fetti.shape.matrix,
        fetti.x,
        fetti.y,
        Math.abs(x2 - x1) * 0.1,
        Math.abs(y2 - y1) * 0.1,
        Math.PI / 10 * fetti.wobble
      ));
    } else if (fetti.shape.type === 'bitmap') {
      var rotation = Math.PI / 10 * fetti.wobble;
      var scaleX = Math.abs(x2 - x1) * 0.1;
      var scaleY = Math.abs(y2 - y1) * 0.1;
      var width = fetti.shape.bitmap.width * fetti.scalar;
      var height = fetti.shape.bitmap.height * fetti.scalar;

      var matrix = new DOMMatrix([
        Math.cos(rotation) * scaleX,
        Math.sin(rotation) * scaleX,
        -Math.sin(rotation) * scaleY,
        Math.cos(rotation) * scaleY,
        fetti.x,
        fetti.y
      ]);

      // apply the transform matrix from the confetti shape
      matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));

      var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), 'no-repeat');
      pattern.setTransform(matrix);

      context.globalAlpha = (1 - progress);
      context.fillStyle = pattern;
      context.fillRect(
        fetti.x - (width / 2),
        fetti.y - (height / 2),
        width,
        height
      );
      context.globalAlpha = 1;
    } else if (fetti.shape === 'circle') {
      context.ellipse ?
        context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) :
        ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
    } else if (fetti.shape === 'star') {
      var rot = Math.PI / 2 * 3;
      var innerRadius = 4 * fetti.scalar;
      var outerRadius = 8 * fetti.scalar;
      var x = fetti.x;
      var y = fetti.y;
      var spikes = 5;
      var step = Math.PI / spikes;

      while (spikes--) {
        x = fetti.x + Math.cos(rot) * outerRadius;
        y = fetti.y + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = fetti.x + Math.cos(rot) * innerRadius;
        y = fetti.y + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
    } else {
      context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
      context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
      context.lineTo(Math.floor(x2), Math.floor(y2));
      context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
    }

    context.closePath();
    context.fill();

    return fetti.tick < fetti.totalTicks;
  }

  function animate(canvas, fettis, resizer, size, done) {
    var animatingFettis = fettis.slice();
    var context = canvas.getContext('2d');
    var animationFrame;
    var destroy;

    var prom = promise(function (resolve) {
      function onDone() {
        animationFrame = destroy = null;

        context.clearRect(0, 0, size.width, size.height);
        bitmapMapper.clear();

        done();
        resolve();
      }

      function update() {
        if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
          size.width = canvas.width = workerSize.width;
          size.height = canvas.height = workerSize.height;
        }

        if (!size.width && !size.height) {
          resizer(canvas);
          size.width = canvas.width;
          size.height = canvas.height;
        }

        context.clearRect(0, 0, size.width, size.height);

        animatingFettis = animatingFettis.filter(function (fetti) {
          return updateFetti(context, fetti);
        });

        if (animatingFettis.length) {
          animationFrame = raf.frame(update);
        } else {
          onDone();
        }
      }

      animationFrame = raf.frame(update);
      destroy = onDone;
    });

    return {
      addFettis: function (fettis) {
        animatingFettis = animatingFettis.concat(fettis);

        return prom;
      },
      canvas: canvas,
      promise: prom,
      reset: function () {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }

        if (destroy) {
          destroy();
        }
      }
    };
  }

  function confettiCannon(canvas, globalOpts) {
    var isLibCanvas = !canvas;
    var allowResize = !!prop(globalOpts || {}, 'resize');
    var hasResizeEventRegistered = false;
    var globalDisableForReducedMotion = prop(globalOpts, 'disableForReducedMotion', Boolean);
    var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, 'useWorker');
    var worker = shouldUseWorker ? getWorker() : null;
    var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
    var initialized = (canvas && worker) ? !!canvas.__confetti_initialized : false;
    var preferLessMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion)').matches;
    var animationObj;

    function fireLocal(options, size, done) {
      var particleCount = prop(options, 'particleCount', onlyPositiveInt);
      var angle = prop(options, 'angle', Number);
      var spread = prop(options, 'spread', Number);
      var startVelocity = prop(options, 'startVelocity', Number);
      var decay = prop(options, 'decay', Number);
      var gravity = prop(options, 'gravity', Number);
      var drift = prop(options, 'drift', Number);
      var colors = prop(options, 'colors', colorsToRgb);
      var ticks = prop(options, 'ticks', Number);
      var shapes = prop(options, 'shapes');
      var scalar = prop(options, 'scalar');
      var flat = !!prop(options, 'flat');
      var origin = getOrigin(options);

      var temp = particleCount;
      var fettis = [];

      var startX = canvas.width * origin.x;
      var startY = canvas.height * origin.y;

      while (temp--) {
        fettis.push(
          randomPhysics({
            x: startX,
            y: startY,
            angle: angle,
            spread: spread,
            startVelocity: startVelocity,
            color: colors[temp % colors.length],
            shape: shapes[randomInt(0, shapes.length)],
            ticks: ticks,
            decay: decay,
            gravity: gravity,
            drift: drift,
            scalar: scalar,
            flat: flat
          })
        );
      }

      // if we have a previous canvas already animating,
      // add to it
      if (animationObj) {
        return animationObj.addFettis(fettis);
      }

      animationObj = animate(canvas, fettis, resizer, size , done);

      return animationObj.promise;
    }

    function fire(options) {
      var disableForReducedMotion = globalDisableForReducedMotion || prop(options, 'disableForReducedMotion', Boolean);
      var zIndex = prop(options, 'zIndex', Number);

      if (disableForReducedMotion && preferLessMotion) {
        return promise(function (resolve) {
          resolve();
        });
      }

      if (isLibCanvas && animationObj) {
        // use existing canvas from in-progress animation
        canvas = animationObj.canvas;
      } else if (isLibCanvas && !canvas) {
        // create and initialize a new canvas
        canvas = getCanvas(zIndex);
        document.body.appendChild(canvas);
      }

      if (allowResize && !initialized) {
        // initialize the size of a user-supplied canvas
        resizer(canvas);
      }

      var size = {
        width: canvas.width,
        height: canvas.height
      };

      if (worker && !initialized) {
        worker.init(canvas);
      }

      initialized = true;

      if (worker) {
        canvas.__confetti_initialized = true;
      }

      function onResize() {
        if (worker) {
          // TODO this really shouldn't be immediate, because it is expensive
          var obj = {
            getBoundingClientRect: function () {
              if (!isLibCanvas) {
                return canvas.getBoundingClientRect();
              }
            }
          };

          resizer(obj);

          worker.postMessage({
            resize: {
              width: obj.width,
              height: obj.height
            }
          });
          return;
        }

        // don't actually query the size here, since this
        // can execute frequently and rapidly
        size.width = size.height = null;
      }

      function done() {
        animationObj = null;

        if (allowResize) {
          hasResizeEventRegistered = false;
          global.removeEventListener('resize', onResize);
        }

        if (isLibCanvas && canvas) {
          if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
          }
          canvas = null;
          initialized = false;
        }
      }

      if (allowResize && !hasResizeEventRegistered) {
        hasResizeEventRegistered = true;
        global.addEventListener('resize', onResize, false);
      }

      if (worker) {
        return worker.fire(options, size, done);
      }

      return fireLocal(options, size, done);
    }

    fire.reset = function () {
      if (worker) {
        worker.reset();
      }

      if (animationObj) {
        animationObj.reset();
      }
    };

    return fire;
  }

  // Make default export lazy to defer worker creation until called.
  var defaultFire;
  function getDefaultFire() {
    if (!defaultFire) {
      defaultFire = confettiCannon(null, { useWorker: true, resize: true });
    }
    return defaultFire;
  }

  function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
    var path2d = new Path2D(pathString);

    var t1 = new Path2D();
    t1.addPath(path2d, new DOMMatrix(pathMatrix));

    var t2 = new Path2D();
    // see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix/DOMMatrix
    t2.addPath(t1, new DOMMatrix([
      Math.cos(rotation) * scaleX,
      Math.sin(rotation) * scaleX,
      -Math.sin(rotation) * scaleY,
      Math.cos(rotation) * scaleY,
      x,
      y
    ]));

    return t2;
  }

  function shapeFromPath(pathData) {
    if (!canUsePaths) {
      throw new Error('path confetti are not supported in this browser');
    }

    var path, matrix;

    if (typeof pathData === 'string') {
      path = pathData;
    } else {
      path = pathData.path;
      matrix = pathData.matrix;
    }

    var path2d = new Path2D(path);
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');

    if (!matrix) {
      // attempt to figure out the width of the path, up to 1000x1000
      var maxSize = 1000;
      var minX = maxSize;
      var minY = maxSize;
      var maxX = 0;
      var maxY = 0;
      var width, height;

      // do some line skipping... this is faster than checking
      // every pixel and will be mostly still correct
      for (var x = 0; x < maxSize; x += 2) {
        for (var y = 0; y < maxSize; y += 2) {
          if (tempCtx.isPointInPath(path2d, x, y, 'nonzero')) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      width = maxX - minX;
      height = maxY - minY;

      var maxDesiredSize = 10;
      var scale = Math.min(maxDesiredSize/width, maxDesiredSize/height);

      matrix = [
        scale, 0, 0, scale,
        -Math.round((width/2) + minX) * scale,
        -Math.round((height/2) + minY) * scale
      ];
    }

    return {
      type: 'path',
      path: path,
      matrix: matrix
    };
  }

  function shapeFromText(textData) {
    var text,
        scalar = 1,
        color = '#000000',
        // see https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/
        fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';

    if (typeof textData === 'string') {
      text = textData;
    } else {
      text = textData.text;
      scalar = 'scalar' in textData ? textData.scalar : scalar;
      fontFamily = 'fontFamily' in textData ? textData.fontFamily : fontFamily;
      color = 'color' in textData ? textData.color : color;
    }

    // all other confetti are 10 pixels,
    // so this pixel size is the de-facto 100% scale confetti
    var fontSize = 10 * scalar;
    var font = '' + fontSize + 'px ' + fontFamily;

    var canvas = new OffscreenCanvas(fontSize, fontSize);
    var ctx = canvas.getContext('2d');

    ctx.font = font;
    var size = ctx.measureText(text);
    var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
    var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);

    var padding = 2;
    var x = size.actualBoundingBoxLeft + padding;
    var y = size.actualBoundingBoxAscent + padding;
    width += padding + padding;
    height += padding + padding;

    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
    ctx.font = font;
    ctx.fillStyle = color;

    ctx.fillText(text, x, y);

    var scale = 1 / scalar;

    return {
      type: 'bitmap',
      // TODO these probably need to be transfered for workers
      bitmap: canvas.transferToImageBitmap(),
      matrix: [scale, 0, 0, scale, -width * scale / 2, -height * scale / 2]
    };
  }

  module.exports = function() {
    return getDefaultFire().apply(this, arguments);
  };
  module.exports.reset = function() {
    getDefaultFire().reset();
  };
  module.exports.create = confettiCannon;
  module.exports.shapeFromPath = shapeFromPath;
  module.exports.shapeFromText = shapeFromText;
}((function () {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  return this || {};
})(), module$1, false));

// end source content

var confetti = module$1.exports;
module$1.exports.create;

const POINTS_ANIMATION_STYLE_ID = "pointsbot-float-points-style";
const POINTS_ANIMATION_DURATION = 2000;
const STAR_SHOWER_DURATION = 2500;
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
function playCompletionBurst(origin, colors) {
    void confetti({
        particleCount: 30,
        spread: 70,
        startVelocity: 25,
        origin,
        colors,
        disableForReducedMotion: true,
    });
}
function playStarShower(colors, duration = STAR_SHOWER_DURATION) {
    const animationEnd = Date.now() + duration;
    const frame = () => {
        void confetti({
            particleCount: 1,
            angle: 270,
            spread: 30,
            startVelocity: 10,
            origin: { x: Math.random(), y: 0 },
            colors,
            shapes: ["star"],
            gravity: randomInRange(1.2, 1.5),
            scalar: randomInRange(1.2, 2),
            disableForReducedMotion: true,
        });
        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        }
    };
    frame();
}
function playPointsAnimation(origin, pointsValue) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }
    if (!document.getElementById(POINTS_ANIMATION_STYLE_ID)) {
        const style = document.createElement("style");
        style.id = POINTS_ANIMATION_STYLE_ID;
        style.textContent = `
      @keyframes floatPoints {
        from {
          transform: translate(-50%, -50%);
          opacity: 1;
        }
        to {
          transform: translate(-50%, -100px);
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(style);
    }
    const element = document.createElement("div");
    element.textContent = `+${pointsValue}`;
    Object.assign(element.style, {
        position: "fixed",
        left: `${origin.x}px`,
        top: `${origin.y}px`,
        zIndex: "10000",
        pointerEvents: "none",
        fontSize: "24px",
        fontWeight: "bold",
        color: "var(--pointsbot-accent-color, #B29FE8)",
        animation: `floatPoints ${POINTS_ANIMATION_DURATION}ms ease-out forwards`,
    });
    document.body.appendChild(element);
    window.setTimeout(() => element.remove(), POINTS_ANIMATION_DURATION);
}

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
let PointsBotCollapsibleSection = class PointsBotCollapsibleSection extends i {
    constructor() {
        super(...arguments);
        /** Visible label in the section header (e.g. "Base Tasks"). */
        this.label = "";
        /** Item count shown in the header summary (e.g. 3 → "Base Tasks (3)"). */
        this.count = 0;
        /** Whether the section starts open. Defaults to true. */
        this.open = true;
        this._open = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this._open = this.open;
    }
    _toggle() {
        this._open = !this._open;
    }
    render() {
        const labelText = this.count > 0 ? `${this.label} (${this.count})` : this.label;
        return b `
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
};
PointsBotCollapsibleSection.styles = i$3 `
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
       font-size: 24px;
      cursor: pointer;
      user-select: none;
       background-color: var(--pointsbot-accent-color);
       color: var(--pointsbot-accent-text-color);
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
       color: var(--pointsbot-accent-text-color);
    }

    .section-header-chevron {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
       color: var(--pointsbot-accent-text-color);
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
      padding: 0;
    }

    .section-content.open .section-content-inner {
      padding: 0;
    }
  `;
__decorate([
    n({ type: String })
], PointsBotCollapsibleSection.prototype, "label", void 0);
__decorate([
    n({ type: Number })
], PointsBotCollapsibleSection.prototype, "count", void 0);
__decorate([
    n({ type: Boolean })
], PointsBotCollapsibleSection.prototype, "open", void 0);
__decorate([
    r()
], PointsBotCollapsibleSection.prototype, "_open", void 0);
PointsBotCollapsibleSection = __decorate([
    t("pointsbot-collapsible-section")
], PointsBotCollapsibleSection);

/**
 * AdjustPointsDialog
 *
 * A button that opens a modal-style dialog for submitting a manual point
 * adjustment. Calls pointsbot.adjust_points with { person_id, amount, reason }.
 * Client-side validation mirrors the backend's requirements:
 *   - amount must be a non-zero integer
 *   - reason must be a non-empty string
 */
let AdjustPointsDialog = class AdjustPointsDialog extends i {
    constructor() {
        super(...arguments);
        this.hass = null;
        /** The person_id attribute from the sensor entity (e.g. "person.alice"). */
        this.personId = "";
        this.confettiColors = [];
        this._open = false;
        this._amount = "";
        this._reason = "";
        this._error = "";
        this._submitting = false;
    }
    _openDialog() {
        this._amount = "";
        this._reason = "";
        this._error = "";
        this._submitting = false;
        this._open = true;
    }
    _closeDialog() {
        this._open = false;
    }
    _onAmountInput(e) {
        this._amount = e.target.value;
        this._error = "";
    }
    _onReasonInput(e) {
        this._reason = e.target.value;
        this._error = "";
    }
    async _submit() {
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
        }
        catch {
            this._error = "Service call failed. Please try again.";
        }
        finally {
            this._submitting = false;
        }
    }
    render() {
        return b `
      <button class="add-button" @click=${this._openDialog}>
        <span class="button-icon-section">
          <span class="button-icon"><ha-icon icon="mdi:plus"></ha-icon></span>
        </span>
        <span class="button-info">
          <span class="button-text">Adjust Points</span>
        </span>
      </button>

      ${this._open
            ? b `
            <div class="dialog-overlay" @click=${this._handleOverlayClick}>
              <div class="dialog" @click=${(e) => e.stopPropagation()}>
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
                ? b `<p class="error-message">${this._error}</p>`
                : A}

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
            : A}
    `;
    }
    _handleOverlayClick() {
        this._closeDialog();
    }
};
AdjustPointsDialog.styles = i$3 `
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
__decorate([
    n({ attribute: false })
], AdjustPointsDialog.prototype, "hass", void 0);
__decorate([
    n({ type: String })
], AdjustPointsDialog.prototype, "personId", void 0);
__decorate([
    n({ type: Array })
], AdjustPointsDialog.prototype, "confettiColors", void 0);
__decorate([
    r()
], AdjustPointsDialog.prototype, "_open", void 0);
__decorate([
    r()
], AdjustPointsDialog.prototype, "_amount", void 0);
__decorate([
    r()
], AdjustPointsDialog.prototype, "_reason", void 0);
__decorate([
    r()
], AdjustPointsDialog.prototype, "_error", void 0);
__decorate([
    r()
], AdjustPointsDialog.prototype, "_submitting", void 0);
AdjustPointsDialog = __decorate([
    t("pointsbot-adjust-points-dialog")
], AdjustPointsDialog);

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
let AddTaskDialog = class AddTaskDialog extends i {
    constructor() {
        super(...arguments);
        this.hass = null;
        /** The person_id attribute from the sensor entity (e.g. "person.alice"). */
        this.personId = "";
        this._open = false;
        this._taskType = "base";
        this._name = "";
        this._pointsValue = "";
        this._error = "";
        this._submitting = false;
    }
    _openDialog() {
        this._taskType = "base";
        this._name = "";
        this._pointsValue = "";
        this._error = "";
        this._submitting = false;
        this._open = true;
    }
    _closeDialog() {
        this._open = false;
    }
    _onTaskTypeChange(e) {
        const next = e.target.value;
        // When switching to base, ensure no stale points_value can be sent in the
        // base payload. The backend rejects points_value for base tasks.
        if (next === "base") {
            this._pointsValue = "";
        }
        this._taskType = next;
        this._error = "";
    }
    _onNameInput(e) {
        this._name = e.target.value;
        this._error = "";
    }
    _onPointsValueInput(e) {
        this._pointsValue = e.target.value;
        this._error = "";
    }
    async _submit() {
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
            }
            catch {
                this._error = "Could not add task. Please try again.";
            }
            finally {
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
        }
        catch {
            this._error = "Could not add task. Please try again.";
        }
        finally {
            this._submitting = false;
        }
    }
    render() {
        return b `
      <button class="add-button" @click=${this._openDialog}>
        <span class="button-icon-section">
          <span class="button-icon"><ha-icon icon="mdi:plus"></ha-icon></span>
        </span>
        <span class="button-info">
          <span class="button-text">Add Task</span>
        </span>
      </button>

      ${this._open
            ? b `
            <div class="dialog-overlay" @click=${this._handleOverlayClick}>
              <div class="dialog" @click=${(e) => e.stopPropagation()}>
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
                ? b `
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
                : A}

                ${this._error
                ? b `<p class="error-message">${this._error}</p>`
                : A}

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
            : A}
    `;
    }
    _handleOverlayClick() {
        this._closeDialog();
    }
};
AddTaskDialog.styles = i$3 `
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
__decorate([
    n({ attribute: false })
], AddTaskDialog.prototype, "hass", void 0);
__decorate([
    n({ type: String })
], AddTaskDialog.prototype, "personId", void 0);
__decorate([
    r()
], AddTaskDialog.prototype, "_open", void 0);
__decorate([
    r()
], AddTaskDialog.prototype, "_taskType", void 0);
__decorate([
    r()
], AddTaskDialog.prototype, "_name", void 0);
__decorate([
    r()
], AddTaskDialog.prototype, "_pointsValue", void 0);
__decorate([
    r()
], AddTaskDialog.prototype, "_error", void 0);
__decorate([
    r()
], AddTaskDialog.prototype, "_submitting", void 0);
AddTaskDialog = __decorate([
    t("pointsbot-add-task-dialog")
], AddTaskDialog);

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
const ACCENT_TEXT_DARK$1 = "#17151d";
const ACCENT_TEXT_LIGHT$1 = "#ffffff";
// Register card in the HA "Add Card" picker.
window.customCards = window.customCards ?? [];
window.customCards.push({
    type: "pointsbot-person-card",
    name: "PointsBot Person Card",
    description: "Displays a family member's points, tasks, and weekly adjustments.",
    preview: false,
});
let PointsBotPersonCard = class PointsBotPersonCard extends i {
    constructor() {
        super(...arguments);
        this._config = null;
        this._hass = null;
    }
    // -----------------------------------------------------------------
    // Lovelace card API
    // -----------------------------------------------------------------
    set hass(hass) {
        this._hass = hass;
        this.requestUpdate();
    }
    setConfig(config) {
        if (!config.entity) {
            throw new Error("PointsBot card: 'entity' is required in card config.");
        }
        this._config = {
            ...config,
            hide_card_background: config.hide_card_background === true,
        };
    }
    getCardSize() {
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
                {
                    name: "hide_card_background",
                    default: false,
                    helper: "Render the card without a background, padding, box-shadow, or border so it blends into the dashboard.",
                    selector: {
                        boolean: {},
                    },
                },
                {
                    name: "secondary_value_entity",
                    helper: "Optional entity whose state is displayed (no label) on the left side of the Total row.",
                    selector: {
                        entity: {},
                    },
                },
            ],
        };
    }
    /**
     * Returns a minimal valid config used as a starting point when the card is
     * added from the HA "Add Card" GUI picker.
     */
    static getStubConfig() {
        return {
            type: "custom:pointsbot-person-card",
            entity: "",
            accent_color: ACCENT_COLOR,
            hide_card_background: false,
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
    _resolveAccentColor() {
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
    _computeContrastTextColor(hex) {
        const accentLum = this._relativeLuminance(hex);
        const darkLum = this._relativeLuminance(ACCENT_TEXT_DARK$1);
        const lightLum = this._relativeLuminance(ACCENT_TEXT_LIGHT$1);
        const darkRatio = (Math.max(accentLum, darkLum) + 0.05) /
            (Math.min(accentLum, darkLum) + 0.05);
        const lightRatio = (Math.max(accentLum, lightLum) + 0.05) /
            (Math.min(accentLum, lightLum) + 0.05);
        return darkRatio >= lightRatio ? ACCENT_TEXT_DARK$1 : ACCENT_TEXT_LIGHT$1;
    }
    /** WCAG relative luminance for a #RRGGBB hex color. */
    _relativeLuminance(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const [rL, gL, bL] = [r, g, b].map((c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    }
    // -----------------------------------------------------------------
    // Service call helpers
    // -----------------------------------------------------------------
    /**
     * Toggles a base task's `done` state.
     *
     * `origin` is pre-normalized (x/y in [0, 1]) to viewport-fraction
     * coordinates — the click handler computes both pixel and normalized
     * origins synchronously before this async method runs, so a viewport
     * resize during the await cannot shift the burst origin.
     */
    async _toggleBaseTask(personId, taskId, origin, wasDone, colors) {
        if (!this._hass) {
            return;
        }
        try {
            await this._hass.callService("pointsbot", "toggle_base_task", {
                person_id: personId,
                task_id: taskId,
            });
            if (!wasDone) {
                playCompletionBurst(origin, colors);
            }
        }
        catch {
            // Service errors are surfaced by HA's notification system;
            // swallow here to prevent unhandled promise rejections.
        }
    }
    /**
     * Completes a bonus task and fires both confetti effects.
     *
     * `normalizedOrigin` is consumed by `playCompletionBurst` (canvas-confetti
     * expects [0, 1] fractions); `pixelOrigin` is consumed by
     * `playPointsAnimation`, which positions a DOM element using pixel
     * coordinates. Both are captured synchronously in the click handler
     * before the await, so a viewport resize during the service call cannot
     * misalign either effect.
     */
    async _completeBonusTask(personId, taskId, pixelOrigin, normalizedOrigin, pointsValue, colors) {
        if (!this._hass) {
            return;
        }
        try {
            await this._hass.callService("pointsbot", "complete_bonus_task", {
                person_id: personId,
                task_id: taskId,
            });
            playCompletionBurst(normalizedOrigin, colors);
            playPointsAnimation(pixelOrigin, pointsValue);
        }
        catch {
            // Service errors are surfaced by HA's notification system;
            // swallow here to prevent unhandled promise rejections.
        }
    }
    _uncompleteBonusTask(personId, taskId) {
        this._hass?.callService("pointsbot", "uncomplete_bonus_task", {
            person_id: personId,
            task_id: taskId,
        });
    }
    _renderSectionItemInfo(title, subtitle) {
        return b `
      <div class="section-item-info">
        <div class="section-item-title">${title}</div>
        ${subtitle === undefined
            ? A
            : b `<div class="section-item-subtitle">${subtitle}</div>`}
      </div>
    `;
    }
    _formatAdjustmentTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString(undefined, {
            weekday: "long",
            hour: "numeric",
            minute: "2-digit",
        });
    }
    _formatSecondaryValue(stateObj) {
        const { state, attributes } = stateObj;
        if (attributes.device_class !== "monetary") {
            return state;
        }
        const currency = attributes.unit_of_measurement;
        if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
            return state;
        }
        const value = Number(state);
        if (!Number.isFinite(value)) {
            return state;
        }
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(value);
    }
    // -----------------------------------------------------------------
    // Rendering
    // -----------------------------------------------------------------
    render() {
        if (!this._config) {
            return A;
        }
        const hass = this._hass;
        if (!hass) {
            return A;
        }
        const entityId = this._config.entity;
        const stateObj = hass.states[entityId];
        const headerClass = this._config.hide_card_background ? "header no-background" : "header";
        if (!stateObj) {
            return b `
        <ha-card>
          <div class="error">
            Entity <strong>${entityId}</strong> not found. Check your card
            configuration.
          </div>
        </ha-card>
      `;
        }
        if (stateObj.state === "unavailable" || stateObj.state === "unknown") {
            return b `
        <ha-card>
          <div class="error">
            Entity <strong>${entityId}</strong> is ${stateObj.state}.
          </div>
        </ha-card>
      `;
        }
        const attrs = stateObj.attributes;
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
        const colors = extractColorVariants(accentColor);
        const extraEntityId = this._config.secondary_value_entity;
        const extraStateObj = extraEntityId ? hass.states[extraEntityId] : undefined;
        const extraValue = extraStateObj &&
            extraStateObj.state !== "unavailable" &&
            extraStateObj.state !== "unknown"
            ? this._formatSecondaryValue(extraStateObj)
            : null;
        return b `
      <ha-card>
        <div
          class="card"
          style="--pointsbot-accent-color: ${accentColor}; --pointsbot-accent-text-color: ${accentTextColor};"
        >
          <div class="${headerClass}">
            ${picture
            ? b `<img class="avatar" src="${picture}" alt="${name}" />`
            : b `<div class="avatar-placeholder">👤</div>`}
            <div class="person-info">
              <div class="points-row">
                <span class="name person-name">${name}</span>
                <span class="weekly-points">
                  ${weeklyPoints} <ha-icon icon="${icon}"></ha-icon>
                </span>
              </div>
              <div class="points-block">
                ${extraValue !== null
            ? b `<span class="points-extra">${extraValue}</span>`
            : A}
                <div class="points-block-right">
                  <span class="points-label">Total</span>
                  <span class="points-value">${totalPoints}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Base Tasks -->
          <pointsbot-collapsible-section label="Standard" open>
            ${baseTasks.length === 0
            ? b `<p class="empty-state">No standard tasks.</p>`
            : baseTasks.map((task) => b `
                    <div class="section-item-row task-row">
                      ${this._renderSectionItemInfo(task.name)}
                      <button
                        class="circle-button ${task.done ? "completed" : ""}"
                        aria-label="${task.done
                ? "Uncomplete"
                : "Complete"} ${task.name}"
                        @click=${(event) => {
                // Capture pixel + normalized origin synchronously
                // before the async handler awaits callService. If
                // we deferred normalization until after the await,
                // a viewport resize mid-flight could produce a
                // misaligned confetti burst origin.
                const rect = event.currentTarget.getBoundingClientRect();
                const pixelOrigin = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
                const normalizedOrigin = {
                    x: pixelOrigin.x / window.innerWidth,
                    y: pixelOrigin.y / window.innerHeight,
                };
                void this._toggleBaseTask(personId, task.id, normalizedOrigin, task.done, colors);
            }}
                      >
                        <ha-icon icon="mdi:check"></ha-icon>
                      </button>
                    </div>
                  `)}
          </pointsbot-collapsible-section>

          <!-- Bonus Tasks -->
          <pointsbot-collapsible-section label="Bonus" open>
            ${bonusTasks.length === 0
            ? b `<p class="empty-state">No bonus tasks.</p>`
            : bonusTasks.map((task) => b `
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
                          @click=${() => this._uncompleteBonusTask(personId, task.id)}
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
                          @click=${(event) => {
                // Capture both pixel and normalized origins
                // synchronously before the async handler awaits
                // callService. playPointsAnimation needs pixel
                // coordinates (DOM positioning); playCompletionBurst
                // needs [0, 1] viewport fractions. Computing
                // both here keeps the confetti aligned even if
                // the viewport resizes during the await.
                const rect = event.currentTarget.getBoundingClientRect();
                const pixelOrigin = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
                const normalizedOrigin = {
                    x: pixelOrigin.x / window.innerWidth,
                    y: pixelOrigin.y / window.innerHeight,
                };
                void this._completeBonusTask(personId, task.id, pixelOrigin, normalizedOrigin, task.points_value, colors);
            }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  `)}
          </pointsbot-collapsible-section>

          <!-- Weekly Adjustments -->
          <pointsbot-collapsible-section label="Adjustments" open>
            ${adjustments.length === 0
            ? b `<p class="empty-state">No adjustments this week.</p>`
            : adjustments.map((adj) => b `
                    <div class="section-item-row adjustment-row">
                      ${this._renderSectionItemInfo(adj.reason, this._formatAdjustmentTimestamp(adj.timestamp))}
                      <span
                        class="adjustment-amount ${adj.amount >= 0
                ? "positive"
                : "negative"}"
                      >
                        ${adj.amount >= 0 ? "+" : ""}${adj.amount}
                      </span>
                    </div>
                  `)}
          </pointsbot-collapsible-section>

          <div class="action-row">
            <pointsbot-add-task-dialog
              .hass=${hass}
              .personId=${personId}
            ></pointsbot-add-task-dialog>
            <pointsbot-adjust-points-dialog
              .hass=${hass}
              .personId=${personId}
              .confettiColors=${colors}
            ></pointsbot-adjust-points-dialog>
          </div>
        </div>
      </ha-card>
    `;
    }
};
PointsBotPersonCard.styles = i$3 `
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
      padding: 16px;
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      margin-bottom: 12px;
    }

    .header.no-background {
      padding: 0;
      background: transparent;
      margin-bottom: 0;
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

    .points-block-right {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-left: auto;
    }

    .points-extra {
      font-size: 20px;
      font-weight: bold;
      line-height: 1;
      color: var(--secondary-text-color, #9e9e9e);
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
__decorate([
    r()
], PointsBotPersonCard.prototype, "_config", void 0);
__decorate([
    r()
], PointsBotPersonCard.prototype, "_hass", void 0);
PointsBotPersonCard = __decorate([
    t("pointsbot-person-card")
], PointsBotPersonCard);

const ACCENT = "#B29FE8";
const ACCENT_TEXT_DARK = "#17151d";
const ACCENT_TEXT_LIGHT = "#ffffff";
const MDI_ICON = /^mdi:[a-z0-9][a-z0-9-]*$/;
window.customCards = window.customCards ?? [];
window.customCards.push({ type: "pointsbot-person-rewards-card", name: "PointsBot Person Rewards Card", description: "Browse and redeem PointsBot rewards.", preview: false });
let PointsBotPersonRewardsCard = class PointsBotPersonRewardsCard extends i {
    constructor() {
        super(...arguments);
        this._config = { type: "custom:pointsbot-person-rewards-card" };
        this._hass = null;
        this._detail = null;
        this._editing = null;
        this._formOpen = false;
        this._confirmDelete = null;
        this._form = { name: "", cost: 0, icon: "mdi:gift", description: "" };
        this._error = "";
        this._pending = false;
        this._restoreFocus = null;
        this._modalKeydown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                this._closeActiveModal();
                return;
            }
            if (event.key !== "Tab")
                return;
            const modal = this.shadowRoot?.querySelector(".modal-content");
            if (!modal)
                return;
            const focusable = [...modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((element) => !element.hasAttribute("disabled"));
            if (!focusable.length)
                return;
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        this._formSchema = [
            { name: "name", required: true, selector: { text: {} } },
            { name: "cost", required: true, selector: { number: { min: 1, mode: "box" } } },
            { name: "icon", required: true, selector: { icon: {} } },
            { name: "description", selector: { text: { multiline: true } } },
        ];
        this._openModal = () => { this._restoreFocus = document.activeElement; window.addEventListener("keydown", this._modalKeydown); };
        this._closeActiveModal = (restoreFocus = true) => { this._detail = null; this._confirmDelete = null; this._closeForm(); window.removeEventListener("keydown", this._modalKeydown); const focus = this._restoreFocus; this._restoreFocus = null; if (restoreFocus)
            focus?.focus(); };
        this._openDetail = (r) => { this._detail = r; this._openModal(); };
        this._openAdd = () => { this._editing = null; this._form = { name: "", cost: 0, icon: "mdi:gift", description: "" }; this._error = ""; this._formOpen = true; this._openModal(); };
        this._openEdit = (r) => { if (!this._owned(r))
            return; this._closeActiveModal(false); this._editing = r; this._form = { name: r.name, cost: r.cost, icon: r.icon, description: r.description ?? "" }; this._error = ""; this._formOpen = true; this._openModal(); };
        this._closeForm = () => { this._formOpen = false; this._editing = null; this._error = ""; };
    }
    set hass(value) { this._hass = value; this.requestUpdate(); }
    setConfig(config) { if (!config.person || !config.person.startsWith("person."))
        throw new Error("The PointsBot rewards card requires a person entity."); this._config = { type: "custom:pointsbot-person-rewards-card", ...config }; }
    getCardSize() { return 4; }
    static getConfigForm() { return { schema: [{ name: "person", required: true, selector: { entity: { filter: { domain: "person" } } } }, { name: "hide_card_background", default: false, selector: { boolean: {} } }, { name: "show_disabled_rewards", default: false, selector: { boolean: {} } }, { name: "sort_by", default: "cost", selector: { select: { options: ["cost", "name", "created"] } } }, { name: "show_add_reward_button", default: true, selector: { boolean: {} } }, { name: "accent_color", default: ACCENT, selector: { text: {} } }] }; }
    static getStubConfig() { return { type: "custom:pointsbot-person-rewards-card", person: "person.example", hide_card_background: false, show_disabled_rewards: false, sort_by: "cost", show_add_reward_button: true, accent_color: ACCENT }; }
    _profile() { return Object.entries(this._hass?.states ?? {}).map(([id, state]) => ({ id, attrs: state.attributes, state: state.state })).find((p) => p.id.startsWith("sensor.pointsbot_") && p.attrs.person_id === this._config.person && !["unavailable", "unknown"].includes(p.state) && Array.isArray(p.attrs.rewards)); }
    _owned(r) { return r.person_id === this._config.person; }
    _rewards() { const rewards = (this._profile()?.attrs.rewards ?? []).filter((r) => this._owned(r) && (this._config.show_disabled_rewards || r.enabled)); return [...rewards].sort((a, b) => this._config.sort_by === "name" ? a.name.localeCompare(b.name) : this._config.sort_by === "created" ? (Date.parse(a.created) || 0) - (Date.parse(b.created) || 0) : a.cost - b.cost); }
    _contrast(hex) { const lum = (v) => { const rgb = [1, 3, 5].map(i => parseInt(v.slice(i, i + 2), 16) / 255).map(c => c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4)); return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]; }; const a = lum(hex), d = lum(ACCENT_TEXT_DARK), l = lum(ACCENT_TEXT_LIGHT); return (Math.max(a, d) + .05) / (Math.min(a, d) + .05) >= (Math.max(a, l) + .05) / (Math.min(a, l) + .05) ? ACCENT_TEXT_DARK : ACCENT_TEXT_LIGHT; }
    async _save() { const f = this._form, name = f.name.trim(), icon = f.icon.trim(); if (!name || !Number.isInteger(f.cost) || f.cost <= 0 || !MDI_ICON.test(icon)) {
        this._error = "Name, positive whole-number cost, and an mdi:name icon are required.";
        return;
    } this._pending = true; try {
        await this._hass.callService("pointsbot", "manage_reward", { ...(this._editing ? { reward_id: this._editing.id } : {}), name, cost: f.cost, icon, description: f.description.trim(), person_id: this._config.person });
        this._closeActiveModal();
    }
    catch (e) {
        this._error = e instanceof Error ? e.message : "Unable to save reward.";
    }
    finally {
        this._pending = false;
    } }
    async _redeem(r) { const balance = Number(this._profile()?.state ?? 0); if (!this._owned(r) || !r.enabled || r.cost > balance)
        return; this._pending = true; try {
        await this._hass.callService("pointsbot", "redeem_reward", { person_id: this._config.person, reward_id: r.id });
        this._closeActiveModal();
        playStarShower(extractColorVariants(this._config.accent_color ?? ACCENT));
    }
    catch (e) {
        this._error = e instanceof Error ? e.message : "Unable to redeem reward.";
    }
    finally {
        this._pending = false;
    } }
    async _delete(r) { if (!this._owned(r))
        return; this._pending = true; try {
        await this._hass.callService("pointsbot", "delete_reward", { reward_id: r.id });
        this._closeActiveModal();
    }
    catch (e) {
        this._error = e instanceof Error ? e.message : "Unable to delete reward.";
    }
    finally {
        this._pending = false;
    } }
    render() { if (!this._hass)
        return A; if (!this._config.person)
        return b `<ha-card><div class="error">Configure a person entity for this card.</div></ha-card>`; const p = this._profile(), accent = this._config.accent_color && /^#[0-9a-f]{6}$/i.test(this._config.accent_color) ? this._config.accent_color : ACCENT; if (!p)
        return b `<ha-card><div class="error">No PointsBot profile is available for ${this._config.person}.</div></ha-card>`; const rewards = this._rewards(), balance = Number(p.state); return b `<ha-card class=${this._config.hide_card_background ? "no-background" : ""}><div class="card" style="--pointsbot-accent-color:${accent};--pointsbot-accent-text-color:${this._contrast(accent)}"><div class="rewards-grid">${rewards.map(r => b `<button class="reward-card ${r.enabled && r.cost <= balance ? "" : "disabled"}" aria-label=${r.name} @click=${() => this._openDetail(r)}><div class="reward-icon-section"><div class="reward-icon"><ha-icon icon=${r.icon}></ha-icon></div></div><div class="reward-info"><div class="reward-header"><span class="reward-name">${r.name}</span><span class="reward-cost">${r.cost} <ha-icon icon="mdi:star-circle"></ha-icon></span></div>${r.description ? b `<div class="reward-description">${r.description}</div>` : A}</div></button>`)}${this._config.show_add_reward_button !== false ? b `<button class="add-reward-card" aria-label="Add Reward" @click=${this._openAdd}><div class="add-reward-icon-section"><div class="add-reward-icon"><ha-icon icon="mdi:plus"></ha-icon></div></div><div class="add-reward-info"><span class="add-reward-text">Add Reward</span></div></button>` : A}</div>${!rewards.length ? b `<p>No rewards available for this person.</p>` : A}${this._error ? b `<div class="error" role="alert">${this._error}</div>` : A}</div></ha-card>${this._detail ? this._detailModal(this._detail, balance) : A}${this._formOpen ? this._formModal() : A}${this._confirmDelete ? this._deleteModal(this._confirmDelete) : A}`; }
    _detailModal(r, balance) { const affordable = r.enabled && r.cost <= balance; return b `<div class="modal-overlay" role="presentation" @click=${this._closeActiveModal}><section class="modal-content" role="dialog" aria-modal="true" aria-labelledby="reward-dialog-title" @click=${(e) => e.stopPropagation()}><div class="modal-header" id="reward-dialog-title">${r.name}</div><div class="modal-body"><p>${r.description || "No description."}</p><div class="modal-info"><div class="modal-info-row"><span>Banked balance</span><b>${balance}</b></div><div class="modal-info-row"><span>Cost</span><b>${r.cost}</b></div><div class="modal-info-row"><span>Remaining balance</span><b>${balance - r.cost}</b></div></div>${!r.enabled ? b `<p class="error" role="status">Disabled reward.</p>` : !affordable ? b `<p class="error" role="status">Insufficient banked points.</p>` : A}</div><div class="modal-actions"><button class="modal-button" @click=${this._closeActiveModal}>Close</button><button class="modal-button" @click=${() => this._openEdit(r)}>Edit</button><button class="modal-button" @click=${() => { this._confirmDelete = r; }}>Delete</button><button class="modal-button confirm" ?disabled=${!affordable || this._pending} @click=${() => this._redeem(r)}>Redeem</button></div></section></div>`; }
    _formModal() { return b `<ha-dialog open heading=${this._editing ? "Edit Reward" : "Add Reward"} @closed=${this._closeActiveModal}><ha-form .hass=${this._hass} .schema=${this._formSchema} .data=${this._form} @value-changed=${(e) => this._form = { ...this._form, ...e.detail.value }}></ha-form>${this._error ? b `<div class="error" role="alert">${this._error}</div>` : A}<button slot="secondaryAction" @click=${this._closeActiveModal}>Cancel</button><button slot="primaryAction" ?disabled=${this._pending} @click=${() => this._save()}>Save</button></ha-dialog>`; }
    _deleteModal(r) { return b `<div class="modal-overlay" role="presentation" @click=${this._closeActiveModal}><section class="modal-content" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" @click=${(e) => e.stopPropagation()}><div class="modal-header" id="delete-dialog-title">Delete ${r.name}?</div><div class="modal-body">This action cannot be undone.</div><div class="modal-actions"><button class="modal-button" @click=${this._closeActiveModal}>Cancel</button><button class="modal-button confirm" ?disabled=${this._pending} @click=${() => this._delete(r)}>Delete</button></div></section></div>`; }
};
PointsBotPersonRewardsCard.styles = i$3 `
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
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_config", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_hass", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_detail", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_editing", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_formOpen", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_confirmDelete", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_form", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_error", void 0);
__decorate([
    r()
], PointsBotPersonRewardsCard.prototype, "_pending", void 0);
PointsBotPersonRewardsCard = __decorate([
    t("pointsbot-person-rewards-card")
], PointsBotPersonRewardsCard);
//# sourceMappingURL=pointsbot-cards.js.map
