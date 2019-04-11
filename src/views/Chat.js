import React from 'react';
import { Platform, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import { Notifications, Permissions } from 'expo'
import {Header, Content, Button, Left, Right, Body, Title} from 'native-base';
import firebase from '../config/firebase'
import KeyboardSpacer from 'react-native-keyboard-spacer';


let platform = Platform.OS;

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      id: undefined,
      thisChat: undefined
    }
  }

  componentDidMount() {
    var citaid = this.props.navigation.getParam("id")
    var a = this.props.navigation.getParam("actual")
    console.log("CHATSSS")
    console.log(a)
    this.setState({ thisChat: a })
    this.setState({ id: citaid })
    firebase.refOnFirestore(citaid, message =>
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

  onSend = message => {
    firebase.send(message, this.state.id, this.state.thisChat)
  }

  render() {

    if(this.props.navigation.getParam("actual")!=undefined){
      var {partner} = this.props.navigation.getParam("actual")
      var nombre_user = partner.usuario.nombres
    }else{
      var nombre_user = "Usuario"
    }

    return (
      <View style={{flex:1}}>
        <Header>
          <Left>
            <Button transparent>
            </Button>
          </Left>
          <Body>
            <Title>{nombre_user}</Title>
          </Body>
          <Right>
            <Button transparent>
            </Button>
          </Right>
        </Header>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={
            { _id: firebase.uid }
          }
        />
        {Platform.OS === 'android' ? <KeyboardSpacer topSpacing={32} /> : null}
      </View>
    );
  }
}

export default Chat