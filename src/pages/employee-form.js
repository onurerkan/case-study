import { LitElement, html, css } from "lit";
import { connect } from 'pwa-helpers';
import { store } from '../store/store.js';
import { addEmployee, updateEmployee } from '../store/actions.js';
import '../components/employee-record/employee-record.js';
import { Router } from '@vaadin/router';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class EmployeeForm extends connect(store)(LitElement) {
    static styles = css`
        :host {
            display: block;
            padding: 1em;
        }
    `;

    static properties = {
        employeeId : { type: Number },
        employee: { type: Object },
        employees : { type : Array },
        formErrorMessage : { type : String }
    }

    constructor(){
        super();
        this.employeeId = -1;
        this.employee = {};
        this.employees = [];
        this.formErrorMessage = '';
        updateWhenLocaleChanges(this);
    }
    
    onBeforeEnter(location){
        const employeeId = parseInt(location.params.id)
        if(typeof employeeId === 'number' && !isNaN(employeeId)){
            this.employeeId = employeeId;
        }
    }

    stateChanged(state){
        this.employees = state.employees || [];
        this.employee = this.employees.filter((_, i) => i === this.employeeId)[0] || {};
    }

    connectedCallback(){
        super.connectedCallback();
        this._boundDataHandler = this._dataHandler.bind(this);
        window.addEventListener('employee-record-success', this._boundDataHandler);
    }

    disconnectedCallback(){
        super.disconnectedCallback();
        window.removeEventListener('employee-record-success', this._boundDataHandler);
    }

    _dataHandler(event){
        if(event.detail.status === 'confirm'){
            const employeeData = event.detail.data;
            if(this.employeeId === -1){
                // New record.
                const isEmailUnique = this._checkEmailIsUnique(employeeData.email);
                if(isEmailUnique.length > 0){
                    alert(msg('Email is already registered.'));
                    return false;
                }else{
                    store.dispatch(addEmployee(employeeData));   
                    Router.go('/');
                }
                             
            }else{
                // Email should be unique otherwise system will not work.
                // Update.
                const isEmailUnique = this._checkEmailIsUnique(employeeData.email, this.employeeId);
                if(isEmailUnique.length > 0){
                    alert(msg('Email is already registered.'));
                    return false;
                }else{
                    const payload = {'id': this.employeeId, data: employeeData};
                    store.dispatch(updateEmployee(payload));
                    Router.go('/');
                }
                
            }
            
            
        }   
    }

    _checkEmailIsUnique(email, userId){
        return this.employees.filter((employee, index) =>
            (userId === undefined || index !== userId) && employee.email === email
        );
    }

    render() {
        return html`
        <h1>${msg('Employee Form')}</h1>
        <employee-record 
            .name="${this.employee.name || ''}" 
            .surname="${this.employee.surname || ''}"
            .phone="${this.employee.phone || ''}"
            .email="${this.employee.email || ''}"
            .dateOfBirth="${this.employee.dateOfBirth || ''}"
            .dateOfEmployment="${this.employee.dateOfEmployment || ''}"
            .department="${this.employee.department || ''}"
            .position="${this.employee.position || ''}"
        >
        </employee-record>
        `;
    }
}
customElements.define('employee-form', EmployeeForm);