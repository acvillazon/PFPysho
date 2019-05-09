//CAMBIO
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import BottomNavigation, {
  IconTab,
  Badge
} from 'react-native-material-bottom-navigation'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import {MaterialIcons} from 'react-native-vector-icons'

import Chat from './TabViewChat'
import Calendar from './Calendar'
import Upload from '../components/Upload'
import Foro from './CategoriasForo'
import Phone from '../components/EmergencyCall'

export default class Menu extends React.Component {
  state = {
    activeTab: 'chat'
  }

  tabs = [
    {
      key: 'chat',
      label: 'Games',
      barColor: '#9370DB',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'message'
    },
    {
      key: 'calendar',
      label: 'Movies & TV',
      barColor: '#9370DB',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'movie'
    },
    {
      key: 'upload',
      label: 'Music',
      barColor: '#9370DB',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'music-note'
    },
    {
      key: 'foro',
      label: 'Books',
      barColor: '#9370DB',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'book'
    },
    {
      key: 'phone',
      label: 'Books',
      barColor: '#9370DB',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'book'
    }
  ]

  state = {
    activeTab: this.tabs[0].key
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
        return <Phone />
        break
      default:
        return <View><Text>NOOOOO</Text></View>
      break
    }
  }

  renderIcon = icon => ({ isActive }) => (
    <MaterialIcons size={24} color="white" name={icon} />
  )

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










/*
import React, { Component } from 'react';
import { View, StyleSheet, Icon,Image, TouchableHighlight } from 'react-native';
import { Button, Text, Card, CardItem, Body } from 'native-base'
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'



class Menu extends Component {


  state={
    activeTab:'CHAT'
  }
   
  tabs  = [
    { key: 'CHAT',  icon: 'movie', barColor: '#B71C1C',
    pressColor: 'rgba(255, 255, 255, 0.16)' },
     { key: 'CALENDAR',  icon: 'movie', barColor: '#B71C1C',
     pressColor: 'rgba(255, 255, 255, 0.16)'}, 
     { key: 'FORO', icon: 'movie', barColor: '#B71C1C',
     pressColor: 'rgba(255, 255, 255, 0.16)' }, 
     { key: 'UPLOAD', icon: 'movie', barColor: '#B71C1C',
     pressColor: 'rgba(255, 255, 255, 0.16)' },
      { key: 'PHONE', icon: 'movie', barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)'}
  ]

  state = {
    activeTab: this.tabs[0].key
  }


  select = (name) => {
      if (name == 'CHAT'){
        this.props.navigation.navigate('tabViewChat')
      }
      if (name == 'CALENDAR'){
        this.props.navigation.navigate('calendar')
      }
      if(name == 'FORO'){
        this.props.navigation.navigate('categoriasforo')
      }
      if(name == 'UPLOAD'){
        this.props.navigation.navigate('upload')
      }
      if(name == 'PHONE'){
        this.props.navigation.navigate('emergencycall')
      }
  }


  renderItem = ({ item, index }) => {
    return (
      <Card style={styles.item} >
        <CardItem>
          <Body style={{alignItems:'center'}}>
              <Image source={item.image}/>
          </Body>
        </CardItem>
        <CardItem>
          <Body style={{alignItems:'center'}}>
            <TouchableHighlight block primary onPress={()=>this.select(item.key)}>
              <Text>{item.key}</Text>
            </TouchableHighlight>
          </Body>
        </CardItem>
      </Card>
    )
  }

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color="white" name={icon} />
  )

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          { Your screen contents depending on current tab. }
        </View>
        <BottomNavigation
          onTabPress={newTab => this.setState({ activeTab: newTab.key })}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      </View>
    );
  }
}

Bordera = (color) => {
  return {
    borderColor: color,
    borderWidth: 2,
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin:20,
  },
  itemText: {
    color: '#303f9f',
  },
});


export default Menu;


*/