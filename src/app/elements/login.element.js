import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

import { TrazeMqttService } from '../services/traze-mqtt.service';

class  TrazeLoginElement extends PolymerElement {
    static get properties() {
        return {
            instances : {
                type: Array
            },
            userName : {
                type: String
            },
            selectedInstance: {}
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
                <div>Pick an instance</div>
                <paper-radio-group selected="{{selectedInstance}}">
                    <template is="dom-repeat" items="{{instances}}">
                        <paper-radio-button name="[[item.name]]">Instance: [[item.name]] (Players: [[item.activePlayers]])</paper-radio-button>
                    </template>
                </paper-radio-group>
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
        this.mqttService = new TrazeMqttService();
        this.instances = [];
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
        this.mqttService.subscribeTo('traze/games', (message) => {
            this.instances = message;
        });
    }

    joinInstance(){
        console.log(this.selectedInstance);
        console.log(this.userName);
    }
}

customElements.define('traze-login',TrazeLoginElement );