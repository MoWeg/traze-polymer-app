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
                type: Number,
                value: 0
            },
            gridHeight: {
                type: Number,
                value: 0
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
                polymer-traze-game-tile {
                    display: block;
                    margin: 1px;
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
            if(message.height != this.gridHeight || message.width != this.gridWidth){
                console.log("creating grid");
                
                this.tiles = this.createPolymerTrazeTiles(message.tiles);
                this.gridWidth = message.width;
                this.gridHeight = message.height;

                this.tiles[this.transformCoordinates([0, 0])].color = "green";  
                this.tiles[this.transformCoordinates([this.gridWidth-1,this.gridHeight-1])].color = "red";
                this.tiles[this.transformCoordinates([0,this.gridHeight-1])].color = "blue";
                this.tiles[this.transformCoordinates([this.gridWidth -1, 0])].color = "yellow";
            }
        });
    }

    createPolymerTrazeTiles(messageTiles){
        let tiles = [];
        messageTiles.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                tiles.push({
                    color: "#455A64"
                });
            });
        });
        return tiles;
    }

    transformCoordinates(coordinate){
        let x = coordinate[0];
        let y = coordinate[1];
        let newY = this.gridWidth - (y+1);
        let newX = newY * (this.gridHeight - 1) + x;
        return newY + newX;
    }
}

customElements.define('polymer-traze-game-viewer', TrazeGameViewerElement);