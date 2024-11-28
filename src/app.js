import { LitElement, html, css } from "lit";
import './components/app-header/app-header.js';
import { store } from './store/store.js';
import { connect } from "pwa-helpers";

class App extends connect(store)(LitElement) {
    static styles = css`
        :host {
        display: block;
        padding: 1em;
        }
    `;
    
    render() {
        return html`
        <app-header></app-header>
        <main>
            <slot></slot>
        </main>
        
        `;
    }
}
customElements.define('lit-app', App);