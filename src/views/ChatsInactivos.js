import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight } from 'react-native';
import { Text, Label, Button } from 'native-base'
import { LoadCategory } from '../../accion/CategoryAction'
import firebase from '../config/firebase'
import { connect } from 'react-redux';
import {LoadChatInactivo } from '../../accion/ChatAction'
import { withNavigation } from 'react-navigation';


class Citas_Inactivas extends Component {
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
    await firebase.getChatInactivos(this.props.credentials.Auth.usuario.tipo, async (chats) => {
      await this.props.SaveChats(chats[1])
      this.setState({ chats: chats[0] })
      setTimeout(() => {this.setState({ chatReady: true })}, 1000)
    });
  }

  componentWillUnmount() {
    if (firebase.LogOutUsuario(firebase.uid)) {
      alert("Se Ha cerrado sesión")
    }
  }

  chatPress = async (id) => {
    var result = this.props.chats.chat.filter(chat => { return chat.id == id })
    if (result.length > 0) {
      this.props.navigation.navigate("chat", { actual: result[0], id: id, state:"inactivo" })

    } else {
      alert("No se pudo obtener la conversación")
    }
  }

  renderItemChat = (item) => {
    try {
      return (
        <View style={[{ flex: 1 },{flexDirection:'row'}, Border("red")]}>
          <TouchableHighlight style={{flex:3}} onPress={() => this.chatPress(this.props.chats.chat[item.index].id)}>
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
        {this.state.chatReady == true ?
          <FlatList
            style={{ ƒlex: 1 }}
            data={this.state.chats}
            numberOfLines={5}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemChat}
          />

          : <Text>No hay Chats Disponibles</Text>}
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