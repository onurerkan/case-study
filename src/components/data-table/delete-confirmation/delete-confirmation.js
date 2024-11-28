import { LitElement, html, css } from "lit";
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class DeleteConfirmation extends LitElement{

    static styles = css`
        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1rem;
            background: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 10;
            display:flex;
            flex-direction: column;
        }
        .modal-bg{
            width: 100%;
            height: 100%;
            position: fixed;
            background-color: #000000;
            top: 0;
            left: 0;
            opacity: 0.3;
        }
        .modal-header{
            width:100%;
            color:#FF6200;
            font-family:var(--font-semi-bold);
            font-size:1rem;
            margin-bottom: 1rem;
            display:flex;
            gap: 1rem;
        }
        .modal-header .msg{
            flex:1;
        }
        .modal-header .btn{
            cursor: pointer;
        }
        .modal-text{
            font-family:var(--font-regular);
            font-size:.8rem;
            color:#0E121A;
            margin-bottom:1rem;
        }
        :host button{
            border: 0;
            background-color:#FF6200;
            color: #ffffff;
            height: 2rem;
            font-family: var(--font-regular);
            border-radius: 5px;
            margin-bottom: 1rem;
            cursor: pointer;
        }
        :host button.cancel{
            background-color:#ffffff;
            border-color:#0E121A;
            color:#0E121A;
            border: 1px solid #0E121A;
        }
    `

    static properties = {
        isModalOpen : { type: Boolean },
        message: { type: String }
    }

    constructor(){
        super();
        this.isModalOpen = false;
        this.message = '';
        updateWhenLocaleChanges(this);
    }

    confirmDelete(){
        const confirmDeleteEvent = new CustomEvent('delete-component-changed', {
            detail : {'status' : 'confirm'},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(confirmDeleteEvent);
    }

    closeModal() {
        const closeModalEvent = new CustomEvent('delete-component-changed', {
            detail : {'status' : 'close'},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(closeModalEvent);
    }


    render(){
        return html`
        ${this.isModalOpen
          ? html`<div class="modal">
              <div class="modal-header">
                <div class="msg">${msg('Are you sure?')}</div>
                <div class="btn" @click="${() => {this.closeModal()}}">X</div>
              </div> 
              <div class="modal-text">${this.message}</div>
              <button @click="${() => {this.confirmDelete()}}">${msg('Proceed')}</button>
              <button @click="${() => {this.closeModal()}}" class="cancel">${msg('Cancel')}</button>
            </div>
            <div class="modal-bg"></div>
            `
          : ''}
      `;
        
    }
}

customElements.define('delete-confirmation', DeleteConfirmation);