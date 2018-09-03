import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `LowerCaseDashedName` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class TrazeJoinElement extends PolymerElement {
    static get properties() {
        return {
            userName : {
                type: String
            }
        }
    }

    static get template() {
        return html`
        <style>
            paper-card {
                background-color: #455A64;
            }
        </style>
        <paper-card heading="Login">
            <div class="card-content"> 
                <div>Set your name</div>
                <paper-input value={{userName::input}}><paper-input>
            </div>
            <div class="card-actions">
                <div class="horizontal justified">
                    <paper-button on-click="joinInstance">JOIN</paper-button>
                </div>
            </div>
        </paper-card>
        `;
    }

    /**
     * Instance of the element is created/upgraded. Use: initializing state,
     * set up event listeners, create shadow dom.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }
}

customElements.define('traze-join', TrazeJoinElement);