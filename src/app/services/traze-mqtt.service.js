import {connect} from 'mqtt';

let instance = null;

export class TrazeMqttService{

    constructor(){
        if (instance) {
          return instance;
        }
        this.isConnected = false;
        instance = this;
        this.subscribers = {};
        this.messages = [];
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
            this.isConnected = true;
            Object.keys(this.subscribers).forEach(topic => {
                this.client.subscribe(topic);
            })
            if(onSucess){
                onSucess();
            }
            
        });
        this.client.on('error', (error) => {
            console.log("Error: " + error);
            if(onError){
                onError();
            }            
        });
        this.client.on('message', (topic, message) => {
            message = JSON.parse(message);
            if(this.subscribers[topic]){
                this.subscribers[topic](message)
            } else {
                this.messages.push({
                    topic: topic,
                    payload: message
                });
            }
        });
    }

    subscribeToMqtt(topic, callback){
       this.subscribers[topic] = callback;
       
       if(this.client && this.isConnected){
            this.client.subscribe(topic);
        }    
       
       this.messages
       .filter(message => message.topic == topic)
       .forEach(message => callback(message.payload));
    }
    unsubscribeFromMqtt(topic){
        delete this.subscribers[topic];
        this.client.unsubscribe(topic);
    }

    joinGame(userName, onSuccess){
        this.subscribeToMqtt('traze/' + this.activeInstance + '/player/' + this.clientId, (message) => {
            this.playerId = message.id;
            this.secretToken = message.secretUserToken;
            onSuccess({playerId: this.playerId});
        });
        let message = {
            name: userName,
            mqttClientName: this.clientId
        }
        this.client.publish('traze/' + this.activeInstance + "/join", JSON.stringify(message));
    }

    steer(direction){
        if(this.secretToken && this.playerId){
            let message = {
                course: direction,
                playerToken: this.secretToken
            }
        
            this.client.publish('traze/'+instance+ '/' + this.playerId + '/steer', JSON.stringify(message));
        }
    }

    bail(){
        if(this.secretToken && this.playerId){
            let message = {
                playerToken: this.secretToken
            };       
            this.client.publish('traze/'+instance+ '/' + this.playerId + '/bail', JSON.stringify(message));
            this.playerToken = null;
            this.playerId = null;
        }
    }


    selectInstance(trazeInstanceId){
        this.activeInstance = trazeInstanceId;
    }

    generateClientId(){
        return Math.random().toString(16).substr(2, 8);
    }
}