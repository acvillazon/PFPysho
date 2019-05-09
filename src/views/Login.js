import React, { Component } from 'react'
import firebaseApp from '../config/firebase'
import {
    StyleSheet, View, Dimensions, ActivityIndicator,
    ImageBackground, TextInput, TouchableOpacity, Image
} from 'react-native'
import { connect } from 'react-redux'
import { addAuth } from '../../accion/User'
import { Notifications, Permissions, SQLite } from 'expo'
import { BaseModel, types } from 'expo-sqlite-orm'
import wallpaper from '../images/wallpaper.png'
import userimage from '../images/username.png'
import passwordimage from '../images/password.png'

import {
    Text
} from 'native-base'

class TokenTable extends BaseModel {
    constructor(obj) {
        super(obj)
    }

    static get database() {
        return async () => SQLite.openDatabase('psycho.db')
    }

    static get tableName() {
        return 'token'
    }

    static get columnMapping() {
        return {
            id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
            Pushtoken: { type: types.TEXT, not_null: true },
            timestamp: { type: types.INTEGER, default: () => Date.now() }
        }
    }
}
const db = SQLite.openDatabase('psycho.db');


class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            email: 'adriana@gmail.com',
            password: '123456',
        }
    }

    CheckToken = async (NewToken) => {
        //TokenTable.destroyAll()
        await db.transaction(tx => {
            tx.executeSql('select * from token where id=?', [1], (_, { rows }) => {
                console.log("SI Existe")
                console.log(rows)
            }, () => {
                console.log("No Existe")
                TokenTable.createTable()
                console.log("Tabla Creada!!!")

            });
        });

        var res = TokenTable.findBy({ id_eq: 1 })
        //console.log(Promise.resolve(res).then(value =>{return value}))
        var response = await Promise.resolve(res).then((value) => {
            return value
        })
        //console.log(response)
        if (response == null) {
            //console.log("newToken ->" + NewToken.toString())
            var object = {
                id: 1,
                Pushtoken: NewToken.toString()
            }
            TokenTable.create(object)
            //alert("Objeto Creado!")
            return true
        } else {
            var Lasttoken = response.Pushtoken

            if (NewToken.toString() == Lasttoken.toString()) {
                //alert("mismo Token")
                return false
            } else {
                var object = {
                    id: 1,
                    Pushtoken: NewToken.toString()
                }
                TokenTable.update(object)
                //alert("Objeto actualizado")
                return true
            }
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
        //Obtener el Token para notificaciones.
        let token = await Notifications.getExpoPushTokenAsync();
        var res = await this.CheckToken(token)
        if (res) {
            firebaseApp.RegisterTokenInUsers(token)
            //alert("NO__SAME")
        } else {
            //alert("SAME")
        }
    }

    onPressLogin = async () => {
        this.setState({ loading: true })
        const user = {
            email: this.state.email,
            password: this.state.password,
        };
        //Loguear con autenticacion de Firebase.
        firebaseApp.login(user, this.loginSuccess, this.loginFailed);
    };

    loginSuccess = async () => {
        var user = undefined
        var ExistinDatabase = true;
        //console.log("Inicio de sesion exitoso")

        await firebaseApp.getUser().then((value) => {
            if (value[0]) {
                ExistinDatabase = value[0]
                user = value[1]
            }
        })

        if (ExistinDatabase) {
            this.registerForNotification();
            await this.props.saveAuth(user)
            await firebaseApp.LogInUsuario(firebaseApp.uid)
            this.setState({ loading: false })

            this.props.navigation.navigate('menu',
                {
                    name: this.state.email
                })
        } else {
            this.props.navigation.navigate('register')
            this.setState({ loading: false })

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
            <ImageBackground source={wallpaper} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View floatingLabel >
                        <Image source={userimage} style={styles.inlineImg} />
                        <TextInput
                            style={styles.input}
                            value={this.state.email}
                            onChangeText={this.onChangeTextEmail}
                            placeholderTextColor="white"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View floatingLabel last >
                        <Image source={passwordimage} style={styles.inlineImg} />
                        <TextInput
                            style={styles.input}
                            value={this.state.password}
                            onChangeText={this.onChangeTextPassword}
                            placeholderTextColor="white"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <TouchableOpacity success block
                        style={styles.button}
                        onPress={() => this.onPressLogin()}
                        activeOpacity={1}>
                        <Text style={styles.text}>LOGIN</Text>
                    </TouchableOpacity>

                    {this.state.loading == true
                        ? <View style={styles.indicator}>
                            <ActivityIndicator style={styles.indicatorA} size="large" color="green" />
                        </View>
                        : null
                    }
                </View>
            </ImageBackground>
        )
    }
}



const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: 'center',

    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F035E0',
        height: 40,
        marginTop: 10,
        width: DEVICE_WIDTH - 40,
        borderRadius: 20,
        zIndex: 100,

    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    indicator: {
        position: "absolute",
        backgroundColor: "black",
        opacity: 0.7,
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        justifyContent: 'center'
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: DEVICE_WIDTH - 40,
        height: 40,
        paddingLeft: 45,
        marginVertical: 15,
        borderRadius: 20,
        color: '#ffffff',

    },
    inlineImg: {
        position: 'absolute',
        zIndex: 99,
        width: 22,
        height: 22,
        left: 15,
        top: 23,
    },
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
