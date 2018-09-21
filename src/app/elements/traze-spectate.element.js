import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import { TrazeMqttService } from '../services/traze-mqtt.service';

/**
 * `LowerCaseDashedName` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class TrazeSpectateElement extends PolymerElement {
    static get properties() {
        return {
            activeInstance: {
                type: String,
                observer: 'onInstanceSelect'
            },    
            grid: {
                width: {
                    type: Number,
                    value: 0
                },
                height: {
                    type: Number,
                    value: 0
                }
            },
            gameState: {
                add: {
                    type: Array
                },
                remove: {
                    type: Array
                }
            },
            playerName: {
                type: String,
                observer: 'joinPlayer'
            }
        }
    }

    static get template() {
        return html`

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
        this.gameMemory = {
            tiles: {},
            colors: {},
        };
        this.gameState.add = [];
        this.gameState.remove = [];
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }
    joinPlayer(){
        
    }

    onInstanceSelect(){
        this.spectateGame(this.activeInstance);
    }

    spectateGame(instanceId){
        this.mqttService.subscribeToMqtt('traze/'+instanceId+'/players', (message) =>{
            message.forEach((player) => {
                this.gameState.colors[player.id] = player.color;
            });
        });
        this.mqttService.subscribeToMqtt('traze/'+instanceId+'/grid', (message) => {
            this.handleGrid(message.height, message.width, message.tiles);
            this.handleAdditionAndDeletions(message.bikes, message.spawns);
        });
    }

    handleGrid(messageHeight, messageWidth){
        if(messageHeight != this.grid.height || messageWidth != this.grid.width){
            this.set('grid.height', messageHeight);
            this.set('grid.width',messageWidth);
        }
    }

    handleAdditionAndDeletions(bikes, spawns){
        let additions = [];
        let deletions = [];
        this.set('gameState.add', additions);
        this.set('gameState.remove', deletions);
        bikes.forEach(bike => this.handleBike(bike, additions, deletions));
        this.handleSpawns(spawns, additions, deletions);
        this.set('gameState.add', additions);
        this.set('gameState.remove', deletions);
    }

    handleSpawns(spawns, additions, deletions){
        if(this.gameMemory['spawns']){
            let oldSpawns = this.gameMemory['spawns'];
            if(oldSpawns != spwans){
                oldSpawns.forEach(spawn => {
                    deletions.push({
                        position: spawn,
                    });
                });
            } else {
                return;
            }
        }
        if(spawns){
            spawns.forEach(spawn => {
                additions.push({
                    position: spawn,
                    color: 'white'
                });
            });
        }
        this.gameMemory['spawns'] = spawns; 
    }

    handleBike(bike, additions, deletions){
        let color = this.gameState.colors[gameMemoryKey] ? this.gameState.colors[gameMemoryKey] : "black";
        let gameMemoryKey = bike.playerId;
        let newTrail = bike.trail;
        newTrail.push(bike.currentLocation);
        if(this.gameMemory.bikes[gameMemoryKey]){
            let oldTrail = this.gameMemory.bikes[gameMemoryKey];
            if(bike.trail == oldTrail){
               additions.push({
                    position: bike.currentLocation, 
                    color: color
               });
            } else {
                this.newTrail.forEach(tile => {
                    additions.push({
                        position: tile, 
                        color: color
                   });
                });
                this.oldTrail.forEach(tile => {
                    deletions.push({
                        position: tile
                    });
                });
            }
        } else {
            this.newTrail.forEach(tile => {
                additions.push({
                    position: tile, 
                    color: color
               });
            });
        }
        this.gameMemory.bikes[gameMemoryKey] = newTrail;
    }
}

customElements.define('traze-spectate', TrazeSpectateElement);