import React, { Component } from 'react';
import {
  Card, CardItem,
  Thumbnail, Text, Button, Icon, Left, Body, Right
} from 'native-base';
import firebase from '../config/firebase';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Dialog from "react-native-dialog";
import wallpaper from '../images/wallpaper.png';
import ActionButton from 'react-native-action-button';

export default class CardImageExample extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fechas: [],
      preguntas: [],
      titulos: [],
      ids: [],
      categoria: undefined,
      dialogVisible: false,
      dates: [],
      titulo: '',
      mensaje: '',
    }
  }

  componentDidMount() {
    var cate = this.props.navigation.getParam("cat")
    this.setState({ categoria: cate })
    firebase.getAllQuestionsForum(cate.item, (pregs, ids) => {
      var fech = []
      var preg = []
      var tit = []
      
      pregs.forEach(obj => {
        fech.push(obj.fecha)
        preg.push(obj.pregunta)
        tit.push(obj.titulo)

        /*
        
          var sem = obj.fecha.seconds*1000
          var fechas = new Date()

          fechas.setTime(sem)
          var fechasFormat = fechas.toISOString()
          alert(fechasFormat)
        
        */

      })
      console.log(preg)
      this.setState({ fechas: fech, preguntas: preg, titulos: tit, ids })

    })
  }

  _renderItem = item => {
    return (
      <Card style={{ flex: 0 }}>
        <CardItem>
          <Left>
            <Thumbnail source={wallpaper} />
            <Body>
              <Text>{this.state.titulos[item.index]}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              {this.state.preguntas[item.index]}
            </Text>
          </Body>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent>
              <Icon active name="thumbs-up" />
              <Text>12 Likes</Text>
            </Button>
          </Left>
          <Body>
            <Button transparent onPress={() => this.props.navigation.navigate('comentarios',
              { id: this.state.ids[item.index], tit: this.state.titulos[item.index], msj: this.state.preguntas[item.index] })}>
              <Icon active name="chatbubbles" />
              <Text> Comments</Text>
            </Button>
          </Body>
          <Right>
            <Text>{this.state.dates[item.index]}</Text>
          </Right>
        </CardItem>
      </Card>
    )
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });

  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handlePost = (title, message) => {
    this.setState({ dialogVisible: false });
    this._uploadForo(title, message, this.state.categoria.item)
  };

  _uploadForo = async (title, message, categoria) => {
    await firebase.UploadDatosForo(title, message, categoria);
  }


  render() {
    return (
      <View style={[{ backgroundColor: '#fff' },{flex:1}]}>
        <FlatList
          extraData={this.state}
          data={this.state.preguntas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        />
  
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Ecribe una pregunta</Dialog.Title>
            <Dialog.Input label="Titulo" onChangeText={(titulo) => this.setState({ titulo })} />
            <Dialog.Input label="Mensaje" onChangeText={(mensaje) => this.setState({ mensaje })} />
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Post" onPress={() => this.handlePost(this.state.titulo, this.state.mensaje)} />
          </Dialog.Container>

        <ActionButton onPress={this.showDialog} buttonColor="#F035E0">
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F035E0',
    height: 40,
    marginTop: 10,
    width: Dimensions.get('window').width - 40,
    borderRadius: 20,
    zIndex: 100,
  },
})



