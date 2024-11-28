import { LitElement, html, css } from "lit";
import "../icon-element/icon-element.js";
import { repeat } from "lit/directives/repeat.js";
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class DataTable extends LitElement{

    static styles = css`
    :host{
        height:100%;
    }
    .table-container {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow-x: auto;
        margin-top:2rem;
    }
    .table-container .employee-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        background-color: #ffffff;
    }
    .table-container .employee-table input[type="checkbox"] {
        width: 16px;
        height: 16px;
        outline: 1.5px solid #B9B4B4;
        border-radius: 30%;
        appearance: none;
        -moz-appearance:none;
        -webkit-appearance:none;
        -o-appearance:none;
    }
    .table-container .employee-table th,
    .employee-table td {
        padding: 12px;
    }
    .table-container .employee-table thead th {
        color:#FF6200;
        font-size: .7rem;
        font-family: var(--font-regular);
    }
    .table-container .employee-table tbody tr{
        border-bottom: 1px solid #f7f7f7;
        height: 60px;
        text-align: center;
        font-size: .8rem;
    }
    .table-container .employee-table tbody tr:hover {
        background-color: #f7f7f7;
        cursor: pointer;
    }
    .table-container .employee-table tbody tr td:nth-child(2),
    tr td:nth-child(3){
        color:#0E121A;
    }
    .form-actions{
        display: table;
        margin-left: auto;
        margin-right: auto;
    }
    .form-actions .edit-btn{
        float:left;
    }
    .form-actions .delete-btn{
        float:left;
        margin-left:10px;
    }   
    .block-container{
        overflow-x:auto;
        margin-top:2rem;
        display:flex;
        gap: 1rem;   
    }
    .block-container .block-item{
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color:#ffffff;
        padding: 1rem;
        flex:1;
    }
    .bold{
        font-family: var(--font-semi-bold);
    }
    .title{
        font-size:.8rem;
    }
    .text{
        font-size:.9rem;
    }
    .edit-btn{
        cursor: pointer;
    }
    .delete-btn{
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .table-container {
          border-radius: 0;
          box-shadow: none;
        }
        .employee-table {
          font-size: 0.9rem;
        }
        .employee-table th, .employee-table td {
          padding: 8px;
        }
        .employee-table th {
          font-size: 0.85rem;
        }
        .employee-table td {
          word-wrap: break-word;
        }
    }

    @media (max-width: 480px) {
        .employee-table thead {
          display: none;
        }
        .employee-table tbody td {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.5rem;
          border: none;
        }
        .employee-table tbody td::before {
          content: attr(data-label);
          font-weight: bold;
          display: inline-block;
          width: 50%;
        }
        .employee-table tr {
          margin-bottom: 1rem;
          border-bottom: 1px solid #ddd;
        }
    }
      `;
    
    static properties = {
        employees : { type: Array, attribute: false },
        layout: { type : String }
    };

    constructor(){
        super();
        this.employees = [];
        this.layout = 'table';
        updateWhenLocaleChanges(this);
    }

    deleteItem(itemId){
        const deleteEvent = new CustomEvent('datatable-action', {
            detail: {'action' : 'delete', itemId},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(deleteEvent);
    }

    editItem(itemId){
        const editEvent = new CustomEvent('datatable-action', {
            detail: {'action' : 'edit', itemId},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(editEvent);
    }

    render(){
        return this.employees.length > 0 ? 

                    this.layout === 'block' ? 

                    html`
                        <div class="block-container">
                            ${ repeat( this.employees, (_, index) => index,
                                    (employee, _) => html`
                                        <div class="block-item">
                                            <div class="bold">${employee.name} ${employee.surname}</div>
                                            <div>
                                                <div class="title">${msg('Date of Employment')}</div>
                                                <div class="text">${employee.dateOfEmployment}</div>
                                            </div>
                                             <div>
                                                <div class="title">${msg('Date of Birth')}</div>
                                                <div class="text">${employee.dateOfBirth}</div>
                                            </div>
                                            <div class="text">${employee.phone}</div>
                                            <div class="text">${employee.email}</div>
                                            <div class="text">${employee.department}</div>
                                            <div class="text">${employee.position}</div>
                                            <div class="form-actions">
                                                <div class="edit-btn" @click="${() => this.editItem(employee.email)}">
                                                    <icon-element name="edit" color="#FF6200" size="16"></icon-element>
                                                </div>
                                                <div class="delete-btn" @click="${() => this.deleteItem(employee.email)}">
                                                    <icon-element name="delete" color="#FF6200" size="16"></icon-element>
                                                </div>
                                            </div>
                                        </div>
                                `)}

                        </div>
                    
                    ` :

                    html`
                        <div class="table-container">
                                <table class="employee-table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" name="select_all"/></th>
                                        <th>${msg('First Name')}</th>
                                        <th>${msg('Last Name')}</th>
                                        <th>${msg('Date of Employment')}</th>
                                        <th>${msg('Date of Birth')}</th>
                                        <th>${msg('Phone')}</th>
                                        <th>${msg('Email')}</th>
                                        <th>${msg('Department')}</th>
                                        <th>${msg('Position')}</th>
                                        <th>${msg('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${ repeat( this.employees, (_, index) => index,
                                    (employee, _) => html`
                                    <tr>
                                        <td data-label="Select All"><input type="checkbox" name="select_all"/></td>
                                        <td data-label="First Name">${employee.name}</td>
                                        <td data-label="Last Name">${employee.surname}</td>
                                        <td data-label="Date of Employment">${employee.dateOfEmployment}</td>
                                        <td data-label="Date of Birth">${employee.dateOfBirth}</td>
                                        <td data-label="Phone">${employee.phone}</td>
                                        <td data-label="Email">${employee.email}</td>
                                        <td data-label="Department">${msg(employee.department)}</td>
                                        <td data-label="Position">${msg(employee.position)}</td>
                                        <td data-label="Actions">
                                            <div class="form-actions">

                                                <div class="edit-btn" @click="${() => this.editItem(employee.email)}">
                                                    <icon-element name="edit" color="#FF6200" size="16"></icon-element>
                                                </div>
                                                <div class="delete-btn" @click="${() => this.deleteItem(employee.email)}">
                                                    <icon-element name="delete" color="#FF6200" size="16"></icon-element>
                                                </div>
                                            </div>
                                            
                                        </td>
                                    </tr>`
                                    )}
                                </tbody>
                                </table>
                            </div>
                    `
                    : html`<div>${msg('No record.')}</div>`;
    }
}

customElements.define('data-table', DataTable);