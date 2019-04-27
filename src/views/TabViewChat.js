import React, { Component } from 'react';
import {Platform, StyleSheet,View, Text} from 'react-native';
import {TabView,TabBar} from 'react-native-tab-view';
import ChatsActivos from './CitasActivas'
import ChatsInactivos from './ChatsInactivos'
import { connect } from 'react-redux';
import firebase from '../config/firebase'
import {LoadChatInactivo, LoadChat } from '../../accion/ChatAction'

 
class TabChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            //chatAid:[],
            //chatIid:[],
            //chatReadyA:false,
            //chatReadyI:false,
            //newMessage:undefined,
            routes: [
                { key: 'first', title: 'Chats' },
                { key: 'second', title: 'Chats Archivados' },
            ],
        }
    }

    componentDidMount = async() =>{
      /*await firebase.getChat(this.props.credentials.Auth.usuario.tipo, 
        async (chatsActivos)=>{
        console.log(chatsActivos)
        await this.props.SaveChatsActivo(chatsActivos[1])
        this.setState({ chatAid: chatsActivos[0] })
        setTimeout(() => {this.setState({ chatReadyA: true })}, 1000)

      },async (chatsInactivos) => {
        console.log(chatsInactivos)
        await this.props.SaveChatsInactivo(chatsInactivos[1])
        this.setState({ chatIid: chatsInactivos[0] })
        setTimeout(() => {this.setState({ chatReadyI: true })}, 1000)

      },(idChat) =>{
        console.log(idChat)

        var snap = this.state.newMessage
        snap[idChat] = idChat
        this.setState({ newMessage: snap })

      });*/
    }

    componentWillUnmount(){
      firebase.refOffFirestoreTabChat()
    }

    _handleIndexChange = index => this.setState({ index });

    _renderTabBar = props => <TabBar {...props} pressOpacity={0.3} tabStyle={Styles.tabStyles} indicatorStyle={[{backgroundColor:'white'}, {height:3}]} style={Styles.tabBar}/>;

   renderScene = ({ route }) => {
      switch (route.key) {
        case 'first':
          return <ChatsActivos
              //activos={this.state.chatAid}
              //badge={this.state.newMessage}
              //ready={this.state.chatReadyA}
  
          />
        case 'second':
          return <ChatsInactivos
              //inactivos={this.state.chatIid}
              //badge={this.state.newMessage}
              //ready={this.state.chatReadyI}
          />
        default:
          return null
      }
  }
   
  _renderPager(props){
     return (Platform.OS === 'IOS') ? <PagerScroll {...props} /> : <PagerPan {...props} />
  }

  render() {
     return (
       /*<View style={{flex:1}}>
         {this.state.chatAid.length>0 && this.state.chatIid.length>0
          ? 
*/
          <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
       />
        /* : <View><Text>BOOO</Text></View>
        }
       </View>*/
     );
  }
}

const Styles = StyleSheet.create({
    tabBar:{
      backgroundColor: '#1976D2',
      fontWeight: 'bold'
    }
})

const mapStateToProps = state => {
    return {
      dataCategories: state.categories,
      credentials: state.credentials,
      
      ChastA: state.chats,
      ChatsI: state.chatsInactivos
    }
  }
  
const mapDispatchToProps = dispatch => {
    return {
      SaveCategories: (cat) => dispatch(LoadCategory(cat)),

      SaveChatsActivo: (chat) => dispatch(LoadChat(chat)),
      SaveChatsInactivo: (chat) => dispatch(LoadChatInactivo(chat))
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