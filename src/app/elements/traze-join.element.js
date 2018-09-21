import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import { TrazeMqttService } from '../services/traze-mqtt.service';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';
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
            activeInstance:{
                type: String
            },
            playerName : {
                type: String,
                notify: true
            },
            userName: {
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

    joinInstance(){
        this.set("playerName", userName);
        mqttService.joinGame(this.userName,(message) => {
            this.set('playerId', message.playerId); // same as this.playerId = ...
        });       
    }
}

customElements.define('traze-join', TrazeJoinElement);