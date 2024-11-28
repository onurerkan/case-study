import { LitElement, html, css } from "lit";
import { icons } from "../../utils/icons.js";

class IconElement extends LitElement {

    static styles = css`
        :host {
            display: inline-block;
            width: var(--icon-size);
            height: var(--icon-size);
            --icon-color: #FF6200
        }
        svg {
            width: 100%;
            height: 100%;
            fill: var(--icon-color);
            stroke: var(--icon-color);
            color: var(--icon-color);
        }
    `;

    static properties = {
        name: { type: String },
        size: { type: Number },
        color: { type: String },
    };

    updated(changedProperties) {
        if (changedProperties.has('color')) {
            this.style.setProperty('--icon-color', this.color);
        }
        if (changedProperties.has('size')) {
            this.style.setProperty("--icon-size", `${this.size}px`)
        }
    }

    constructor() {
        super();
        this.name = '';
        this.size = 24;
        this.color = '#FF6200';
    }

    render(){
        const icon = icons[this.name] || '';
        return html`${icon}`;
    }
}

customElements.define('icon-element', IconElement);