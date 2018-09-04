import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/iron-pages/iron-pages.js'

import './elements/traze-instance-select.element.js';
import './elements/traze-join.element.js';
import './elements/polymer-traze-game-viewer/polymer-traze-game-viewer.element.js'

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
            polymer-traze-game-viewer {
                display: block;
            }
            .container{
                display: flex;
                flex-wrap: wrap;
            }
        </style>
        <div class="container">
            <polymer-traze-game-viewer></polymer-traze-game-viewer>
            <traze-instance-select></traze-instance-select>
            <traze-join></traze-join>
            <traze-steering-cross></traze-steering-cross>
        </div>
        `;
    }

    static get properties(){
        return {}
    }

    constructor() {
        super();
        this.mqttService = new TrazeMqttService();
    } 

    ready() {
        super.ready();
        if(!this.mqttService.isConnected){
            this.mqttService.connectToServer(SERVER_URL);
        }             
    }
}
window.customElements.define('traze-polymer-app',TrazePolymerApp);