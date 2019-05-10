//CAMBIO
import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, Image, Alert, StyleSheet } from 'react-native';
import { Label, Button, ListItem, Left, Body, Right, Thumbnail, Text, Badge, Card, CardItem } from 'native-base'
import { Dialog } from 'react-native-simple-dialogs'
import { LoadCategory } from '../../accion/CategoryAction'
import firebase from '../config/firebase'
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux';
import { LoadChat } from '../../accion/ChatAction'
import { AntDesign, MaterialIcons } from 'react-native-vector-icons'
import { withNavigation } from 'react-navigation';
import splah_chat from '../images/splash_chat3.png'

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
    }, (a) => { }, (idChat) => {
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
    /*if (firebase.LogOutUsuario(firebase.uid)) {
      //alert("Se Ha cerrado sesión")
    }*/
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
      <View style={[{ paddingVertical: 5 },{alignItems:'center'},{marginBottom:10}]}>
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
    console.log("AQUI")
    console.log(chat)
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
    if(this.props.chats.chat[item.index] != undefined){
      var nombre_user = this.props.chats.chat[item.index].partner.usuario.nombres
      var apellidos_user = this.props.chats.chat[item.index].partner.usuario.apellidos
  
    }else{
      var nombre_user = "A"
      var apellidos_user = "V"
    }
    try {
      return (
        <ListItem avatar>
          <Left>
            <Thumbnail source={{ uri: 'https://ui-avatars.com/api/?background=31bdff&color=fff&name=' + nombre_user + '+' + apellidos_user + '&rounded=true&size=50' }} style={{ width: 50, height: 50 }} />
          </Left>
          <Body>
            <Button transparent onPress={() => this.chatPress(this.props.chats.chat[item.index].id)}>
              <View>
                <Text style={{ color: '#626567' }}>{this.props.chats.chat[item.index].body.tipo}</Text>
                <Text note>{this.props.chats.chat[item.index].partner.usuario.nombres}</Text>
              </View>

            </Button>
          </Body>
          <Right>
            <View style={[{ flex: 1 }, { flexDirection: 'row' }]}>
              {this.state.newMessage[this.props.chats.chat[item.index].id] != undefined
                ?
                <View style={[{ justifyContent: 'center' }, { marginRight: 10 }]}>
                  <Badge style={[{ justifyContent: 'center' }, { backgroundColor: '#7A5CD2' }]}>
                    <AntDesign color="white" name="exclamation" size={15} />
                  </Badge>
                </View>
                : null
              }

              <Button onPress={() => this._alertBeforeCloseChat(this.props.chats.chat[item.index])}
                transparent

              >
                <AntDesign name="minuscircleo" size={25} style={{ color: "#7A5CD2" }} />
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
          style={{ paddingVertical: -50 }}
          onTouchOutside={() => this.setState({ dialogVisible: false })} >
          <View style={[{ height: 60 }, { backgroundColor: '#9370DB' }, { marginHorizontal: -24 }, { marginTop: -24 },{marginBottom:20}]}>
            <View style={Styles.categoriesChat}>
              <View style={{flex:9}}>
                <Text style={[{color:'white'},{fontWeight:'500'}]}>¿Como te sientes?</Text>
              </View>
              <View style={{flex:1}}>
                <TouchableHighlight onPress={() => this.setState({ dialogVisible: false })}>
                  <AntDesign name="minuscircleo" size={23} style={{ color: "white" }} />
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={[{ height: 380 }]}>
            <FlatList
              data={this.state.categoriesp}
              numberOfLines={5}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
            />
          </View>
          <View style={[{ height: 60 }, { backgroundColor: '#9370DB' }, { marginHorizontal: -24 }, { marginBottom: -24 }]}>
            <View style={Styles.footerCategoriesChat}>
              <View style={{flex:1}}>
                <TouchableHighlight onPress={() => this.setState({ dialogVisible: false })}>
                  <AntDesign name="warning" size={23} style={{ color: "white" }} />
                </TouchableHighlight>
              </View>
              <View style={[{flex:9},{paddingHorizontal:10}]}>
                <Text style={[{fontSize:10},{color:'white'},{fontWeight:'normal'}]}>Si crees encajar en más de una categoría, no te preocupes, con una bastará hasta el momento</Text>
              </View>
            </View>
          </View>
          <View >
          </View>
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
            style={[{ ƒlex: 1 }, { marginHorizontal: 5 }]}
            extraData={this.state}
            data={this.state.chats}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemChat}
          />

          :
          <View style={Styles.splah}>
            <Image style={[{ marginLeft: 30 }]} source={splah_chat}></Image>
            <Text style={[{ color: '#808388' }, { marginTop: 30 }]}>No hay chats disponibles</Text>
          </View>
        }

        {this.props.credentials.Auth.usuario.tipo == "1"
          ?
          null
          :
          <ActionButton
            renderIcon={() => <AntDesign name="message1" size={30} style={{ color: "white" }} />}
            buttonColor="#9370DB"
            onPress={() => this._dialogVisible()} />
        }
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