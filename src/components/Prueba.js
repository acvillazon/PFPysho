import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Button,Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Label } from 'native-base';

const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
  
);
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
  };

  render() {
    return (
      <View style={[{flex:1},{paddingHorizontal:20}]}>
         <Label>Nombres</Label>
         <Label>Apellidos</Label>
         <Label>Profesion</Label>
         <Label>Semestre</Label>
         <Label>Carrera de estudio</Label>
         <Label>Fecha de nacimiento</Label>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight
  },
  scene: {
    flex: 1,
  },
});