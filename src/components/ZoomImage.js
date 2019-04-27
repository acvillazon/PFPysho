import { Image, Dimensions,Text } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import React, { Component } from 'react'
import { Button } from 'native-base';


export default class App extends React.Component {


  render() {
    return (
      <ImageZoom  cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height-130}
        imageWidth={200}
        imageHeight={200}>
        <Image style={{ width: 200, height: 200 }}
          source={{ uri: this.props.uri }} />
      </ImageZoom>
    )
  }
}