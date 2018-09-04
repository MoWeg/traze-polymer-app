import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

import { TrazeMqttService } from '../services/traze-mqtt.service';

class  TrazeInstanceSelectElement extends PolymerElement {
    static get properties() {
        return {
            showSelect:  {
                type: Boolean,
                value: false
            },
            instances : {
                type: Array
            },
            activeInstance: {}
        }
    }

    static get template() {
        return html`
        <template is="dom-if" if="[[showSelect]]">
            <div>
                <div>Pick an instance</div>
                <paper-radio-group selected="{{selectedInstance}}">
                    <template is="dom-repeat" items="{{instances}}">
                     <paper-radio-button name="[[item.name]]">Instance: [[item.name]] (Players: [[item.activePlayers]])</paper-radio-button>
                    </template>
                </paper-radio-group>
                <paper-button on-click="selectInstance">JOIN</paper-button>
            </div>
        </template>
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
        this.instances = null;
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
        this.mqttService.subscribeToMqtt('traze/games', (message) => {
            this.instances = message;
            if(message.length == 1){
                this.activeInstance = message[0];
                this.selectInstance();
            } else {
                this.showSelect = true;
            }
        });
    }

    selectInstance(){
        this.mqttService.selectInstance(this.activeInstance.name);
        this.mqttService.unsubscribeFromMqtt('traze/games');
    }
}

customElements.define('traze-instance-select',TrazeInstanceSelectElement );