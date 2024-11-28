import { fixture, expect, html } from '@open-wc/testing';
import './app-header.js';
import { Router } from '@vaadin/router';
import sinon from 'sinon';

describe('app-header', () => {

    it('should render the header', async () => {
        const el = await fixture(html`<app-header></app-header>`);
        expect(el).shadowDom.to.equalSnapshot();
    });


    it('should navigates to / when Employee List clicked', async () => {

        const el = await fixture(html`<app-header></app-header>`);
        const employeeListButton = el.shadowRoot.querySelector('.action-btn:nth-child(1)');
        const routerStub = sinon.stub(Router, 'go');

        employeeListButton.click();
        expect(routerStub.calledOnceWith('/')).to.be.true;
        routerStub.restore();

    });

    it('should navigates to /form when Add New clicked', async ()=> {
        const el = await fixture(html`<app-header></app-header>`);
        const addNewButton = el.shadowRoot.querySelector('.action-btn:nth-child(2)');
        const routerStub = sinon.stub(Router, 'go');

        addNewButton.click();        
        expect(routerStub.calledOnceWith('/form')).to.be.true;
        routerStub.restore();
    });

    it('should change color if nav employee list item is active', async () => {
        const el = await fixture(html`<app-header></app-header>`);
        const employeeListButtonIcon = el.shadowRoot.querySelector('icon-element[name="employees"]')

        el.currentPath = '/';
        await el.updateComplete;
        expect(employeeListButtonIcon.color).to.be.equal('#FF6200');


        el.currentPath = '/form';
        await el.updateComplete;
        expect(employeeListButtonIcon.color).to.be.equal('#FFBD94');

    });

    it('should color is not active for Add New when page is home' , async () => {
        const el = await fixture(html`<app-header></app-header>`);
        const addNewButtonIcon = el.shadowRoot.querySelector('icon-element[name="add"]');

        el.currentPath = '/';
        el.updateComplete;

        expect(addNewButtonIcon.color).to.be.equal('#FFBD94')
    });

    it('should respond vaadin-router-location-changed event', async () => {
        const el = await fixture(html`<app-header></app-header>`);

        const mockEvent = new CustomEvent(
            'vaadin-router-location-changed',
            {
                'detail': {
                    'location': {
                        'pathname': '/form'
                    }
                }
            }
        );

        window.dispatchEvent(mockEvent);
        expect(el.currentPath).to.equal('/form');
    });

});