import React from 'react';
import { StyleSheet, View } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import { Constants } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uri: undefined
    }
  }

  componentDidMount() {
    this.setState({ uri: this.props.navigation.getParam('uri') })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.uri == undefined
          ? null
          :
          <PDFReader
            source={{ uri: this.state.uri }}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});