import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {Notifications,Permissions} from 'expo'
import firebase from '../config/firebase'

class Chat extends React.Component {
  constructor(props){
    super(props)
    this.state={
      messages:[]
    }
  }

  componentDidMount() {
    firebase.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))); 
      this.registerForNotification();
  }

    
  componentWillUnmount() {
    firebase.refOff();
  }
  
  registerForNotification = async () => {
    //Mirar si tengo permisos para notificaciones
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status;

    //Sino tengo permisos, pedirlos.
    if (finalStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;

      if (finalStatus !== 'granted') {
        return;
      }
    }
    //Obtener el Token para notificaciones.
    let token = await Notifications.getExpoPushTokenAsync();
    firebase.RegisterTokenInUsers(token)
  }
  
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebase.send}
        user={
          {_id: firebase.uid}
        }
      />
    );
  }
}

export default Chat