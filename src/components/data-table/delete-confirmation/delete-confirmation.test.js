import { fixture, expect, html } from "@open-wc/testing";
import './delete-confirmation.js';
import { assert } from "chai";
import sinon from "sinon";

describe('Delete confirmation', () => {

    it('should defined', () => {
        const el = document.createElement('delete-confirmation');
        const deleteConfrmCls = customElements.get('delete-confirmation');
        assert.instanceOf(el, deleteConfrmCls);
    })

    let el;

    beforeEach(async () => {
        el = await fixture(html`<delete-confirmation></delete-confirmation>`);
    });

    it('should works with default values', async () => {

        expect(el.isModalOpen).to.be.false;
        expect(el.message).to.equal('');
    });

    it('should not render modal when isModalOpen is false', async () => {
        el.isModalOpen = false;
        el.message = 'Modal delete message mock';
        await el.updateComplete;

        const modal = el.shadowRoot.querySelector('.modal');
        expect(modal).to.be.null;
    });

    it('should render when isModalOpen is true', async () => {
        el.isModalOpen = true;
        el.updateComplete;
        await el.updateComplete;

        const modal = el.shadowRoot.querySelector('.modal');
        expect(modal).to.exist;

        const proceedBtn = el.shadowRoot.querySelector('button:not(.cancel)');
        expect(proceedBtn.textContent).to.equal('Proceed');

        const cancelBtn = el.shadowRoot.querySelector('button.cancel');
        expect(cancelBtn.textContent).to.equal('Cancel');

    });

    it('should dispatch delete-component-changed event when proceed button is clicked', async () => {
        const spy = sinon.spy();
        el.addEventListener('delete-component-changed', spy);
        el.isModalOpen = true;
        await el.updateComplete;

        const proceedBtn = el.shadowRoot.querySelector('button:not(.cancel)');
        proceedBtn.click();
        expect(spy.calledOnce).to.be.true;
        const eventDetail = spy.getCall(0).args[0].detail;
        expect(eventDetail).to.deep.equal({'status' : 'confirm'});
    });

    it('should dispatch delete-component-changed event when close button is clicked', async () => {
        const spy = sinon.spy();
        el.addEventListener('delete-component-changed', spy);
        el.isModalOpen = true;
        await el.updateComplete;

        const proceedBtn = el.shadowRoot.querySelector('button.cancel');
        proceedBtn.click();
        expect(spy.calledOnce).to.be.true;
        const eventDetail = spy.getCall(0).args[0].detail;
        expect(eventDetail).to.deep.equal({'status' : 'close'});
    });



});