import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

export default class renderChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
        chatSelected:undefined
    };
  }

  renderItem = () =>{
    
  }

  render() {
    return (
      <View>
        <Text> renderChat </Text>
      </View>
    );
  }
}
