import { LitElement, html ,css } from "lit";
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class EmployeeRecord extends LitElement{

    static styles = css`
        :host {
            display: block;
            font-family: var(--font-regular);
        }

        form {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            max-width: 600px;
            margin: auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            background: #fff;
        }

        .error {
            color: red;
            margin-bottom: 1rem;
            padding: 0.5rem;
            border: 1px solid red;
            border-radius: 5px;
            background-color: #ffe6e6;
            width: 100%;
        }

        .error-messages ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        label {
            font-weight: bold;
            margin-bottom: 0.5rem;
        }

        .form-group {
            flex: 1 1 calc(50% - 1rem);
            display: flex;
            flex-direction: column;
        }

        .form-group.full-width {
            flex: 1 1 100%;
        }

        input, select {
            width: 100%;
            height: 2rem;
            margin-top: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-family: var(--font-regular);
            outline-color: #FF6200;
        }

        .dropdown-multiple {
            height: 2.5rem;
        }

        button {
            margin-top: 1rem;
            padding: 0.7rem;
            width: 100%;
            border: none;
            background-color: #FF6200;
            color: white;
            border-radius: 3px;
            cursor: pointer;
        }

        @media (max-width: 480px) {
            .form-group {
                flex: 1 1 100%;
            }
            input, select {
                width: 50%;
            }
        }
    `;

    static properties = {
        name : { type : String },
        surname : { type :  String },
        dateOfEmployment: { type : Date },
        dateOfBirth : { type : String},
        phone : { type : String },
        email : { type : String },
        department : { type : String },
        position : { type : String },
        departmentList : { type : Array},
        positionList : { type : Array},
        formErrors : { type : Array }, 
    }

    constructor(){
        super();
        this.name = '';
        this.surname = '';
        this.dateOfEmployment = '';
        this._dateOfEmployment = null;
        this.dateOfBirth = '';
        this._dateOfBirth = null;
        this.phone = '';
        this._phone = '';
        this.email = '';
        this.department = '';
        this.position = '';
        this.departmentList = [msg('Analytics'), msg('Tech')];
        this.positionList = [msg('Junior'), msg('Medior'), msg('Senior')];
        this.formErrors = [];
        updateWhenLocaleChanges(this);
    }

    get dateOfEmployment(){
        return this._dateOfEmployment;
    }

    set dateOfEmployment(value){
        if(value === ''){
            this._dateOfEmployment = new Date();
        }else{
            this._dateOfEmployment = this._dateConvertor(value);
        }
        this.requestUpdate('dateOfEmployment', this._dateOfEmployment);
    }

    get dateOfBirth(){
        return this._dateOfBirth;
    }

    set dateOfBirth(value){
        if(value === ''){
            this._dateOfBirth = new Date();
        }else{
            this._dateOfBirth = this._dateConvertor(value);
        }
        
        this.requestUpdate('dateOfBirth', this._dateOfBirth);
    }

    get phone(){
        return this._phone;
    }

    set phone(value){
        this._phone = value.replace(/[\s()]/g, '');
        this.requestUpdate('phone', this._phone);
    }

    _dateConvertor(dateStr){
        if(!dateStr){
            return new Date();
        }
        const [ day, month, year ] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`);
    }

    _dateConvertorForDB(dateStr){
        if(!dateStr){
            return null;
        }
        const [ year, month, day ] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    _phoneConvertorForDB(phoneStr){
        if(!phoneStr){
            return null;
        }
        return phoneStr.replace(/^\+(\d+)(\d{3})(\d{3})(\d{2})(\d{2})$/, "+($1) $2 $3 $4 $5");
    }


    _formValidations(form){

        const errors = [];

        if(form.name.length < 3){
            errors.push(msg('Name should contains at least 3 chars.'));
        }

        if(form.surname.length < 2){
            errors.push(msg('Last name should contains at least 2 chars.'));
        }

        if(form.dateOfEmployment.length < 1){
            errors.push(msg('Date of empleyment can not be empty.'));
        }

        if(form.dateOfBirth.length < 1){
            errors.push(msg('Date of birth can not be empty.'));
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(form.email)){
            errors.push(msg('Email should follow name@domain.com format.'));
        }

        const phonePattern = /^\+90\d{10}$/;
        if(!phonePattern.test(form.phone)){
            errors.push(msg('Phone number should follow +905XXXXXXXXX format.'));
        }

        return errors;


    }

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;

        // Imperative else event-based @input="fn"
        let formData = {
            'name' : form.name.value,
            'surname' : form.surname.value,
            'dateOfEmployment': this._dateConvertorForDB(form.dateOfEmployment.value),
            'dateOfBirth': this._dateConvertorForDB(form.dateOfBirth.value),
            'email': form.email.value,
            'phone': form.phone.value,
            'department': form.department.value,
            'position': form.position.value
        }

        const formCheckErrors = this._formValidations(formData);
        if(formCheckErrors.length > 0){
            this.formErrors = [...this.formErrors, ...formCheckErrors];
            setTimeout(() => {
                    this.formErrors = [];
            },5000)
        }else{
            // Success.
            this.formErrors = [];
            formData["phone"] = this._phoneConvertorForDB(form.phone.value)
            const recordFormEvent = new CustomEvent('employee-record-success', {
                detail : {'status' : 'confirm', data: formData},
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(recordFormEvent);
        }
    }

    render() {

        return html`
            <form @submit="${(e) => { this.handleSubmit(e);}}">
                ${this.formErrors && this.formErrors.length > 0
                        ? html`
                            <div class="error">
                                <ul>
                                    ${this.formErrors.map(
                                        (error) => html`<li>${msg(error)}</li>`
                                    )}
                                </ul>
                            </div>
                        `
                        : ''}
                <div class="form-group">
                    <label for="name">${msg('First Name')}</label>
                    <input type="text" id="name" required .value="${this.name}" />
                </div>

                <div class="form-group">
                    <label for="surname">${msg('Last Name')}</label>
                    <input type="text" id="surname" required .value="${this.surname}" />
                </div>

                <div class="form-group">
                    <label for="dateOfEmployment">${msg('Date of Employment')}</label>
                    <input type="date" id="dateOfEmployment" required  .value="${this.dateOfEmployment ? this.dateOfEmployment.toISOString().split('T')[0] : ''}"/>
                </div>

                <div class="form-group">
                    <label for="dateOfBirth">${msg('Date of Birth')}</label>
                    <input type="date" id="dateOfBirth" required .value="${this.dateOfBirth ? this.dateOfBirth.toISOString().split('T')[0] : ''}" />
                </div>

                <div class="form-group">
                    <label for="phone">${msg('Phone Number')}</label>
                    <input type="tel" id="phone" required .value="${this.phone}" placeholder="+905XX" />
                </div>

                <div class="form-group">
                    <label for="email">${msg('Email Address')}</label>
                    <input type="email" id="email" required .value="${this.email}" />
                </div>

                <div class="form-group full-width">
                    <label for="departments">${msg('Department')}</label>
                    <select id="departments" name="department" @change="${this.handleDepartmentChange}" class="dropdown-multiple">
                        ${this.departmentList.map(
                            (dept) => html`<option value="${dept}" ?selected=${this.department === dept}>${dept}</option>`
                        )}
                    </select>
                </div>

                <div class="form-group full-width">
                    <label for="positions">${msg('Position')}</label>
                    <select id="positions" name="position" @change="${this.handlePositionChange}" class="dropdown-multiple">
                        ${this.positionList.map(
                            (position) => html`<option value="${position}" ?selected=${this.position === position}>${position}</option>`
                        )}
                    </select>
                </div>

                <button type="submit">${msg('Submit')}</button>
            </form>
        `;
    }
}

customElements.define('employee-record', EmployeeRecord);