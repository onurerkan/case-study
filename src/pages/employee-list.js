import { LitElement, html, css } from "lit";
import '../components/data-table/data-table.js';
import '../components/data-table/delete-confirmation/delete-confirmation.js';
import '../components/data-table/pagination/data-table-pagination.js';
import { connect } from "pwa-helpers";
import { store } from '../store/store.js';
import { deleteEmployee } from '../store/actions.js';
import { Router } from '@vaadin/router';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import "../components/icon-element/icon-element.js";

class EmployeeList extends connect(store)(LitElement) {
    static styles = css`
        :host {
            display: block;
            padding: 1em;
        }
        .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #FF6200;
        }
        .content-header .header-text {
            font-size: 1.2rem;
            font-family: var(--font-medium);
        }
        .content-header .header-view-select {
            display: flex;
            gap: 1rem;
        }
        .view-select{
            cursor:pointer;
        }
    `;

    static properties = {
        employees : { type: Array },
        employeesRef : { type: Array },
        isModalOpen: { type: Boolean },
        popupMessage: { type: String },
        willBeDeletedEmployeeId : { type : String },
        currentPage : { type: Number },
        totalPage : { type: Number },
        layout : { type : String }
    }

    constructor(){
        super();
        this.isModalOpen = false;
        this.popupMessage = '';
        this.willBeDeletedEmployeeId = '';
        this.currentPage = 1;
        this.totalDataCount = 0;
        this.totalVisibleItem = 4;
        this.totalPage = 0;
        this.layout = 'table';
        updateWhenLocaleChanges(this);
    }

    stateChanged(state){
        this.employeesRef = state.employees || [];
        this.totalDataCount = this.employeesRef.length;
        this.totalPage = Math.ceil(this.totalDataCount / this.totalVisibleItem);
        const start = (this.currentPage - 1) * this.totalVisibleItem;
        this.employees = state.employees.slice(start, start + this.totalVisibleItem);   
    }

    connectedCallback(){
        super.connectedCallback();
        this._boundDataTableDataHandler = this._datatableEventHandler.bind(this);
        window.addEventListener('datatable-action', this._boundDataTableDataHandler);
        this._boundDeleteComponentDataHandler = this._deleteComponentHandler.bind(this);
        window.addEventListener('delete-component-changed', this._boundDeleteComponentDataHandler);
        this._boundPaginationComponentDataHandler = this._loadCurrentPageData.bind(this);
        window.addEventListener('pagination-component-changed', this._boundPaginationComponentDataHandler);

    }
    disconnectedCallback(){
        super.disconnectedCallback();
        window.removeEventListener('datatable-action', this._boundDataTableDataHandler);
        window.removeEventListener('delete-component-changed', this._boundDeleteComponentDataHandler);
        window.removeEventListener('pagination-component-changed', this._boundPaginationComponentDataHandler);
    }

    _datatableEventHandler(event){
        
        if(event.detail.action === 'delete'){
            this.isModalOpen = true;
            this.willBeDeletedEmployeeId = event.detail.itemId;
            const selectedEmployee = this.employees.find((employee) => employee.email === this.willBeDeletedEmployeeId);
            if(selectedEmployee){
                this.popupMessage = msg(html`Selected employee record of ${selectedEmployee.name} ${selectedEmployee.surname} will be deleted.`);
            }
        }
        if(event.detail.action === 'edit'){
            const employeeEmail = event.detail.itemId;
            const employeeId = this.employeesRef.findIndex((employee) => employee.email === employeeEmail)
            Router.go(`/form/${employeeId}`);
        }

        
    }

    _deleteComponentHandler(event){
        // status -> close || confirm
        if(event.detail.status === 'confirm'){
            store.dispatch(deleteEmployee(this.willBeDeletedEmployeeId));
            this.totalDataCount = this.employeesRef.length;
            this.totalPage = Math.ceil(this.totalDataCount / this.totalVisibleItem);
            if(this.totalPage < this.currentPage){
                this.currentPage = this.currentPage - 1;
            }
            this._updateCurrentData();
        }
        this.isModalOpen = false;
        this.willBeDeletedEmployeeId = '';
    }

    _loadCurrentPageData(event){
        // status, data (page_change), 1
        if(event.detail.status === 'page_change'){
            this.currentPage = event.detail.data;
            this._updateCurrentData();
        } 
    }

    _updateCurrentData(){
        const start = (this.currentPage - 1) * this.totalVisibleItem;
        this.employees = this.employeesRef.slice(start, start + this.totalVisibleItem);  
    }

    changePageLayout(e,layout){
        e.preventDefault();
        this.layout = layout;
    }
    
    render() {
        return html`
                <div class="content-header">
                    <div class="header-text" @click="${() => { this.isModalOpen = !this.isModalOpen}}">${msg('Employee List')}</div>
                    <div class="header-view-select">
                        <div class="view-select" @click="${(e) => { this.changePageLayout(e,'table');}}"><icon-element name="listView" color="#FF6200" size="24"></icon-element></div>
                        <div class="view-select" @click="${(e) => { this.changePageLayout(e,'block');}}"><icon-element name="blockView" color="#FF6200" size="24"></icon-element></div>
                    </div>
                </div>
                <data-table .employees="${this.employees}" .layout="${this.layout}"></data-table>
                <data-table-pagination .currentPage="${this.currentPage}" .totalCount="${this.totalDataCount}" .itemCount="${this.totalVisibleItem}" .totalPage=${this.totalPage}></data-table-pagination>
                <delete-confirmation .isModalOpen=${this.isModalOpen} .message=${this.popupMessage}></delete-confirmation>
        `;
    }
}

customElements.define('employee-list', EmployeeList);