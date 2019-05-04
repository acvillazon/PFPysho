import React, { Component } from 'react';
import { View, Text, FlatList, WebView, StyleSheet } from 'react-native';
import { Constants } from 'expo';

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
      <View style={styles.container}>
         <WebView
          style={{flex:1}}
          bounces={false}
          scrollEnabled={false} 
          source={{ uri: 'http://www.africau.edu/images/default/sample.pdf' }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});