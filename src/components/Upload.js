import * as React from 'react';
import { StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView,TabBar} from 'react-native-tab-view';
import UploadImages from './UploadImages';
import UploadDocuments from './UploadDocuments';

export default class Upload extends React.Component {
  
  constructor(props){
    super(props)
    this.state={
      index: 0,
      routes: [
      { key: 'first', title: 'IMÁGENES' },
      { key: 'second', title: 'ARCHIVOS PDF' },
    ],

    }
  }

  _renderTabBar = props => <TabBar {...props} pressOpacity={0.3} tabStyle={styles.tabStyles} indicatorStyle={[{backgroundColor:'#31bdff'}, {height:3}]} style={styles.tabBar}/>;


  renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <UploadImages />;
      case 'second':
        return <UploadDocuments/>;
      default:
        return null;
    }
  }
 

  render() {
    
    return (
      <TabView 
      navigationState={this.state}
      renderScene={this.renderScene}
      renderTabBar={this._renderTabBar}
      onIndexChange={index => this.setState({ index })}
      initialLayout={{ width: Dimensions.get('window').width }}
      indicatorStyle={{ backgroundColor: 'white' }}
    />
    )
  };

}

const styles = StyleSheet.create({
    tabBar:{
      backgroundColor: '#6f54da',
      fontWeight: 'bold'
    }
});


