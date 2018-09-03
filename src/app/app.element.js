import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/iron-pages/iron-pages.js'

import './elements/traze-instance-select.element.js';
import './elements/traze-join.element.js'

import {TrazeMqttService} from './services/traze-mqtt.service'

const SERVER_URL = "wss://traze.iteratec.de:9443";

export default class TrazePolymerApp extends PolymerElement {

    static get template(){
        return html `
        <style>
            app-header {
                padding: 1em;
                background-color: #44cef3;
            }
            iron-pages {
                padding: 1em;
            }
        </style>
        <app-header reveals>
            <div main-title>TRAZE [[computeStatus(mqttStatus)]]</div>
        </app-header>
        <traze-instance-select></traze-instance-select>
        <iron-pages selected="0">
            <traze-join></traze-join>
        </iron-pages>
        `;
    }

    static get properties(){
        return {
            mqttStatus: {
                type: Boolean
            }
        }
    }

    computeStatus(mqttStatus){
        return mqttStatus? 'connected' : 'not-connected';
    }

    constructor() {
        super();
        this.mqttService = new TrazeMqttService();
        this.mqttStatus = this.mqttService.isConnected;
    } 

    ready() {
        super.ready();
        if(!this.mqttStatus){
            this.mqttService.connectToServer(SERVER_URL,() => {
                this.mqttStatus = true;
            });
        }             
    }
}
window.customElements.define('traze-polymer-app',TrazePolymerApp);