import { expect, fixture, html } from "@open-wc/testing";
import { assert } from "chai";
import './employee-record.js';
import sinon from "sinon";

describe('Employee Record', () => {

    it('should defined', async () => {
        const el = document.createElement('employee-record');
        const dataTableCls = customElements.get('employee-record');
        assert.instanceOf(el, dataTableCls);
    });

    let el;

    beforeEach(async () => {
        el = await fixture(html`<employee-record></employee-record>`);
    });

    it('should work with default attributes', async () => {
        expect(el.name).to.equal('');
        expect(el.surname).to.equal('');
        expect(el.dateOfEmployment).to.equal(null);
        expect(el.dateOfBirth).to.equal(null);
        expect(el.phone).to.equal('');
        expect(el.email).to.equal('');
        expect(el.department).to.equal('');
        expect(el.position).to.equal('');
        expect(el.departmentList).to.deep.equal(['Analytics', 'Tech']);
        expect(el.positionList).to.deep.equal(['Junior', 'Medior', 'Senior']);
        expect(el.formErrors).to.be.an('array').that.is.empty;
    });


    it('should render form with all parts', async () => {
        const form = el.shadowRoot.querySelector('form');
        expect(form).to.exist;
    
        const inputs = form.querySelectorAll('input');
        expect(inputs.length).to.equal(6);
    
        const selects = form.querySelectorAll('select');
        expect(selects.length).to.equal(2);
    
        const submitBtn = form.querySelector('button[type="submit"]');
        expect(submitBtn).to.exist;
        expect(submitBtn.textContent).to.equal('Submit');
      });

      it('should validate form with error messages', async () => {
        const form = el.shadowRoot.querySelector('form');
    
        form.querySelector('#name').value = 'Ah';
        form.querySelector('#surname').value = 'S';
        form.querySelector('#email').value = 'ahmet1';
        form.querySelector('#phone').value = '532123';
        form.querySelector('#dateOfEmployment').value = '2022-01-01';
        form.querySelector('#dateOfBirth').value = '2022-01-01';

        form.querySelectorAll('input').forEach((input) => {
            input.dispatchEvent(new Event('input'));
        });
    
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
        await el.updateComplete;
    
        expect(el.formErrors).to.not.be.empty;
        expect(el.formErrors.length).to.be.above(0);
    
        const errorDom = el.shadowRoot.querySelector('.error');

        expect(errorDom).to.exist;
        expect(errorDom.textContent).to.include('Name should contains at least 3 chars.');
        expect(errorDom.textContent).to.include('Last name should contains at least 2 chars.');
        expect(errorDom.textContent).to.include('Email should follow name@domain.com format.');
        expect(errorDom.textContent).to.include('Phone number should follow +905XXXXXXXXX format.');
      });

    it('should convert phone number correctly for save', () => {
        const phoneStr = '+905321234567';
        const convertedPhone = el._phoneConvertorForDB(phoneStr);

        expect(convertedPhone).to.equal('+(90) 532 123 45 67');
      });
    
      it('should convert date correctly for save', () => {
        const dateStr = '2022-01-01';
        const convertedDate = el._dateConvertorForDB(dateStr);

        expect(convertedDate).to.equal('01/01/2022');
      });
    

});