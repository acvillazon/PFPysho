import React, { Component } from 'react';
import { Header, Container,Content, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import { View, StyleSheet, FlatList } from 'react-native';
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
        this.setState({ photos: pics })
    }


    _foro = (item,photo) => {
        console.log(item)
        console.log(photo)
        this.props.navigation.navigate("foro", { cat: item, pic: photo })
        
    }

    _renderItem = item => {
        
        return (

            <ListItem thumbnail>
                <Left>
                    <Thumbnail square source={{ uri: this.state.photos[item.index] }} />
                </Left>
                <Body>
                    <Text>{item.item}</Text>
                    <Text note numberOfLines={1}>Expresate libremente...</Text>
                </Body>
                <Right>
                    <Button transparent onPress={() => this._foro(item,this.state.photos[item.index])}>
                        <Text>View</Text>
                    </Button>
                </Right>
            </ListItem>

        )
    }


    render() {
        //console.log(this.state.names)
        //console.log(this.state.photos)
        return (
            <Container>
                <Header style={{ backgroundColor: '#6f54da' }}>
                <Left>
                    <Text style={{ color: '#ffff' }}>FORO</Text>
                </Left>
                <Body/>
                <Right/>
                </Header>
                <Content>
                    <View style={{ backgroundColor: '#fff' }}>
                        <FlatList
                            extraData={this.state}
                            data={this.state.names}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this._renderItem}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

const foro = withNavigation(CategoriasForo)
export default foro