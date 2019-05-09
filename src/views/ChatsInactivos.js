import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, StyleSheet,Image } from 'react-native';
import { Text, Label, Button, ListItem, Left, Right, Body, Thumbnail,Badge} from 'native-base'
import { LoadCategory } from '../../accion/CategoryAction'
import firebase from '../config/firebase'
import { connect } from 'react-redux';
import {LoadChatInactivo } from '../../accion/ChatAction'
import { withNavigation } from 'react-navigation';
import { AntDesign} from 'react-native-vector-icons'
import splah_chat from '../images/splash_chat3.png'


class Citas_Inactivas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
      dialogVisible: false,
      categoriesp: undefined,
      dialogWaiting: false,
      chats: [],
      chatReady: false,
      newMessage:new Object()
    };
  }

  async componentDidMount() {
    await firebase.getChat(this.props.credentials.Auth.usuario.tipo,(a)=>{},async (chats) => {
      await this.props.SaveChats(chats[1])
      this.setState({ chats: chats[0] })
      setTimeout(() => {this.setState({ chatReady: true })}, 1000)
    },(idChat) =>{
      var snap = this.state.newMessage
      snap[idChat] = idChat
      this.setState({ newMessage: snap })
    });
    //await this.setState({chats:this.props.inactivos,newMessage:this.props.badge,chatReady:this.props.ready})

  }

  componentWillUnmount() {
    if (firebase.LogOutUsuario(firebase.uid)) {
      //alert("Se Ha cerrado sesión")
    }
  }

  chatPress = async (id) => {
    var result = this.props.chats.chat.filter(chat => { return chat.id == id })
    if (result.length > 0) {
      this.props.navigation.navigate("chat", { actual: result[0], id: id, state:"inactivo" })
      var snap = this.state.newMessage
      snap[id] = undefined
      this.setState({ newMessage: snap })
      firebase.deleteChat_NewMessage(result[0])
    } else {
      alert("No se pudo obtener la conversación")
    }
  }
  
  renderItemChat = (item) => {
    var nombre_user = this.props.chats.chat[item.index].partner.usuario.nombres
    var apellidos_user = this.props.chats.chat[item.index].partner.usuario.apellidos
    try {
      return (
        <ListItem avatar>
          <Left>
            <Thumbnail source={{ uri: 'https://ui-avatars.com/api/?background=31bdff&color=fff&name=' + nombre_user + '+' + apellidos_user + '&rounded=true&size=50' }} style={{ width: 50, height: 50 }} />
          </Left>
          <Body>
              <Button transparent onPress={() => this.chatPress(this.props.chats.chat[item.index].id)}>
                <View>
                  <Text style={{color:'#626567'}}>{this.props.chats.chat[item.index].body.tipo}</Text>
                  <Text note>{this.props.chats.chat[item.index].partner.usuario.nombres}</Text>
                </View>

              </Button>
            </Body>
            <Right>
              <View style={[{ flex: 1 }, { flexDirection: 'row' }]}>
                {this.state.newMessage[this.props.chats.chat[item.index].id] != undefined
                  ?
                  <View style={[{ justifyContent: 'center' }, { marginRight: 5 }]}>
                    <Badge warning style={[{ justifyContent: 'center' }]}>
                      <AntDesign name="exclamation" size={15} />
                    </Badge>
                  </View>
                  : null
                }
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
        {this.state.chatReady == true ?
          <FlatList
            style={{ ƒlex: 1 }}
            data={this.state.chats}
            numberOfLines={5}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemChat}
          />

          : <View style={Styles.splah}>
              <Image style={[{marginLeft:30}]} source={splah_chat}></Image>
              <Text style={[{color:'#808388'},{marginTop: 30}]}>No hay chats disponibles</Text>
            </View>}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  splah:{
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    paddingLeft: 0,
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
    chats: state.chatsInactivos
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SaveCategories: (cat) => dispatch(LoadCategory(cat)),
    SaveChats: (chat) => dispatch(LoadChatInactivo(chat))
  }
}
const citas = withNavigation(Citas_Inactivas)

export default connect(mapStateToProps, mapDispatchToProps)(citas)