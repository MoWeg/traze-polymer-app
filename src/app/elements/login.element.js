import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js'

import { TrazeMqttService } from '../services/traze-mqtt.service';

class  TrazeLoginElement extends PolymerElement {
    static get properties() {
        return {

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
                <div>Instances</div>
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
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
        this.mqttService.subscribeTo('traze/games', (message) => {
            console.log(message);
        });
    }
}

customElements.define('traze-login',TrazeLoginElement );