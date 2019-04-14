import React, { Component } from 'react';
import {Platform, StyleSheet} from 'react-native';
import {TabView,TabBar} from 'react-native-tab-view';
import ChatsActivos from './CitasActivas'
import ChatsInactivos from './ChatsInactivos'
import { connect } from 'react-redux';

 
class TabChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            routes: [
                { key: 'first', title: 'Chats' },
                { key: 'second', title: 'Chats Archivados' },
            ],
        }
    }

    _handleIndexChange = index => this.setState({ index });

    _renderTabBar = props => <TabBar {...props} pressOpacity={0.3} tabStyle={Styles.tabStyles} indicatorStyle={[{backgroundColor:'red'}, {height:3}]} style={Styles.tabBar}/>;

   renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <ChatsActivos
      
        />
      case 'second':
        return <ChatsInactivos/>
      default:
        return null
    }
  }
   
  _renderPager(props){
     return (Platform.OS === 'IOS') ? <PagerScroll {...props} /> : <PagerPan {...props} />
  }

  render() {
     return (
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
        />
     );
  }
}

const Styles = StyleSheet.create({
    tabBar:{
      backgroundColor: '#151515',
      fontWeight: 'bold'
    }
})

const mapStateToProps = state => {
    return {
      dataCategories: state.categories,
      credentials: state.credentials,
      chats: state.chats
    }
  }
  
const mapDispatchToProps = dispatch => {
    return {
      SaveCategories: (cat) => dispatch(LoadCategory(cat)),
      SaveChats: (chat) => dispatch(LoadChat(chat))
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(TabChat)

/**
 * 
 * <Episodes 
                  navigation={this.props.navigation} 
                  episodes={this.props.data} 
                  seasons={this.props.seasons}
                  setSeason={this.props.setSeason} 
                  seasonActive={this.props.seasonActive}/>;
 * 
 */