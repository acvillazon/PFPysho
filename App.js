import React from 'react';
import { View, Text, SafeAreaView, Platform } from 'react-native';
import { Font } from 'expo';
import AppContainer from './src/components/Stack'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import combineReducer from './reducer/CombineReducer' 
import thunk from 'redux-thunk';


const store = createStore(combineReducer)

let platform = Platform.OS;
let platformSpecificStyle = {}
let platformSpecificStyle2 = undefined
platformSpecificStyle = platform === 'ios' ? { marginTop: 20 } : { marginTop: 24 }
platformSpecificStyle2 = platform === 'ios' ?  20  : 24 


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
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
    return (
      <Provider store={store}>
        {!this.state.loading 
        ?

          <SafeAreaView style={[{ flex: 1 }]}>
            <View style={[Border("red"), { flex: 1 }]}>
              <View style={[{height:platformSpecificStyle2},{backgroundColor:'#6f54da'}]}></View>
              <AppContainer />
            </View>
          </SafeAreaView> 
        :

          <View>
            <Text>...</Text>
          </View>}
      </Provider>
    )
    }
}

Border = (color) => {
  return {
    borderColor: color,
    borderWidth: 0,
  }
}