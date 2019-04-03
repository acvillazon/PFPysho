import React, { Component } from 'react'
import firebaseApp from '../config/firebase'
import { StyleSheet, View } from 'react-native'

import {
    Text,
    Label,
    Input,
    Button,
    Item
} from 'native-base'

export class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: 'andres@hotmail.com',
            password: '123456',
        }
    }

    onPressLogin = async () => {
        const user = {
            email: this.state.email,
            password: this.state.password,
        };
        firebaseApp.login(user, this.loginSuccess, this.loginFailed);
    };

    loginSuccess = async () => {
        var ExistinDatabase = true;
        alert('Inicio de sesion exitoso');

        await firebaseApp.CheckNewUser()
            .then(exist => {
                console.log(exist + "DedeLogin")
                ExistinDatabase = exist
            })

        if (ExistinDatabase) {
            this.props.navigation.navigate('chat',
                {
                    name: this.state.email
                })
        } else {
            this.props.navigation.navigate('register')
        }

    };
    loginFailed = () => {
        alert('Login failure. Please tried again.');
    };
    // methods to handle user input and update the state
    onChangeTextEmail = email => this.setState({ email });
    onChangeTextPassword = password => this.setState({ password });

    render() {
        return (
            <View style={[styles.container,{backgroundColor:"#757575"}]}>
                <Item floatingLabel last style={styles.login}>
                    <Label>Username</Label>
                    <Input
                        value={this.state.email}
                        onChangeText={this.onChangeTextEmail}
                    />
                </Item>
                <Item floatingLabel last style={styles.login}>
                    <Label>Password</Label>
                    <Input
                        value={this.state.password}
                        onChangeText={this.onChangeTextPassword}
                    />
                </Item>
                <Button success block style={styles.btnlogin} onPress={() => this.onPressLogin()}>
                    <Text> Success </Text>
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: 'center',
        paddingHorizontal: 40
    },
    login: {
        marginVertical: 10
    },
    btnlogin: {
        marginHorizontal: 10,
        marginVertical: 10,
    }
});

export default Login