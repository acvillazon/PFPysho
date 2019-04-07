import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, Dimensions } from 'react-native';
import { List, ListItem, Button, ActionSheet, Item, Text, Label } from 'native-base'
import { Dialog } from 'react-native-simple-dialogs'
import ActionButton from 'react-native-action-button';
var {height, width} = Dimensions.get('screen');


categorias0 = ['Siento tristeza', 'Transtorno alimenticio', 'Intranquilidad', 'Soledad', 'Inclusión', 'Bullying o acoso', 'Me siento en el lugar equivocado', 'No me gusta lo que estudio']

categorias1 = ['Te sientes triste, melancólico(a), deprimido(a)',
  'Ha perdido o aumentado su apetito',
  'Tuvo dificultades en conciliar el sueño, en permanecer dormido(a) o en despertarse demasiado temprano',
  'Me siento intranquilo', 'Te sientes agotado y sin energia todo el tiempo',
  'Solo/Poca compañia',
  'Siento que no valgo nada',
  'Tiene mucha más dificultad en concentrarse o en tomar decisiones de lo que es normal para Ud',
  'Piensa mucho sobre la muerte, ya sea en la suya, en la de alguien más o en la muerte en general',
  'Se siente acosado/bullying',
  'Se siente que no encaga en algun lugar',
  'No me gusta lo que estudio']


export default class Categoria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
      dialogVisible: false
    };
  }

  renderItem = (item) => {
    return (
      <View style={[{ paddingLeft: 15 }, { paddingVertical: 5 }]}>
          <TouchableHighlight style={{paddingVertical:5}} underlayColor="rgba(89,165,89,0.3)" onPress={() => console.log("A")}>
            <Text numberOfLines={5} style={[{ fontSize: 15 }, { color: '#616161' }]}>{item.item}</Text>
          </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
          <Dialog
            visible={this.state.dialogVisible}
            title="Como te sientes?"
            onTouchOutside={() => this.setState({ dialogVisible: false })} >
            <View style={{height:380}}>
              <FlatList
                data={categorias1}
                numberOfLines={5}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
              />
            </View>
            <Label style={[{ color: 'grey' }, { fontSize: 14 }]}>Si crees encajar en mas de una categoria, no te preocupes, con una bastara hasta el momento.</Label>
          </Dialog>
      </View>
    );
  }
}