import * as React from 'react';
import {
    Text, View, StyleSheet, StatusBar,
    FlatList, TouchableHighlight
} from 'react-native';
import { DocumentPicker } from 'expo';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';
import firebase from '../config/firebase';
import { List, ListItem, Thumbnail, Left, Body, Button } from 'native-base';
import pdfpic from '../images/pdf.png'
import { connect } from 'react-redux';


class UploadDocuments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            documets: [],
            uri: [],
        }
    }

    componentDidMount() {
        firebase.getAllDocument((uri, name) => {
            var documentos = []
            var uris = []
            uri.forEach(obj => {
                uris.push(obj.uri)
            })
            name.forEach(obj => {
                documentos.push(obj.name)
            })
            //console.log('URI')
            //console.log(name)
            //console.log(uri)
            this.setState({ uri: uris })
            this.setState({ documets: documentos })
        })
    }

    _pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync()

        if (result.type == "success") {
            this.uploadDocument(result.uri, result.name)
        }
    }

    uploadDocument = async (uri, name) => {

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        var a = await firebase.uploadDocument(blob, name)
        if (a) {
            alert("Documento cargado")
        } else {
            alert("Error al cargar el documento")
        }

    }


    _readPdf = index => {
        var uri = this.state.uri[index]
        this.props.navigation.navigate("pdfreader", { uri })
    }

    Border = (color) => {
        return {
            borderColor: color,
            borderWidth: 1,
        }
    }


    _renderItem = item => {
        return (
            <TouchableHighlight style={[Border("yellow")]} onPress={() => this._readPdf(item.index)}>
                <List>
                    <ListItem thumbnail>
                        <Left>
                            <Thumbnail square source={pdfpic} style={styles.pdfimage} />
                        </Left>
                        <Body>
                            <TouchableHighlight style={[Border("yellow"),{paddingVertical:20}]} onPress={() => this._readPdf(item.index)}>
                                <Text style={styles.itemText}>{item.item}</Text>

                            </TouchableHighlight>
                        </Body>
                    </ListItem>
                </List>
            </TouchableHighlight>
        )
    }



    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#fff' }]}>
                <FlatList
                    extraData={this.state}
                    data={this.state.documets}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                />
                {this.props.credentials.Auth.usuario.tipo == "1"
                    ?
                    <ActionButton buttonColor="#674fb7">
                        <ActionButton.Item buttonColor='#31bdff' title="Pick a document" onPress={this._pickDocument}>
                            <Icon name="md-create" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                    : null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scene: {
        flex: 1,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    pdfimage: {
        height: 40,
        width: 40,
    },
});

const mapStateToProps = state => {
    return {
        credentials: state.credentials,
    }
}

const docu = withNavigation(UploadDocuments)
export default connect(mapStateToProps, null)(docu)