import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { DocumentPicker } from 'expo';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {withNavigation} from 'react-navigation';
import firebase from '../config/firebase';


const numColumns = 2;

class UploadDocuments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            documets: [],
            uri: [],
        }
    }

    componentDidMount(){
        firebase.getAllDocument((uri,name)=>{
            var documentos = []
            var uris = []
            uri.forEach(obj => {
                uris.push(obj.uri)
            })
            name.forEach(obj =>{
                documentos.push(obj.name)
            })
            //console.log('URI')
            //console.log(name)
            //console.log(uri)
            this.setState({uri:uris})
            this.setState({documets:documentos})
        })
    }

    _pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync()

        if (result.type == "success") {
            this.uploadDocument(result.uri,result.name)
        }
    }

    uploadDocument = async (uri, name) =>{
        
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

        var a = await firebase.uploadDocument(blob, name)
        if (a){
            alert("Succes")
        }else{
            alert("fail")
        }
        
    }


    _readPdf = index => {
        var uri = this.state.uri[index]
         this.props.navigation.navigate("pdfreader",{uri})
    }


    _renderItem = item => {
        return (
            <TouchableOpacity style={styles.item} onPress={()=>this._readPdf(item.index)}>
                <Text style={styles.itemText}>{item.item}</Text>
            </TouchableOpacity>
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
                    numColumns={numColumns}
                />
                <ActionButton buttonColor="#4527a0">
                    <ActionButton.Item buttonColor='#8c9eff' title="Pick a document" onPress={this._pickDocument}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
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
    item: {
        backgroundColor: '#e8eaf6',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: Dimensions.get('window').width / numColumns, // approximate a square
    },
    itemText: {
        color: '#303f9f',
    },
});
const docu = withNavigation(UploadDocuments) 
export default docu 
