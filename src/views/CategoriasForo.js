import React, { Component } from 'react';
import {List, ListItem, Thumbnail, Text, Left, Body, Right, Button} from 'native-base';
import { View, StyleSheet, FlatList} from 'react-native';
import firebase from '../config/firebase';
import { withNavigation } from 'react-navigation';

class CategoriasForo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            names: [],
            photos: [],
        }
    }

    async componentDidMount() {
        var namesTemp = await firebase.LoadCategories()
        var temp = []
        var pics = []
        namesTemp.forEach(obj => {
            temp.push(obj.nombre)
            pics.push(obj.foto)
        })
        this.setState({ names: temp })
        this.setState({photos:pics})
    }


    _foro = item => {
        this.props.navigation.navigate("foro",{cat:item})
    }

    _renderItem = item => {
        return (
            <List>
                <ListItem thumbnail>
                    <Left>
                        <Thumbnail square source={{uri: this.state.photos[item.index]}} />
                    </Left>
                    <Body>
                        <Text>{item.item}</Text>
                        <Text note numberOfLines={1}>A place to talk about whatever you want...</Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=>this._foro(item)}>
                            <Text>View</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>
        )
    }


    render() {
        //console.log(this.state.names)
        //console.log(this.state.photos)
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <FlatList
                    extraData={this.state}
                    data={this.state.names}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }
}

const foro = withNavigation(CategoriasForo)
export default foro
