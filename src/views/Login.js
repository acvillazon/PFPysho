import React, { Component } from 'react'
import firebaseApp from '../config/firebase'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import {addAuth} from '../../accion/User'
import { Notifications, Permissions } from 'expo'

import {
    Text,
    Label,
    Input,
    Button,
    Item
} from 'native-base'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: 'adriana@gmail.com',
            password: '123456',
        }
    }

    registerForNotification = async () => {
        //Mirar si tengo permisos para notificaciones
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = status;
    
        //Sino tengo permisos, pedirlos.
        if (finalStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
    
          if (finalStatus !== 'granted') {
            return;
          }
        }
        alert("Si permisos")
        //Obtener el Token para notificaciones.
        let token = await Notifications.getExpoPushTokenAsync();
        alert(token)
        firebaseApp.RegisterTokenInUsers(token)
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
            var user = await firebaseApp.getAuth()
            await this.props.saveAuth(user)
            await firebaseApp.LogInUsuario(firebaseApp.uid)
            this.registerForNotification();
            this.props.navigation.navigate('activos',
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
            <View style={[styles.container, { backgroundColor: "#757575" }]}>
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

const mapStateToProps = state => {
    return {
        credentials: state.credentials,
    }
}


const mapDispatchToProps = dispatch => {
    return {
        saveAuth: (user) => dispatch(addAuth(user))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)
