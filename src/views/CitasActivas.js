import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Citas_Activas extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected:undefined
    };
  }

  render() {
    return (
      <View>
        <Text> Citas Activas </Text>
      </View>
    );
  }
}
