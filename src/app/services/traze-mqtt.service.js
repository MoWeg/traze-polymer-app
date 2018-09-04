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

    subscribeToInternal(topic, callback){
        this.subscribers[topic] = callback;
    }

    unsubscribeFromMqtt(topic){
        delete this.subscribers[topic];
        this.client.unsubscribe(topic);
    }

    selectInstance(trazeInstanceId){
        this.activeInstance = trazeInstanceId;
        if(this.subscribers['instanceSelect']){
            this.subscribers['instanceSelect'](this.activeInstance);
        }
    }

    generateClientId(){
        return Math.random().toString(16).substr(2, 8);
    }
}