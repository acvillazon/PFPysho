import React from 'react';
import { StyleSheet, View, WebView} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import { Constants } from 'expo';
 
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <WebView
          bounces={false}
          scrollEnabled={false} 
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/reactnativepf.appspot.com/o/AC201822319663.pdf?alt=media&token=9a301548-55a0-430b-930d-f2b8501c0657' }} />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

/*
<PDFReader
          source={{ uri: "https://firebasestorage.googleapis.com/v0/b/reactnativepf.appspot.com/o/AC201822319663.pdf?alt=media&token=9a301548-55a0-430b-930d-f2b8501c0657" }}
        />

*/ 