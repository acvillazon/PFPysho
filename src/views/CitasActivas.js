import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, BackHandler } from 'react-native';
import { Text, Label } from 'native-base'
import AppContainer from '../components/Stack'
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
      users: [],
      chatReady: false
    };
  }

  async componentDidMount() {
    var chats = await firebase.getChat(this.props.credentials.Auth.usuario.tipo);
    this.setState({ chats: chats[0] })
    await this.props.SaveChats(chats[1])
    var users = []
    for (var i = 0; i < chats[0].length; i++) {
      var hash = this.props.chats.chat[i].body.usuario.idC == firebase.uid
        ? this.props.chats.chat[i].body.usuario.idP
        : this.props.chats.chat[i].body.usuario.idC
      var res = await firebase.getUser(hash)
      users.push(res.usuario.nombres)
    }
    this.setState({ users: users })
    this.setState({ chatReady: true })
    console.log(this.state.users)
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

  _CreateNewChat = async (item) => {
    var result = this.props.dataCategories.categories.filter((data) => {
      return data.nombre == item
    })
    console.log(result[0])
    this.setState({ dialogWaiting: true })
    this.setState({ dialogVisible: false })
    var result = await firebase.CreateNewChat(result[0].nombre)
    if(result==false){
      alert("No hay psicologos disponibles, intente mas tarde")
    }else{
      
      this.props.navigation.navigate("chat",
      {
        actual: result[1],
        id: result[0]
      })
      this.setState({ chats: [] })
      var chats = await firebase.getChat(this.props.credentials.Auth.usuario.tipo);
      this.setState({ chats: chats[0] })
      await this.props.SaveChats(chats[1])
      var users = []
      for (var i = 0; i < chats[0].length; i++) {
        var hash = this.props.chats.chat[i].body.usuario.idC == firebase.uid
          ? this.props.chats.chat[i].body.usuario.idP
          : this.props.chats.chat[i].body.usuario.idC
        var res = await firebase.getUser(hash)
        users.push(res.usuario.nombres)
      }
      this.setState({ users: users })
    }
    this.setState({ dialogWaiting: false })
  }

  componentWillUnmount() {
    if (firebase.LogOutUsuario(firebase.uid)) {
      alert("Se Ha cerrado sesión")
    }
  }

  renderItemChat = (item) => {
    try{
      return (
        <View style={{ flex: 1 }}>
          <TouchableHighlight onPress={() => this.chatPress(this.props.chats.chat[item.index].id)}>
            <Text style={[{ paddingVertical: 10 }, { paddingHorizontal: 4 }]}>{this.props.chats.chat[item.index].body.tipo}-{this.state.users[item.index]}</Text>
          </TouchableHighlight>
        </View>
      )
    }catch{
      return (
        <Text>Cargando.....</Text>
      )
    }
  }

  chatPress = async (id) => {
    console.log("id.>" + id)
    var cita = await firebase.getChatOne(id)
    this.props.navigation.navigate("chat",
      {
        actual: cita,
        id: id
      })
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
  _prepareCategory = data => {
    var idC = data.id;
    var body = data.nombre;
    var categoria = {
      idC: body
    }
    return categoria;
  }

  _onPress = () => {
    this.setState({ dialogVisible: true })
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

          : <Text>Cargandoooo......</Text>}

        {this.props.credentials.Auth.usuario.tipo == "3"
          ?
          null
          :
          <ActionButton
            style={{ flex: 1 }}
            buttonColor="rgba(89,165,89,1)"
            onPress={this._onPress} />
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