import { expect, fixture, html } from "@open-wc/testing";
import { assert } from "chai";
import './data-table.js';
import sinon from "sinon";

describe('Datatable', () => {

    it('should defined', async () => {
        const el = document.createElement('data-table');
        const dataTableCls = customElements.get('data-table');
        assert.instanceOf(el, dataTableCls);
    });

    let el;

    beforeEach(async () => {
        el = await fixture(html`<data-table></data-table>`);
    });

    it('should work with default attributes', () => {
        expect(el.employees).to.be.an('array').that.is.empty;
        expect(el.layout).to.equal('table');
    });

    it('should render "No record." message when there is no data', () => {
        const noRecord = el.shadowRoot.querySelector('div');
        expect(noRecord).to.exist;
        expect(noRecord.textContent.trim()).to.equal('No record.');
    });

    it('should render a table when layout is table with mock data', async () => {
        el.employees = [
            {
                'name' : 'Ahmet',
                'surname' : 'Sourtimes',
                'email' : 'ahmet@sourtimes.org',
                'dateOfBirth' : '10/10/1990',
                'dateOfEmployement': '28/11/2024',
                'phone': '+(90) 532 123 45 67',
                'department' : 'Tech',
                'position' : 'Senior'
            }
        ];
        el.layout = 'table';
        await el.updateComplete;

        const table = el.shadowRoot.querySelector('.table-container');
        expect(table).to.exist;

        const rows = table.querySelectorAll('tbody tr');
        expect(rows.length).to.equal(1);
        const cells = rows[0].querySelectorAll('td');
        expect(cells[1].textContent).to.equal('Ahmet');
        expect(cells[2].textContent).to.equal('Sourtimes');
    });

    it('should render a block when layout is block with mock data', async () => {
        el.employees = [
            {
                'name' : 'Ahmet',
                'surname' : 'Sourtimes',
                'email' : 'ahmet@sourtimes.org',
                'dateOfBirth' : '10/10/1990',
                'dateOfEmployement': '28/11/2024',
                'phone': '+(90) 532 123 45 67',
                'department' : 'Tech',
                'position' : 'Senior'
            }
        ];
        el.layout = 'block';
        await el.updateComplete;

        const block = el.shadowRoot.querySelector('.block-container');
        expect(block).to.exist;

        const blockItems = block.querySelectorAll('.block-item');
        expect(blockItems.length).to.equal(1);


        const blockItem = blockItems[0].querySelector('.bold');
        expect(blockItem.textContent).to.equal('Ahmet Sourtimes');
    });


    it('should dispatch "datatable-action" event when delete button clicked', async () => {
        const spy = sinon.spy();
        el.addEventListener('datatable-action', spy);
    
        el.employees = [
            {
                'name' : 'Ahmet',
                'surname' : 'Sourtimes',
                'email' : 'ahmet1@sourtimes.org',
                'dateOfBirth' : '10/10/1990',
                'dateOfEmployement': '28/11/2024',
                'phone': '+(90) 532 123 45 67',
                'department' : 'Tech',
                'position' : 'Senior'
            }
        ];
        await el.updateComplete;
    
        const deleteBtn = el.shadowRoot.querySelector('.delete-btn');
        deleteBtn.click();
    
        expect(spy.calledOnce).to.be.true;
        const eventDetail = spy.getCall(0).args[0].detail;
        expect(eventDetail).to.deep.equal({ action: 'delete', itemId: 'ahmet1@sourtimes.org' });

      });


      it('should dispatch "datatable-action" event when edit button clicked', async () => {
        const spy = sinon.spy();
        el.addEventListener('datatable-action', spy);
    
        el.employees = [
            {
                'name' : 'Ahmet',
                'surname' : 'Sourtimes',
                'email' : 'ahmet1@sourtimes.org',
                'dateOfBirth' : '10/10/1990',
                'dateOfEmployement': '28/11/2024',
                'phone': '+(90) 532 123 45 67',
                'department' : 'Tech',
                'position' : 'Senior'
            }
        ];
        await el.updateComplete;
    
        const deleteBtn = el.shadowRoot.querySelector('.edit-btn');
        deleteBtn.click();
    
        expect(spy.calledOnce).to.be.true;
        const eventDetail = spy.getCall(0).args[0].detail;
        expect(eventDetail).to.deep.equal({ action: 'edit', itemId: 'ahmet1@sourtimes.org' });

      });

      it('should display No Record. when there is no data', async ()  => {
        el.employees = [];
        await el.updateComplete;

        const noRecord = el.shadowRoot.querySelector('div');
        expect(noRecord).to.exist;
        expect(noRecord.textContent).to.equal('No record.');

      });

});