import { fixture, expect, html } from "@open-wc/testing";
import './data-table-pagination.js';
import { assert } from "chai";
import sinon from "sinon";

describe('Datatable Pagination', () => {

    it('should defined' , ()=>{
        const el = document.createElement('data-table-pagination');
        const datatablePaginationCls = customElements.get('data-table-pagination');
        assert.instanceOf(el, datatablePaginationCls);
    })

    let el;

    beforeEach(async () => {
        el = await fixture(html`<data-table-pagination></data-table-pagination>`);
    });

    it('should have default attributes', () => {
        expect(el.currentPage).to.equal(1);
        expect(el.totalCount).to.equal(1);
        expect(el.itemCount).to.equal(1);
        expect(el.totalPage).to.equal(1);
    });

    it('should render view when values provided', () => {
        el.totalCount = 10;
        el.itemCount = 4;

        const paginationEl = el.shadowRoot.querySelector('.pagination');
        expect(paginationEl).to.exist;
    });

    it('should display correct number of page buttons', async () =>{
        el.totalCount = 10;
        el.itemCount = 4;
        el.currentPage = 1;
        el.totalPage = 3;

        await el.updateComplete;

        const paginationEl = el.shadowRoot.querySelectorAll('.page-btn');
        expect(paginationEl.length).to.equal(3);
    });

    it('should update selected page button when select', async () => {
        el.totalCount = 10;
        el.itemCount = 4;
        el.currentPage = 1;
        el.totalPage = 3;

        await el.updateComplete;
        const currentPageBtn = el.shadowRoot.querySelector('.page-btn.active');
        expect(currentPageBtn).to.exist;

        el.currentPage = 2;
        await el.updateComplete;
        const nextActivePageBtn = el.shadowRoot.querySelector('.page-btn.active');
        expect(nextActivePageBtn).to.exist;
        expect(nextActivePageBtn.textContent).to.equal('2');
    });

    it('should dispatch changePage event when page button is clicked', async () => {
        const spy = sinon.spy(el, 'changePage');

        el.totalCount = 10;
        el.itemCount = 4;
        el.currentPage = 2;
        el.totalPage = 3;
        await el.updateComplete;

        const pageBtns = el.shadowRoot.querySelectorAll('.page-btn');
        pageBtns[1].click();

        expect(spy.calledOnce).to.be.true;
        expect(spy.calledWithExactly(parseInt(pageBtns[1].textContent))).to.be.true;
    });

});