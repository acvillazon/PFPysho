import React from 'react';
import { Platform, View , StyleSheet} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import { Notifications, Permissions } from 'expo'
import { Feather } from 'react-native-vector-icons'
import { Header,Text, Button, Left, Right, Body, Title,Textarea } from 'native-base';
import firebase from '../config/firebase'
import { Dialog } from 'react-native-simple-dialogs'

import KeyboardSpacer from 'react-native-keyboard-spacer';

let platform = Platform.OS;

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      id: undefined,
      thisChat: undefined,
      registerVisible: false,
      profileVisible:false,
      textDialog:undefined
    }
  }

  async componentDidMount() {
    var citaid = this.props.navigation.getParam("id")
    var a = await this.props.navigation.getParam("actual")
    this.setState({ thisChat: a })
    this.setState({ id: citaid })
    firebase.refOnFirestore(citaid, message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })));
  }
  componentWillUnmount() {
    firebase.refOff();
  }

  changeText = (text) =>{
    this.setState({textDialog:text})
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

  showProfile = () =>{
    /*this.props.navigation.navigate('profile',{
      user:this.state.thisChat.partner
    })*/
    
  }

  onSend = message => {
    firebase.send(message, this.state.id, this.state.thisChat)
  }

  pressSaveRegister = () =>{
    firebase.SaveRegister(this.props.navigation.getParam("id"),this.state.textDialog)
    this.setState({textDialog:undefined, registerVisible:false})
    setTimeout(()=>{
      alert("Registro guardado")
    },400)
  }

  render() {
    if (this.props.navigation.getParam("actual") != undefined) {
      var { partner } = this.props.navigation.getParam("actual")
      var nombre_user = partner.usuario.nombres
    } else {
      var nombre_user = "Usuario"
    }

    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={30} />
            </Button>
          </Left>
          <Body>
            <Title>{nombre_user}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.showProfile()}>
              <Feather name="user" size={30} />
            </Button>
            <Button transparent onPress={() => this.setState({registerVisible:true})}>
              <Feather name="file-text" size={30} />
            </Button>
          </Right>
        </Header>

        <Dialog
          visible={this.state.registerVisible}
          onTouchOutside={() => this.setState({ registerVisible: false })} >
          <View style={style.containerDialog}>
              <Textarea rowSpan={5} bordered style={style.TextRegister} placeholder="Textarea" onChangeText={(text) => this.changeText(text)}/>
              <Button block success onPress={() => this.pressSaveRegister()} style={style.buttonRegister}><Text>Guardar</Text></Button>
          </View>
        </Dialog>

        <Dialog
          visible={this.state.profileVisible}
          onTouchOutside={() => this.setState({ profileVisible: false })} >
          <View style={style.containerDialog}>

          </View>
        </Dialog>

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

var style = StyleSheet.create({
  containerDialog:{
    height: 200
  },
  TextRegister:{
    borderColor:'red',
    borderWidth:1,
  },
  buttonRegister:{
    marginTop:15
  }
})

export default Chat