import React, { Component } from 'react';
import {
    Card, CardItem, Thumbnail, Text, Button,
    Icon, Left, Body, Right, ListItem,
    Header, Container, Content
} from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import ActionButton from 'react-native-action-button';
import firebase from '../config/firebase';
import Dialog from "react-native-dialog";
import { Feather } from 'react-native-vector-icons';
import imagenForo from '../images/imagenForo.png';


export default class Comentarios extends Component {

    constructor(props) {
        super(props)
        this.state = {
            titulo: undefined,
            mensaje: undefined,
            id: undefined,
            comentarios: [],
            dialogVisible: false,
            titcomentario: '',
            msjcomentario: '',
            picture: undefined,
        }
    }


    componentDidMount() {
        var tit = this.props.navigation.getParam("tit")
        var msj = this.props.navigation.getParam("msj")
        var idtemp = this.props.navigation.getParam("id")
        var ph = this.props.navigation.getParam("pic")
        this.setState({ titulo: tit, mensaje: msj, id: idtemp, picture: ph })

        firebase.getAllCommentsForum(idtemp, comments => {
            var comment = []
            var dates = []
            comments.forEach(obj => {
                comment.push(obj.mensaje)
                // this.convertSecondsToDate(obj.fecha)
            })
            //console.log(dates)
            this.setState({ comentarios: comment })
        })

    }

    /* convertSecondsToDate(dates) {
         var date = new Date()
         if (date != null) {
             date.setTime(dates.seconds * 1000)
         }
         console.log(date)
     }*/

    showDialog = () => {
        this.setState({ dialogVisible: true });

    }

    handleCancel = () => {
        this.setState({ dialogVisible: false });
    }

    handlePost = (message) => {
        this.setState({ dialogVisible: false });
        this._uploadComments(message, this.state.id)
    }

    _uploadComments = async (message, id) => {
        await firebase.UploadCommentsForum(message, id);
    }


    _renderItem = item => {
        return (
            <ListItem avatar>
                <Left>
                    <Thumbnail style={{ height: 40, width: 40 }} source={imagenForo} />
                </Left>
                <Body>
                    <Text style={{color:'#696969'}}>{this.state.comentarios[item.index]}</Text>
                </Body>
                <Right>

                </Right>
            </ListItem>
        )
    }

    render() {
        return (

            <Container>
                <Header style={{ backgroundColor: '#6f54da' }}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Feather name="arrow-left" color="white" size={25} />
                        </Button>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{ uri: this.state.picture }} />
                                <Body>
                                    <Text>{this.state.titulo}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={{ color: '#808080' }}>{this.state.mensaje}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent>
                                    <Icon active style={{ color: '#6f54da' }} name="thumbs-up" />
                                    <Text style={{ color: '#6f54da' }}>12 Likes</Text>
                                </Button>
                            </Left>
                            <Body>
                                <Button transparent >
                                    <Icon active name="chatbubbles" style={{ color: '#6f54da' }} />
                                    <Text style={{ color: '#6f54da' }}> Comments</Text>
                                </Button>
                            </Body>
                            <Right>
                            </Right>
                        </CardItem>
                    </Card>
                    <FlatList
                        extraData={this.state}
                        data={this.state.comentarios}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this._renderItem}
                    />
                    <Dialog.Container visible={this.state.dialogVisible}>
                        <Dialog.Title>Ecribe un comentario</Dialog.Title>
                        <Dialog.Input label="Comentario ..." onChangeText={(msjcomentario) => this.setState({ msjcomentario })} />
                        <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                        <Dialog.Button label="Post" onPress={() => this.handlePost(this.state.msjcomentario)} />
                    </Dialog.Container>

                </Content>
                <ActionButton onPress={this.showDialog} buttonColor="#674fb7">
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton>
            </Container>


        )
    }



}


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },

})