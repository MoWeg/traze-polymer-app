import {PolymerElement, html} from '@polymer/polymer';
import {TrazeMqttService} from './services/traze-mqtt.service'

const SERVER_URL = "wss://traze.iteratec.de:9443";

export default class TrazePolymerApp extends PolymerElement {

    static get template(){
        return html `<h1>hello [[computeStatus(mqttStatus)]]</h1>`;
    }

    static get properties(){
        return {
            mqttStatus: {
                type: Boolean,
                value: false
            }
        }
    }

    computeStatus(mqttStatus){
        return mqttStatus? 'connected' : 'not-connected';
    }

    constructor() {
        super();
        this.mqttService = new TrazeMqttService();
    } 

    ready() {
        super.ready();      
        this.mqttService.connectToServer(SERVER_URL,() => {
            this.mqttStatus = true;
        });
    }
}
window.customElements.define('traze-polymer-app',TrazePolymerApp);