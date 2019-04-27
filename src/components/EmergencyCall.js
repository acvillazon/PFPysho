import React, { Component } from 'react'
import call from 'react-native-phone-call'
import {TouchableOpacity, View, Text, StyleSheet, Dimensions} from 'react-native'

const args = {
    number: '3003227737', // String value with the number to call
    prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
  }

  export default class EmergencyCall extends React.Component {
    render(){
        return(
            <View>
                <Text>
                    HOLAAAAAAAAAAA
                </Text>
                <TouchableOpacity style={styles.button}  onPress={() => {
                     call(args).catch(console.error)}}>
                <Text style={styles.text}>EMERGENCY CALL</Text>
                </TouchableOpacity>      
            </View>
           
        )
    }

}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F035E0',
        height: 40,
        marginTop:10,
        width: Dimensions.get('window').width - 40,
        borderRadius: 20,
        zIndex: 100,

    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
})

 

 
