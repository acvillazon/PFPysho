import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Notifications, Permissions } from 'expo'
import firebase from '../config/firebase'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      id:undefined,
      thisChat:undefined
    }
  }

  componentDidMount() {
   var citaid = this.props.navigation.getParam("id")
   var a = this.props.navigation.getParam("actual")
   console.log("CHATSSS")
   console.log(a)
   this.setState({thisChat:a})
    this.setState({id:citaid})
    firebase.refOnFirestore(citaid,message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })));
      console.log(this.state.messages)
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
    //firebase.RegisterTokenInUsers(token)
  }

  onSend = message =>{
    firebase.send(message,this.state.id,this.state.thisChat)
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={
          { _id: firebase.uid }
        }
      />
    );
  }
}

export default Chat