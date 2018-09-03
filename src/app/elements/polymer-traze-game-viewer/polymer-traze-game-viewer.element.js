import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import './polymer-traze-game-tile.element.js'

import { TrazeMqttService } from '../../services/traze-mqtt.service';

/**
 * `LowerCaseDashedName` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class TrazeGameViewerElement extends PolymerElement {
    static get properties() {
        return {
            tiles:{
                type: Array,
            },
            gridWidth: {
                type: Number
            },
            gridHeight: {
                type: Number
            }
        }
    }

    static get template() {
        return html`
            <style>
                .container {
                    display: grid;
                    min-height: 40em;
                }
                polymer-traze-game-row {
                    display: block;
                }
            </style>
            <div class="container" style="grid-template-columns: repeat({{gridWidth}},1fr); grid-template-rows: repeat({{gridHeight}}, 1fr)">
                <template is="dom-repeat" items="{{tiles}}">
                    <polymer-traze-game-tile tile={{item}}></polymer-traze-game-tile>
                </template>
            </div>
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
        if(!this.mqttService.activeInstance){
            this.mqttService.subscribeToInternal('instanceSelect', (activeInstance) => {
                this.spectateGame(activeInstance);
            });
        } else {
            this.spectateGame(this.mqttService.activeInstance);
        }
    }

    spectateGame(instanceId){
        this.mqttService.subscribeToMqtt('traze/'+instanceId+'/grid', (message) => {
            this.tiles = this.convertToTiles(message.tiles);
            this.gridWidth = message.width;
            this.gridHeight = message.height;
        });
    }

    convertToTiles(messageTiles){
        let tiles = [];
        messageTiles.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                tiles.push({id: rowIndex+''+tileIndex});
            });
        });
        return tiles;
    }
}

customElements.define('polymer-traze-game-viewer', TrazeGameViewerElement);