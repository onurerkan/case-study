import { LitElement, html, css } from "lit";
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class NotFound extends LitElement {
    static styles = css`
        :host {
        display: block;
        padding: 1em;
        }
    `;
    
    constructor(){
        super();
        updateWhenLocaleChanges(this);
    }
    render() {
        return html`
        <h1>${msg('Not Found')}</h1>
        <p>${msg('Sorry, the page you are looking for does not exist')}</p>
        `;
    }
}
customElements.define('not-found', NotFound);