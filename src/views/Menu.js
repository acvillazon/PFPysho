import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {Button,Text} from 'native-base'

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Button style={styles.btn} block primary onPress={() =>this.props.navigation.navigate('tabViewChat')}>
            <Text>Chat</Text>
        </Button>

        <Button style={styles.btn} block primary onPress={() =>this.props.navigation.navigate('calendar')}>
            <Text>Calendar</Text>
        </Button>

        <Button style={styles.btn} block primary onPress={() =>this.props.navigation.navigate('categoriasforo')}>
            <Text>Foro</Text>
        </Button>

        <Button style={styles.btn} block primary onPress={() =>this.props.navigation.navigate('upload')}>
            <Text>Upload</Text>
        </Button>

        <Button style={styles.btn} block primary onPress={() =>this.props.navigation.navigate('emergencycall')}>
            <Text>Phone</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   btn:{
       margin:20,
       paddingVertical: 10,
       paddingHorizontal: 20,
   }
})


export default Menu;
