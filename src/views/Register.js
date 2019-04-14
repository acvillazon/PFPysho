import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, TextInput } from 'react-native'

import { Text, Input, Label, Item, Button, DatePicker, Picker } from 'native-base'
import { Ionicons } from 'react-native-vector-icons'

var { width, height } = Dimensions.get('screen');

import firebase from '../config/firebase'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateChoosen: new Date(),
            selected: undefined,
            nombres: '',
            apellidos: '',
            codigo: undefined,
            semestre:undefined,
            carrera:undefined
        }
    }

    setDate = newDate => {
        this.setState({ dateChoosen: newDate });
    }

    setTypeUser = value => {
        this.setState({ selected: value });
    }

    onChangeNombres = nombres => {
        this.setState({ nombres })
    }

    onChangecodigo = codigo => {
        this.setState({ codigo })
    }

    onChangesemestre = semestre => {
        this.setState({ semestre })
    }

    onChangecarrera = carrera => {
        this.setState({ carrera })
    }

    onChangeApellidos = apellidos => {
        this.setState({ apellidos })
    }

    registerNewUser = async () => {
        if (this.state.selected != undefined && this.state.nombres != '' && this.state.apellidos != '') {
            timesMilles = (this.state.dateChoosen).valueOf()

            var newUser = {
                nombres: this.state.nombres,
                apellidos: this.state.apellidos,
                nacimiento: timesMilles,
                tipo: this.state.selected,
                state: false,
                numChat: 0,
                carrera:this.state.carrera,
                semestre:this.state.semestre,
                codigo:this.state.codigo
            }
            await firebase.RegisterUserForFirstAccess(newUser).then(status => {
                alert("Usuario Registrado!")
                this.props.navigation.navigate('login')
            })
        } else {
            alert("Complete Todos los Campos.")
        }
    }

    render() {
        return (
            <KeyboardAvoidingView enable behavior="padding" style={[styles.container, styles.center]}>
                <View>
                    <Label style={[{ color: "#757575", fontSize: 15 }]}>Nombres</Label>
                    <Item>
                        <Input
                            value={this.state.nombres}
                            onChangeText={this.onChangeNombres}
                        />
                    </Item>
                </View>

                <View>
                    <Label style={[{ color: "#757575", fontSize: 15 }]}>Apellidos</Label>
                    <Item>
                        <Input
                            value={this.state.apellidos}
                            onChangeText={this.onChangeApellidos}
                        />
                    </Item>
                </View>

                <View style={[styles.select]}>
                    <Label style={[{ color: "#757575", fontSize: 15 }]}>Fecha de nacimiento</Label>
                    <DatePicker
                        defaultDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"spinner"}
                        placeHolderText="Select date"
                        textStyle={{ color: "green" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.setDate}
                        disabled={false}
                    />
                </View >

                <View style={[styles.select]}>
                    <Label style={[{ color: "#757575", fontSize: 15 }]}>Tipo de usuario</Label>
                    <Item picker>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Ionicons style={{ right: 30 }} name="ios-arrow-down" />}
                            placeholder="Select..."
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selected}
                            onValueChange={this.setTypeUser}
                        >   
                            <Picker.Item label="Seleccionar..." value="100" />                            
                            <Picker.Item label="Estudiante" value="0" />
                            <Picker.Item label="Psicologo" value="1" />
                        </Picker>
                    </Item>
                </View>

                {this.state.selected == "0"
                    ?
                    <View>
                        <View>
                            <Label style={[{ color: "#757575", fontSize: 15 }]}>Codigo estudiantil</Label>
                            <Item>
                                <Input
                                    value={this.state.codigo}
                                    onChangeText={this.onChangecodigo}
                                />
                            </Item>
                        </View>

                        <View>
                            <Label style={[{ color: "#757575", fontSize: 15 }]}>Semestre</Label>
                            <Item>
                                <Input
                                    value={this.state.semestre}
                                    onChangeText={this.onChangesemestre}
                                />
                            </Item>
                        </View>

                        <View>
                            <Label style={[{ color: "#757575", fontSize: 15 }]}>Carrera</Label>
                            <Item>
                                <Input
                                    value={this.state.carrera}
                                    onChangeText={this.onChangecarrera}
                                />
                            </Item>
                        </View>

                    </View>
                    : null
                }

                <Button success block onPress={this.registerNewUser}>
                    <Text> REGISTRAR </Text>
                </Button>
            </KeyboardAvoidingView>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        marginLeft: 30,
        marginRight: 30

    },
    select: {
        marginTop: 10
    },
    center: {
        height: height,
        justifyContent: "center"
    }
})

export default Register
