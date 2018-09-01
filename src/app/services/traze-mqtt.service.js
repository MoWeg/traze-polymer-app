import {connect} from 'mqtt';

let instance = null;

export class TrazeMqttService{

    constructor(){
        if (instance) {
          return instance;
        }
        this.isConnected = false;
        instance = this;
        return instance;
    }

    connectToServer(url, onSucess, onError){
        if(this.isConnected && this.client){
            return;
        }
        this.url = url; 
        
        if(!this.clientId){
            this.clientId = this.generateClientId();
        }       
        this.client = connect(url, {clientId: this.clientId});
        this.client.on('connect', () => {
            console.log("Connected.");
            this.isConnected = true;
            onSucess();
        });
        this.client.on('error', (error) => {
            console.log("Error: " + error);
            onError();
        });
    }

    generateClientId(){
        return Math.random().toString(16).substr(2, 8);
    }
}