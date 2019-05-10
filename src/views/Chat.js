import React from 'react';
import { Platform, View, StyleSheet, Image, ScrollView, TouchableHighlight } from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Notifications, Permissions } from 'expo'
import { Feather } from 'react-native-vector-icons'
import { Header, Text, Button, Left, Right, Label, Body, Title, Textarea } from 'native-base';
import firebase from '../config/firebase'
import { Dialog } from 'react-native-simple-dialogs'
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import jefe from '../config/jefe.png'
import registro_as from '../images/bloc.png'
import { LinearGradient } from 'expo'
import { AntDesign } from 'react-native-vector-icons'

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
    console.log(a)
    this.setState({ id: citaid })
    firebase.refOnFirestore(citaid, message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })), () => {
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

  renderBubble = props => {
    return (
      <Bubble {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#31bdff'
          }
        }} />
    )
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
      var { body } = this.props.navigation.getParam("actual")
      var tipo_chat = body.tipo
    } else {
      var nombre_user = "Usuario"
    }

    return (
      <View style={{ flex: 1 }}>
        <Header style={{ backgroundColor: '#6f54da' }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" color="white" size={30} />
            </Button>
          </Left>
          <Body>
            <Text style={[{ color: 'white' },{fontSize:14}]}>{tipo_chat}</Text>
            <Text note style={[{ color: 'white' },{fontSize:12}]}>{nombre_user}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.showProfile()}>
              <Image source={{ uri: 'https://ui-avatars.com/api/?background=31bdff&color=fff&name=' + nombre_user + '+' + apellidos_user + '&rounded=true&size=35' }} style={{ width: 35, height: 35 }}></Image>
            </Button>

            {this.props.credentials.Auth.usuario.tipo == "1"
              ?
              <Button transparent onPress={() => this.verRegistros()}>
                <Feather name="file-text" color="white" size={30} />
              </Button>

              : null
            }

            {this.props.credentials.Auth.usuario.tipo == "1"
              ?
              this.props.navigation.getParam("state") == "activo"
                ? <Button transparent onPress={() => this.setState({ registerVisible: true })}>
                  <Feather name="file-plus" color="white" size={30} />
                </Button>
                : null
              : null
            }

          </Right>
        </Header>

        <Dialog
          style={{ borderRadius: 20 }}
          visible={this.state.registerVisible}
          onTouchOutside={() => this.setState({ registerVisible: false })} >
          <View style={[{ height: 60 }, { backgroundColor: '#9370DB' }, { marginHorizontal: -24 }, { marginTop: -24 }, { marginBottom: 20 }]}>
            <View style={Styles.categoriesChat}>
              <View style={{ flex: 9 }}>
                <Text style={[{ color: 'white' }, { fontWeight: '500' }]}>Registro de asistencia</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableHighlight onPress={() => this.setState({ registerVisible: false })}>
                  <AntDesign name="minuscircleo" size={23} style={{ color: "white" }} />
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <ScrollView
              scrollEnabled={true}
            >
            <Textarea rowSpan={7} bordered style={style.TextRegister} placeholder="Registro...." onChangeText={(text) => this.changeText(text)} />
            <Button block onPress={() => this.pressSaveRegister()} style={style.buttonRegister}><Text>Guardar</Text></Button>
            </ScrollView>
        </Dialog>

        <Dialog
          style={{ padding: 0 }}
          visible={this.state.profileVisible}
          onTouchOutside={() => this.setState({ profileVisible: false })} >
          <LinearGradient colors={['#723d92', '#6d5ffb']} style={[{ marginHorizontal: -24 }, { marginVertical: -24 }]}>
            <View style={style.closebtn}>
              <TouchableHighlight style={[{height:30}]} onPress={() => this.setState({ profileVisible: false })}>
                <AntDesign name="minuscircleo" size={27} style={{ color: "white" }} />
              </TouchableHighlight>
            </View>
            <View style={style.containerImage}>
              <Image source={{ uri: 'https://ui-avatars.com/api/?background=31bdff&color=fff&name=' + nombre_user + '+' + apellidos_user + '&rounded=true&size=100' }} style={{ width: 100, height: 100 }}></Image>
            </View>
            <ScrollView
              scrollEnabled={true}
            >
              <View style={style.ScrollView}>
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
                  <View style={style.ScrollView}>
                    <Text style={style.text}>Semestre:</Text>
                    <Label style={style.labelDialog}>{partner.usuario.semestre}</Label>
                    <Text style={style.text}>Codigo Universitario:</Text>
                    <Label style={style.labelDialog}>{partner.usuario.codigo}</Label>
                    <Text style={style.text}>Carrera de estudio:</Text>
                    <Label style={style.labelDialog}>{partner.usuario.carrera}</Label>
                  </View>
                }
              </View>
            </ScrollView>
          </LinearGradient>
        </Dialog>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          renderBubble={this.renderBubble}
          user={
            { _id: firebase.uid }
          }
        />
        {Platform.OS === 'android' ? <KeyboardSpacer topSpacing={10} /> : null}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  categoriesChat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  footerCategoriesChat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  splah: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  }
})

var style = StyleSheet.create({
  closebtn: {
    flex: 1,
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    marginVertical: 20,
    marginRight: 15,
    marginTop: 15
  },
  ScrollView: {
    alignItems: 'center',
    flex: 1
  },
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
    borderColor: '#9370DB',
    borderRadius: 2,
    borderWidth: 1,
  },
  buttonRegister: {
    marginTop: 15,
    backgroundColor: '#9370DB'
  }
  , containerImage: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  labelDialog: {
    marginTop: -3,
    marginVertical: 5,
    color: 'white',
    fontWeight: '500',
    marginBottom: 25
  },
  imageStyle: {
    width: 140,
    height: 140,
    marginTop: -100,
  },
  text: {
    fontSize: 14,
    color: 'white'
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



/**
 *
 *
 *
 *
 *
 *
 *
*/