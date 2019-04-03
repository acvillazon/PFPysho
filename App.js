import React from 'react';
import { View, Text, SafeAreaView, Platform} from 'react-native';
import { Font } from 'expo';
import AppContainer from './src/components/Stack'
import { Provider, connect } from 'react-redux'

let platform = Platform.OS;
let platformSpecificStyle = {}
platformSpecificStyle = platform === 'ios' ? {marginTop:20}:{marginTop:24}

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      loading:true
    }
  }

  //Preparar las Fuentes.
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (!this.state.loading) {
      return (
        <SafeAreaView style={[{ flex: 1 }]}>
          <View style={[Border("red"), { flex: 1 }, platformSpecificStyle]}>
            <AppContainer />
          </View>
        </SafeAreaView>
      );

    }else{
      return(
        <View>
          <Text>...</Text>
        </View>
      )
    }
  }
}

Border = (color) => {
  return {
    borderColor: color,
    borderWidth: 1,
  }
}