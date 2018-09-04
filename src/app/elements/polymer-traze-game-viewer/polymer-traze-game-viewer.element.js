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
                <template is="dom-repeat" items="[[tiles]]">
                    <polymer-traze-game-tile tile=[[item]]></polymer-traze-game-tile>
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
        this.gameMemory = {};
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
            this.initGrid(message.height, message.width, message.tiles);
            this.handleSpawns(message.spawns);
            this.handleBikes(message.bikes);
        });
    }

    handleBikes(currentBikes){
        if(!this.lastBikes){
            this.lastBikes = {};
        }
        currentBikes.forEach(bike => this.handleBike(bike));
    }

    cleanUpOldBikes(currentBikes){
        let oldBikes = Objekt.keysthis.gameMemory
    }

    handleBike(bike){
        let gameMemoryKey = bike.playerId;
        let completeTrail = bike.trail;
        completeTrail.push(bike.currentLocation);
        this.handleColoring(completeTrail, gameMemoryKey, "yellow");
    }

    handleSpawns(currentSpawns){
        this.handleColoring(currentSpawns, "spawns", "white");
    }

    handleColoring(currentInfo, gameMemoryKey, color){
        if(this.gameMemory[gameMemoryKey]){
            this.setTilesToColor(this.gameMemory[gameMemoryKey], "#455A64");
        }
        let transformedInfo = null;
        if(currentInfo && currentInfo.length > 0){
            transformedInfo = this.transformArrayOfCoordinates(currentInfo);
            this.setTilesToColor(transformedInfo, color);
        }
        this.gameMemory[gameMemoryKey] = transformedInfo;
    }

    setTilesToColor(tileIndex,color){
        tileIndex.forEach((tile) =>{
        //   this.tiles[tile].color = color;
            this.set('tiles.'+tile, {color: color});
        });  
    }

    initGrid(messageHeight, messageWidth, messageTiles){
        if(messageHeight != this.gridHeight || messageWidth != this.gridWidth){
            this.tiles = this.createPolymerTrazeTiles(messageTiles);
            this.gridWidth = messageWidth;
            this.gridHeight = messageHeight;

            // // to be removed
            // this.tiles[this.transformCoordinate([0, 0])].color = "green";  
            // this.tiles[this.transformCoordinate([this.gridWidth-1,this.gridHeight-1])].color = "red";
            // this.tiles[this.transformCoordinate([0,this.gridHeight-1])].color = "blue";
            // this.tiles[this.transformCoordinate([this.gridWidth -1, 0])].color = "yellow";
        }
    }

    createPolymerTrazeTiles(messageTiles){
        let tiles = [];
        messageTiles.forEach((row) => {
            row.forEach((tile) => {
                tiles.push({
                    color: "#455A64"
                });
            });
        });
        return tiles;
    }

    transformArrayOfCoordinates(coordinates){
        let transformed = [];
        coordinates.forEach((coordinate) => {
            transformed.push(this.transformCoordinate(coordinate));
        });
        return transformed;
    }

    transformCoordinate(coordinate){
        let x = coordinate[0];
        let y = coordinate[1];
        let newY = this.gridHeight - (y+1);
        let newX = newY * (this.gridWidth - 1) + x;
        return newY + newX;
    }
}

customElements.define('polymer-traze-game-viewer', TrazeGameViewerElement);