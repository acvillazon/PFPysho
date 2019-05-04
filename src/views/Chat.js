import React from 'react';
import { Platform, View, StyleSheet, Image, ScrollView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import { Notifications, Permissions } from 'expo'
import { Feather } from 'react-native-vector-icons'
import { Header, Text, Button, Left, Right, Label, Body, Title, Textarea } from 'native-base';
import firebase from '../config/firebase'
import { Dialog } from 'react-native-simple-dialogs'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { connect } from 'react-redux';
import jefe from '../config/jefe.png'

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
    this.setState({ thisChat: a })
    this.setState({ id: citaid })
    firebase.refOnFirestore(citaid, message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })),() =>{
        firebase.deleteChat_NewMessage(this.state.thisChat)
      });
  }
  componentWillUnmount() {
    firebase.refOffFirestoreChat()
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
    if (this.props.navigation.getParam("state") == "activo") {
      firebase.send(message, this.state.id, this.state.thisChat)

      //var { partner, body, id } = this.props.navigation.getParam("actual")
      //var tipo = partner.usuario.tipo
      firebase.changeChat(this.props.navigation.getParam("actual"))

    } else {
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
        <Header style={{ backgroundColor: '#1976D2' }}>
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

            {this.props.credentials.Auth.usuario.tipo == "1"
              ?
              <Button transparent onPress={() => this.verRegistros()}>
                <Feather name="file-text" size={30} />
              </Button>

              : null
            }

            {this.props.credentials.Auth.usuario.tipo == "1"
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
          <View style={[{padding:15},{borderColor:'#9E9E9E'},{borderWidth:1},{borderRadius:10}]}>
            <View style={style.containerImage}>
              <Image source={jefe} style={[style.imageStyle]} />
            </View>
            <ScrollView
              scrollEnabled={true}
            >
              <Text style={style.text}>Nombre:</Text>
              <Label style={style.labelDialog}>{nombre_user}</Label>
              <Text style={style.text}>Apellidos:</Text>
              <Label style={style.labelDialog}>{apellidos_user}</Label>
              <Text style={style.text}>Ocupación:</Text>
              <Label style={style.labelDialog}>{ocupacion_user}</Label>
              <Text style={style.text}>Fecha de nacimiento:</Text>
              <Label style={style.labelDialog}>{nacimiento_user.toDateString()}</Label>
              {tipo == "1"
                ? null
                :
                <View>
                  <Text style={style.text}>Semestre:</Text>
                  <Label style={style.labelDialog}>{partner.usuario.semestre}</Label>
                  <Text style={style.text}>Codigo Universitario:</Text>
                  <Label style={style.labelDialog}>{partner.usuario.codigo}</Label>
                  <Text style={style.text}>Carrera de estudio:</Text>
                  <Label style={style.labelDialog}>{partner.usuario.carrera}</Label>
                </View>
              }
            </ScrollView>
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
  },
  containerImage: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }, labelDialog: {
    marginVertical: 5
  },imageStyle:{
    width: 140, 
    height: 140,
    marginTop: -100,
  },text:{
    fontWeight:'bold',
    color:'blue'
  }
})

Border = (color) => {
  return {
    borderColor: color,
    borderWidth: 1,
  }
}

const mapStateToProps = state => {
  return {
    credentials: state.credentials,
    chats: state.chatsInactivos
  }
}

export default connect(mapStateToProps, null)(Chat)