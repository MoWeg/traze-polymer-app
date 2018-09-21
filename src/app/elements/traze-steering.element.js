import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';

import { TrazeMqttService } from '../services/traze-mqtt.service';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';
/**
 * `LowerCaseDashedName` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class TrazeSteeringElement extends PolymerElement {
    static get properties() {
        return {
            playerName: {
                type: String,
                notify: true
            }
        }
    }

    static get template() {
        return html`
            <div>
                <paper-button raised on-click="steerUp">UP</paper-button>
                <paper-button raised on-click="steerLeft">LEFT</paper-button>
                <paper-button raised on-click="steerRight">RIGHT</paper-button>
                <paper-button raised on-click="steerDown">DOWN</paper-button>
            </div>
            <paper-button on-click="bail">BAIL</paper-button>            
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
    }
    steer(direction){
        this.mqttService.steer(direction);
    }

    steerUp(){
        this.steer('N');
    }
    steerDown(){
        this.steer('S');
    }
    steerLeft(){
        this.steer('W');
    }
    steerRight(){
        this.steer('E');
    }

    bail(){
        this.mqttService.bail();
        this.playerName = null;
    }
}

customElements.define('traze-steering', TrazeSteeringElement);