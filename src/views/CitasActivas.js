import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight } from 'react-native';
import { Text, Label } from 'native-base'
import { Dialog } from 'react-native-simple-dialogs'
import { LoadCategory } from '../../accion/CategoryAction'
import firebase from '../config/firebase'
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux';
import { LoadChat } from '../../accion/ChatAction'

class Citas_Activas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
      dialogVisible: false,
      categoriesp: undefined,
      dialogWaiting: false,
      chats: [],
      chatReady: false
    };
  }

  async componentDidMount() {
    await firebase.getChat(this.props.credentials.Auth.usuario.tipo, async (chats) => {
      console.log("Nuevo Mensaje")
      await this.props.SaveChats(chats[1])
      this.setState({ chats: chats[0] })
      setTimeout(() => {this.setState({ chatReady: true })}, 1000)
    });
  }

  async componentWillMount() {
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
      alert("Se Ha cerrado sesión")
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
    } else {
      setTimeout(() => { this.chatPress(result2[0]) }, 600)
    }
    this.setState({ dialogWaiting: false })
  }


  chatPress = async (id) => {
    var result = this.props.chats.chat.filter(chat => { return chat.id == id })

    if (result.length > 0) {
      this.props.navigation.navigate("chat", { actual: result[0], id: id })

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

  renderItemChat = (item) => {
    try {
      return (
        <View style={{ flex: 1 }}>
          <TouchableHighlight onPress={() => this.chatPress(this.props.chats.chat[item.index].id)}>
            <Text style={[{ paddingVertical: 10 }, { paddingHorizontal: 4 }]}>{this.props.chats.chat[item.index].body.tipo}-{this.props.chats.chat[item.index].partner.usuario.nombres}</Text>
          </TouchableHighlight>
        </View>
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
            data={this.state.chats}
            numberOfLines={5}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemChat}
          />

          : <Text>No hay Chats Disponibles</Text>}

        {this.props.credentials.Auth.usuario.tipo == "3"
          ?
          null
          :
          <ActionButton
            buttonColor="rgba(89,165,89,1)"
            onPress={() => this.setState({ dialogVisible: true })} />
        }
      </View>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Citas_Activas)