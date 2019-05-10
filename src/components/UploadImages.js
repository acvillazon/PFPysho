import * as React from 'react';
import { View, Image, StyleSheet,Text, StatusBar, FlatList, TouchableHighlight, Dimensions } from 'react-native';
import { ImagePicker } from 'expo';
import { Button, Icon } from 'native-base';
import ActionButton from 'react-native-action-button';
import Prueba from './ZoomImage';
import firebase from '../config/firebase'
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';


const numColumns = 2;


class UploadImages extends React.Component {

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
            alert("Imagen cargada")
        }else{
            alert("Error al cargar la imagen")
        }

        
        
    }

    _zoomImage = (path) => {
        this.setState({ visible: true, current: path })
    }

    _renderItem = item => {
        return (
            <View style={{marginHorizontal:5}}>
                <TouchableHighlight onPress={() => this._zoomImage(this.state.images[item.index])}>
                    <Image
                        style={{height: Dimensions.get('window').width / numColumns,width: Dimensions.get('window').width / numColumns}}
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
                    ItemSeparatorComponent={() => <View style={{height:5}}><Text></Text></View>}
                    numColumns={numColumns}
                />
                {this.props.credentials.Auth.usuario.tipo == "1"
                ?
                <ActionButton buttonColor="#674fb7">
                    <ActionButton.Item buttonColor='#31bdff' title="Pick an image" onPress={this._pickImage}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
                : null}
                {this.state.visible == true
                    ?
                    <View>
                        <Button rounded style={{backgroundColor:'#674fb7'}}
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
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: Dimensions.get('window').width / numColumns, // approximate a square
        
    },
});

const mapStateToProps = state => {
    return {
      credentials: state.credentials,
    }
}

const docu = withNavigation(UploadImages)
export default connect(mapStateToProps, null)(docu)

