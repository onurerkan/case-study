import { fixture, expect, html } from '@open-wc/testing';
import './icon-element.js';
import { assert } from 'chai';

describe('Icon element', () => {

    it('should defined', () => {
        const el = document.createElement("icon-element");
        const IconElementCls = customElements.get('icon-element'); 
        assert.instanceOf(el, IconElementCls);
    })

    it('should renders a icon with name', async() => {
        const el = await fixture(html`<icon-element name="edit"></icon-element>`);
        const svg = el.shadowRoot.querySelector('svg');
        expect(svg).to.exist;
    });

    it('should render nothing when name is not match with list', async() => {
        const el = await fixture(html`<icon-element name="unknown-icon"></icon-element>`)
        const svg = el.shadowRoot.querySelector('svg');
        expect(svg).to.equal(null);
    })

});