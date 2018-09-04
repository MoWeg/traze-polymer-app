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
            <polymer-traze-game-viewer active-instance=[[activeInstance]]></polymer-traze-game-viewer>
            <iron-pages selected="[[needed]]">
                <traze-instance-select active-instance="{{activeInstance}}"></traze-instance-select>
                <traze-join active-instance=[[activeInstance]] user-name="{{userName}}"></traze-join>
                <traze-steering-cross></traze-steering-cross>
            </iron-pages>
        </div>
        `;
    }

    static get properties(){
        return {
            activeInstance:{
                type: String,
            },
            userName: {
                type: String,
            },
            needed: {
                type: Number,
            }
        }
    }

    /**
      * Array of strings describing multi-property observer methods and their
      * dependant properties
      */
    static get observers() {
        return [
            'onChanges(activeInstance, userName)'
        ];
    }

    onChanges(inst, usr){
        if(!this.activeInstance){
            this.needed = 0;
            return;
        }
        if(!this.userName){
            this.needed = 1;
            return;
        }
        this.needed = 2;
    }

    constructor() {
        super();
        this.mqttService = new TrazeMqttService();
        this.needed = 0;
    } 

    ready() {
        super.ready();
        if(!this.mqttService.isConnected){
            this.mqttService.connectToServer(SERVER_URL);
        }             
    }
}
window.customElements.define('traze-polymer-app',TrazePolymerApp);