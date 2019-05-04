import * as React from 'react';
import { View, Image, StyleSheet, StatusBar, FlatList, TouchableHighlight, Text } from 'react-native';
import { ImagePicker } from 'expo';
import { Button, Icon } from 'native-base';
import ActionButton from 'react-native-action-button';
import Prueba from './ZoomImage';
import firebase from '../config/firebase'


export default class UploadImages extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            images: [],
            current: undefined,
            visible: false
        }
    }

    componentDidMount(){
        firebase.getAllImage((images) => {
            var imagenes = []
            images.forEach(obj => {
                imagenes.push(obj.uri)
            })
            this.setState({images:imagenes})
        })
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync()

        if (!result.cancelled) {
            var nameDate = new Date().getTime()
            this.uploadImage(result.uri,nameDate.toString())
        }
    }

    uploadImage = async (uri, name) =>{
        
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response);
            };
            xhr.onerror = function() {
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
          });

        var a = await firebase.uploadImage(blob, name)
        if (a){
            alert("Succes")
        }else{
            alert("fail")
        }
        
    }

    _zoomImage = (path) => {
        this.setState({ visible: true, current: path })
    }

    _renderItem = item => {
        return (
            <View>
                <TouchableHighlight onPress={() => this._zoomImage(this.state.images[item.index])}>
                    <Image
                        style={{ width: 500, height: 500 }}
                        source={{ uri: this.state.images[item.index] }}
                    />
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#fff' }]}>
                <FlatList
                    extraData={this.state}
                    data={this.state.images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                />
                <ActionButton buttonColor="#4527a0">
                    <ActionButton.Item buttonColor='#8c9eff' title="Pick an image" onPress={this._pickImage}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>

                {this.state.visible == true
                    ?
                    <View>
                        <Button rounded buttonColor='#4527a0'
                            onPress={() => this.setState({ visible: false })} >
                            <Icon name='close' />  
                        </Button>
                        <Prueba uri={this.state.current} />
                    </View>

                    : null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});



