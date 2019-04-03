import React, { Component } from 'react';
import { View, Text, FlatList, TouchableHighlight} from 'react-native';
import {List, ListItem, Button, ActionSheet, Item} from 'native-base'
import {Dialog} from 'react-native-simple-dialogs'

categorias0 = ['Siento tristeza','Transtorno alimenticio','Intranquilidad','Soledad','Inclusión','Bullying o acoso','Me siento en el lugar equivocado','No me gusta lo que estudio']

export default class Categoria extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected:undefined,
        dialogVisible:false
    };
  }

  renderItem = (item) =>{
    return(
      <View style={[{paddingLeft:15},{paddingVertical:5}]}>
        <Button transparent>
          <Text style={[{fontSize:15},{color:'grey'}]}>{item.item}</Text>
        </Button>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Button onPress={() => this.setState({dialogVisible:true})}>
          <Text>Press</Text>
        </Button>
        <Dialog
          visible={this.state.dialogVisible}
          title="Custom Dialog"
          onTouchOutside={() => this.setState({dialogVisible: false})}/>
          <View>
             <Text>Hola Mundo</Text>
          </View>
        />
      </View>
    );
  }
}


/*<List>
            <ListItem itemDivider>
              <Text>Problemas conmigo mismo*</Text>
            </ListItem>                    
            <ListItem>
              <Text>Siento tristeza*</Text>
            </ListItem>
            <ListItem>
              <Text>Transtorno alimenticio*</Text>
            </ListItem>
            <ListItem>
              <Text>Intranquilidad*</Text>
            </ListItem>
            <ListItem>
              <Text>Soledad*</Text>
            </ListItem>
            <ListItem itemDivider>
              <Text>Problemas que engloban a terceros</Text>
            </ListItem>  
            <ListItem>
              <Text>Inclusión</Text>
            </ListItem>
            <ListItem>
              <Text>bullying o acoso</Text>
            </ListItem>
            <ListItem itemDivider>
              <Text>Problema Vocacional</Text>
            </ListItem>
            <ListItem>
              <Text>Me siento en el lugar equivocado</Text>
            </ListItem>
            <ListItem>
              <Text>No me gusta lo que estudio</Text>
            </ListItem>
          </List>*/