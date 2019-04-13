import React, {Component} from 'react'
import {Animated, Easing, View} from 'react-native';
import {StackNavigator,createStackNavigator, createAppContainer, addNavigationHelpers} from 'react-navigation'
import route from '../config/route'
//MODIFICADO PARA TRABAJAR CON REDUX

const AppStack = createStackNavigator(route,
  {
    headerMode:'none',
    initialRouteName: 'prueba',
    transitionConfig: () => ({
      transitionSpec:{
        duration: 200,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      }
    })
})

export default AppContainer = createAppContainer(AppStack);
