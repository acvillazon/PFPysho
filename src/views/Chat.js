import React from 'react';
import { Platform, View, StyleSheet } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import { Notifications, Permissions } from 'expo'
import { Feather } from 'react-native-vector-icons'
import { Header, Text, Button, Left, Right, Label, Body, Title, Textarea } from 'native-base';
import firebase from '../config/firebase'
import { Dialog } from 'react-native-simple-dialogs'
import KeyboardSpacer from 'react-native-keyboard-spacer';

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      id: undefined,
      thisChat: undefined,
      registerVisible: false,
      profileVisible: false,
      textDialog: undefined
    }
  }

  async componentDidMount() {
    var citaid = this.props.navigation.getParam("id")
    var a = await this.props.navigation.getParam("actual")
    console.log('ID')
    console.log(citaid)
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

  changeText = (text) => {
    this.setState({ textDialog: text })
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

  showProfile = () => {
    this.setState({ profileVisible: true })
  }

  onSend = message => {
    if(this.props.navigation.getParam("state") == "activo"){
      firebase.send(message, this.state.id, this.state.thisChat)
    }else{
      alert("Este chat a sido cerrado, no puede seguir enviando mensajes")
    }
  }

  pressSaveRegister = () => {
    firebase.SaveRegister(this.props.navigation.getParam("id"), this.state.textDialog)
    this.setState({ textDialog: undefined, registerVisible: false })
    setTimeout(() => {
      alert("Registro guardado")
    }, 400)
  }

  verRegistros = () => {
    this.props.navigation.navigate("registro", {
      id: this.state.id
    })
  }

  render() {
    if (this.props.navigation.getParam("actual") != undefined) {
      var { partner } = this.props.navigation.getParam("actual")
      var nombre_user = partner.usuario.nombres
      var apellidos_user = partner.usuario.apellidos
      var nacimiento_user = new Date()
      nacimiento_user.setTime((partner.usuario.nacimiento))
      var tipo = partner.usuario.tipo
      var ocupacion_user = partner.usuario.tipo == "1" ? "Psicologo" : "Estudiante"
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
            {partner.usuario.tipo != "1"
              ?
              <Button transparent onPress={() => this.verRegistros()}>
                <Feather name="file-text" size={30} />
              </Button>

              : null
            }
            {partner.usuario.tipo != "1"
              ?
              this.props.navigation.getParam("state") == "activo"
                ? <Button transparent onPress={() => this.setState({ registerVisible: true })}>
                  <Feather name="file-plus" size={30} />
                </Button>
                : null
              : null
            }

          </Right>
        </Header>

        <Dialog
          visible={this.state.registerVisible}
          onTouchOutside={() => this.setState({ registerVisible: false })} >
          <View style={style.containerDialog}>
            <Textarea rowSpan={5} bordered style={style.TextRegister} placeholder="Textarea" onChangeText={(text) => this.changeText(text)} />
            <Button block success onPress={() => this.pressSaveRegister()} style={style.buttonRegister}><Text>Guardar</Text></Button>
          </View>
        </Dialog>

        <Dialog
          visible={this.state.profileVisible}
          onTouchOutside={() => this.setState({ profileVisible: false })} >
          <View style={tipo == "1" ? style.containerDialogPerfil : style.containerDialog2}>
            <View style={[{ flex: 1 }, { paddingHorizontal: 20 }]}>
              <Label>Nombres: {nombre_user}</Label>
              <Label>Apellidos: {apellidos_user}</Label>
              <Label>Ocupación: {ocupacion_user}</Label>
              <Label>Fecha de nacimiento: {nacimiento_user.toDateString()}</Label>
              {tipo == "1"
                ? null
                :
                <View>
                  <Label>Semestre: {partner.usuario.semestre}</Label>
                  <Label>Codigo Estudiantil: {partner.usuario.codigo}</Label>
                  <Label>Carrera de estudio: {partner.usuario.carrera}</Label>
                </View>
              }

            </View>
          </View>
        </Dialog>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={
            { _id: firebase.uid }
          }
        />
        {Platform.OS === 'android' ? <KeyboardSpacer topSpacing={29} /> : null}
      </View>
    );
  }
}

var style = StyleSheet.create({
  containerDialog: {
    height: 200,
  },
  containerDialog2: {
    height: 300,
  },
  containerDialogPerfil: {
    height: 200,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  TextRegister: {
    borderColor: 'red',
    borderWidth: 1,
  },
  buttonRegister: {
    marginTop: 15
  }
})

export default Chat