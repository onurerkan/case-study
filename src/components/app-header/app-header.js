import { LitElement, html, css } from "lit";
import { Router } from '@vaadin/router'
import "../icon-element/icon-element.js";
import { classMap } from "lit/directives/class-map.js";
import { store } from '../../store/store.js';
import { setLanguage } from '../../store/actions.js'
import { connect } from "pwa-helpers";
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { setLocaleFromString } from '../../localization.js';

class Header extends connect(store)(LitElement){
    static styles = css`
        :host {
            display: block;
            background-color: var(--header-bg-color, #ffffff);
            color: var(--header-text-color, #3A3A3A);
            padding: var(--header-padding, 0.5rem);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: .5rem;
        }
        .header .logo {
            display: flex;
        }
        .header .logo span{
            color:#3A3A3A;
            font-size: .8rem;
            font-family: var(--font-semi-bold);
            margin-top: .7rem;
            font-weight: bold;
        }
        .header .actions {
            display: flex;
            gap: 1rem;
            -webkit-user-select: none;
        }
        .header .actions .action-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: .2rem;
            cursor: pointer;
        }
        .header .actions .action-text {
            font-size: .8rem;
            color: var(--header-text-color, #FFBD94);
        }
        .header .actions .action-text.active{
            color: var(--header-text-color, #FF6200);
        } 
        .header .language {
            cursor: pointer;
        }
        @media (max-width: 480px) {
            .header .actions {
                flex-direction: column;
                gap: 0.5rem;
            }
        }
        @media (max-width: 768px) {
            .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            }
        }
    `;

    static properties = {
        currentPath : { type: String },
        language : { type: String }
    }

    constructor() {
        super();
        this.currentPath = window.location.pathname;
        this.language = 'en';
        updateWhenLocaleChanges(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('vaadin-router-location-changed', this._onLocationChanged.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('vaadin-router-location-changed', this._onLocationChanged.bind(this));
    }

    _onLocationChanged(e) {
        this.currentPath = e.detail.location.pathname;
    }

    navigate(url){
        Router.go(url);
    }

    stateChanged(state){
        this.language = state.language;
    }

    changeLanguage(language){
        store.dispatch(setLanguage(language));
        setLocaleFromString(language);
    }

    
    render() {
        const classesEmployees = {'action-text': true, 'active': this.currentPath === '/'};
        const classesForm = {'action-text': true, 'active': this.currentPath === '/form'};
        const langText = this.language === 'en' ? 'tr' : 'en'

        return html`
            <header class="header">
                <div class="logo">
                    <img src="/assets/images/ing-logo.png" alt="ING Logo" width="42" height="42"/>
                    <span>ING</span>
                </div>
                <div class="actions">
                  <div class="action-btn" @click="${() => this.navigate('/')}">
                    <icon-element name="employees" color="${this.currentPath === '/' ? '#FF6200' : '#FFBD94'}"></icon-element>
                    <span class="${classMap(classesEmployees)}">${msg('Employees')}</span>
                  </div>
                  <div class="action-btn" @click="${() => this.navigate('/form')}">
                    <icon-element name="add" color="${this.currentPath === '/form' ? '#FF6200' : '#FFBD94'}"></icon-element>
                    <span class="${classMap(classesForm)}">${msg('Add New')}</span>
                  </div>
                  <div class="language" @click="${() => this.changeLanguage(langText)}">
                    <icon-element name="${langText}"></icon-element>
                  </div>
                  
                </div>
            </header>
        `;
    }
    }
customElements.define('app-header', Header);