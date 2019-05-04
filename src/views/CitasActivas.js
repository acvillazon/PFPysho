//CAMBIO
import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, Image, Alert } from 'react-native';
import { Label, Button, ListItem, Left, Body, Right, Thumbnail, Text, Badge } from 'native-base'
import { Dialog } from 'react-native-simple-dialogs'
import { LoadCategory } from '../../accion/CategoryAction'
import firebase from '../config/firebase'
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux';
import { LoadChat } from '../../accion/ChatAction'
import { AntDesign, MaterialIcons } from 'react-native-vector-icons'
import { withNavigation } from 'react-navigation';

class Citas_Activas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
      dialogVisible: false,
      categoriesp: undefined,
      dialogWaiting: false,
      chats: [],
      chatReady: false,
      newMessage: new Object()
    };
  }

  async componentDidMount() {
    await firebase.getChat(this.props.credentials.Auth.usuario.tipo, async (chats) => {
      await this.props.SaveChats(chats[1])
      this.setState({ chats: chats[0] })
      setTimeout(() => { this.setState({ chatReady: true }) }, 1000)
    },(a)=>{},(idChat) => {
      var snap = this.state.newMessage
      snap[idChat] = idChat
      this.setState({ newMessage: snap })
    });

    //await this.setState({chats:this.props.activos,newMessage:this.props.badge,chatReady:this.props.ready})
    //console.log(this.props)
    var categories = await firebase.LoadCategories()
    this.props.SaveCategories(categories)
    prepareCategory = []
    categories.map((value) => {
      prepareCategory.push(value.nombre)
    })
    this.setState({ categoriesp: prepareCategory })
  }

  componentWillUnmount() {
    if (firebase.LogOutUsuario(firebase.uid)) {
      //alert("Se Ha cerrado sesión")
    }
  }

  _CreateNewChat = async (item) => {
    var result = this.props.dataCategories.categories.filter((data) => {
      return data.nombre == item
    })
    this.setState({ dialogWaiting: true })
    this.setState({ dialogVisible: false })
    var result2 = await firebase.CreateNewChat(result[0].nombre, this.props.credentials.Auth)

    if (result2 == false) {
      alert("No hay psicologos disponibles, intente mas tarde")
      this.setState({ dialogWaiting: false })
    } else {
      setTimeout(() => {
        this.chatPress(result2[0])
        this.setState({ dialogWaiting: false })
      }, 1000)
    }
  }


  chatPress = async (id) => {
    var result = this.props.chats.chat.filter(chat => { return chat.id == id })
    if (result.length > 0) {
      this.props.navigation.navigate("chat", { actual: result[0], id: id, state: "activo" })
      var snap = this.state.newMessage
      snap[id] = undefined
      this.setState({ newMessage: snap })
      firebase.deleteChat_NewMessage(result[0])
    } else {
      alert("No se pudo obtener la conversación")
    }
  }


  renderItem = (item) => {
    return (
      <View style={[{ paddingLeft: 15 }, { paddingVertical: 5 }]}>
        <TouchableHighlight style={{ paddingVertical: 5 }} underlayColor="rgba(89,165,89,0.3)" onPress={() => this._CreateNewChat(item.item)}>
          <Text numberOfLines={5} style={[{ fontSize: 15 }, { color: '#616161' }]}>{item.item}</Text>
        </TouchableHighlight>
      </View>
    )
  }

  _dialogVisible = async () => {
    var user = await firebase.getUser(firebase.uid)
    var user = user[1]
    if (user.usuario.numChat < 5) {
      this.setState({ dialogVisible: true })
    } else {
      alert("ha excedido el numero de chats disponibles")
    }
  }
  changeChatToInactive = (chat) => {
    if (firebase.activeToInactive(chat.id)) {
      alert("El chat ha sido cerrado y archivado")
      firebase.disminuirNumChat(chat.body.usuario)
    } else {
      alert("El no ha podido ser archivado")
    }
  }

  _alertBeforeCloseChat = (chat) => {
    Alert.alert(
      //title
      'Terminar Asistencia',
      //body
      '¿Desea cerrar la asistencia en linea?',
      [
        { text: 'No', onPress: () => { } },
        { text: 'Yes', onPress: () => this.changeChatToInactive(chat) },
      ],
      { cancelable: true }
      //clicking out side of alert will not cancel
    );
  }

  renderItemChat = (item) => {
    try {
      return (
        <ListItem avatar>
          <Left>
            <Thumbnail source={{ uri: this.props.chats.chat[item.index].partner.usuario.avatar }} />
          </Left>
          <Body>
            <Button transparent onPress={() => this.chatPress(this.props.chats.chat[item.index].id)}>
              <View>
                <Text>{this.props.chats.chat[item.index].body.tipo}</Text>
                <Text note>{this.props.chats.chat[item.index].partner.usuario.nombres}</Text>
              </View>

            </Button>
          </Body>
          <Right>
            <View style={[{ flex: 1 }, { flexDirection: 'row' }]}>
              {this.state.newMessage[this.props.chats.chat[item.index].id] != undefined
                ?
                <View style={[{justifyContent:'center'},{marginRight:5}]}>
                  <Badge warning style={[{ justifyContent: 'center' }]}>
                    <AntDesign name="exclamation" size={15} />
                  </Badge>
                </View>
                : null
              }
              <Button onPress={() => this._alertBeforeCloseChat(this.props.chats.chat[item.index])}
                transparent

              >
                <AntDesign name="closecircleo" size={24} style={{ color: "red" }} />
              </Button>
            </View>
          </Right>
        </ListItem>
      )
    } catch{
      return (
        <Text>Cargando.....</Text>
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <Dialog
          visible={this.state.dialogVisible}
          title="Como te sientes?"
          onTouchOutside={() => this.setState({ dialogVisible: false })} >
          <View style={{ height: 380 }}>
            <FlatList
              data={this.state.categoriesp}
              numberOfLines={5}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
            />
          </View>
          <Label style={[{ color: 'grey' }, { fontSize: 14 }]}>Si crees encajar en mas de una categoria, no te preocupes, con una bastara hasta el momento.</Label>
        </Dialog>

        <Dialog
          visible={this.state.dialogWaiting}
          onTouchOutside={() => this.setState({ dialogVisible: false })} >
          <View style={{ height: 80 }}>
            <Text>Creando nueva conversación</Text>
          </View>
        </Dialog>

        {this.state.chatReady == true ?
          <FlatList
            style={{ ƒlex: 1 }}
            extraData={this.state}
            data={this.state.chats}
            numberOfLines={5}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemChat}
          />

          : <Text style={{padding:20}}>No hay Chats Disponibles</Text>}

        {this.props.credentials.Auth.usuario.tipo == "1"
          ?
          null
          :
          <ActionButton
            renderIcon={() => <AntDesign name="message1" size={30} style={{ color: "white" }} />}
            buttonColor="#03A9F4"
            onPress={() => this._dialogVisible()} />
        }
      </View>
    );
  }
}

Border = (color) => {
  return {
    borderColor: color,
    borderWidth: 1,
  }
}

const mapStateToProps = state => {
  return {
    dataCategories: state.categories,
    credentials: state.credentials,
    chats: state.chats
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SaveCategories: (cat) => dispatch(LoadCategory(cat)),
    SaveChats: (chat) => dispatch(LoadChat(chat))
  }
}
const citas = withNavigation(Citas_Activas)
export default connect(mapStateToProps, mapDispatchToProps)(citas)