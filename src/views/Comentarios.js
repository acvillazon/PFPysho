import React, { Component } from 'react';
import {
    Card, CardItem, Thumbnail, Text, Button,
    Icon, Left, Body, Right, View, List, ListItem
} from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import ActionButton from 'react-native-action-button';
import wallpaper from '../images/wallpaper.png';
import firebase from '../config/firebase';
import Dialog from "react-native-dialog";

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
        }
    }


    componentDidMount() {
        var tit = this.props.navigation.getParam("tit")
        var msj = this.props.navigation.getParam("msj")
        var idtemp = this.props.navigation.getParam("id")
        this.setState({ titulo: tit, mensaje: msj, id: idtemp })

        firebase.getAllCommentsForum(idtemp, comments => {
            var comment = []
            comments.forEach(obj => {
                comment.push(obj.mensaje)
            })

            this.setState({ comentarios: comment })
            //console.log(this.state.comentarios)
        })

    }

    showDialog = () => {
        this.setState({ dialogVisible: true });

    }

    handleCancel = () => {
        this.setState({ dialogVisible: false });
    }

    handlePost = (title, message) => {
        this.setState({ dialogVisible: false });
        alert(title)
        alert(message)
        this._uploadComments(message,this.state.id)
    }

    _uploadComments = async (message,id) =>{
        await firebase.UploadCommentsForum(message,id);
    }


    _renderItem = item => {
        return (
            <List>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={wallpaper} />
                    </Left>
                    <Body>
                        <Text>Kumar Pratik</Text>
                        <Text>{this.state.comentarios[item.index]}</Text>
                    </Body>
                    <Right>
                        <Text note>3:43 pm</Text>
                    </Right>
                </ListItem>
            </List>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Card>
                    <CardItem>
                        <Left>
                            <Thumbnail source={wallpaper} />
                            <Body>
                                <Text>{this.state.titulo}</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                <Text>{this.state.mensaje}</Text>
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
                            <Button transparent >
                                <Icon active name="chatbubbles" style={{ color: '#F035E0' }} />
                                <Text style={{ color: '#F035E0' }}> Comments</Text>
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
                    <Dialog.Title>Ecribe una pregunta</Dialog.Title>
                    <Dialog.Input label="Titulo" onChangeText={(titcomentario) => this.setState({ titcomentario })} />
                    <Dialog.Input label="Comentario" onChangeText={(msjcomentario) => this.setState({ msjcomentario })} />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Post" onPress={() => this.handlePost(this.state.titcomentario, this.state.msjcomentario)} />
                </Dialog.Container>
                <ActionButton onPress={this.showDialog} buttonColor="#F035E0">
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton>
            </View>
        )
    }



}


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    }
})