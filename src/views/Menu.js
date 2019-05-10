//CAMBIO
import React from 'react'
import { View, Text } from 'react-native'
import BottomNavigation, {
  IconTab,
  Badge
} from 'react-native-material-bottom-navigation'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import {MaterialCommunityIcons, AntDesign,FontAwesome, 
  Feather } from 'react-native-vector-icons'
import firebase from '../config/firebase'


import Chat from './TabViewChat'
import Calendar from './Calendar'
import Upload from '../components/Upload'
import Foro from './CategoriasForo'


import call from 'react-native-phone-call'

const args = {
  number: '3003227737', 
  prompt: false 
}


export default class Menu extends React.Component {
  state = {
    activeTab: 'chat'
  }

  tabs = [
    {
      key: 'chat',
      label: 'chat',
      barColor: '#9370db',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'wechat'
    },
    {
      key: 'calendar',
      label: 'calendar',
      barColor: '#9370db',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'calendar'
    },
    {
      key: 'upload',
      label: 'upload',
      barColor: '#9370db',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'file'
    },
    {
      key: 'foro',
      label: 'foro',
      barColor: '#9370db',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'forum'
    },
    {
      key: 'phone',
      label: 'phone',
      barColor: '#9370db',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'phone-call'
    }
  ]

  state = {
    activeTab: this.tabs[0].key
  }

  componentWillUnmount(){
    firebase.LogOutUsuario(firebase.uid)
  }


  renderTabs() {
    switch (this.state.activeTab) {
      case 'chat':
        return <Chat />
        break
      case 'calendar':
        return <Calendar />
        break
      case 'upload':
        return <Upload />
        break
      case 'foro':
        return <Foro />
        break
      case 'phone':
        call(args).catch(console.error)
        break
      default:
        return <View><Text>NOOOOO</Text></View>
      break
    }
  }

  renderIcon = icon => ({ isActive }) => {
    
    if(icon == 'wechat'){
      return(
        <AntDesign size={24} color="white" name={icon} />
      )
    }
    if(icon == 'calendar'){
      return(
      <AntDesign size={24} color="white" name={icon} />
      )
    }
    if(icon == 'file'){
      return(
      <FontAwesome size={24} color="white" name={icon} />
      )
    }
    if(icon == 'forum'){
      return(
      <MaterialCommunityIcons size={24} color="white" name={icon} />
      )
    }
    if(icon == 'phone-call'){
      return(
      <Feather size={24} color="white" name={icon} />
      )
    }
    
   }

  renderTab = ({ tab, isActive }) => (
    <IconTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
    
  )

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {this.renderTabs()}
        </View>
        <BottomNavigation
          tabs={this.tabs}
          activeTab={this.state.activeTab}
          onTabPress={newTab => this.setState({ activeTab: newTab.key })}
          renderTab={this.renderTab}
          useLayoutAnimation
        />
      </View>
    )
  }
}