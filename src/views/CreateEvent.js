import React, { Component } from 'react';
import { View, StyleSheet} from 'react-native';
import { Header, Button, Input, Item, Textarea, Text } from 'native-base'
import TimeDatePicker from '../views/TimeDatePcker'
import firebase from '../config/firebase'

export default class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionEvent: '',
            nameEvent: '',
            timeStart: undefined,
            timeEnd: undefined,
            timeStartChoose: undefined,
            timeEndChoose: undefined,

            dateChoose: undefined,
            date: undefined
        };
    }

    _handleDatePicked = (date, dataformat) => {
        this.setState({ dateChoose: dataformat, date })
    };

    _handleTimePicked = (tipo, date, timeFormat) => {
        if (tipo == "1") {
            this.setState({ timeStartChoose: timeFormat, timeStart: date })
        } else {
            this.setState({ timeEndChoose: timeFormat, timeEnd: date })

        }
    };

    _onChangeEventDescription = descriptionEvent => {
        if (descriptionEvent.length < 600) {
            this.setState({ descriptionEvent })
        } else {
            alert("La descripciones de eventos solo permiten 100 palabras")
        }
    }

    _onChangeEventName = nameEvent => {
        this.setState({ nameEvent })
    }

    sendEvent = async () => {
        if (
            this.state.dateChoose != undefined
            && this.state.timeStartChoose != undefined
            && this.state.timeEndChoose != undefined
            && this.state.timeEnd > this.state.timeStart
            && this.state.nameEvent != ''
            && this.state.descriptionEvent != ''
        ) {
            await firebase.addNewEvent(this.state.date, this.state.dateChoose, this.state.timeStartChoose, this.state.timeEndChoose, this.state.nameEvent, this.state.descriptionEvent)
            alert("Evento agregado")
            this.props.navigation.navigate("calendar")

            this.setState({
                descriptionEvent: '',
                nameEvent: '',

                timeStart: undefined,
                timeEnd: undefined,
                timeStartChoose: undefined,
                timeEndChoose: undefined,

                dateChoose: undefined,
                date: undefined
            })

        } else {
            console.log(this.state)
            alert("Existen campos sin llenar o la hora del evento esta erronea")
        }
    }

    render() {
        return (
            <View style={[{ flex: 1 }]}>
                <Header />
                <View style={styleCreateEvent.containerAddEvent}>
                    <Text style={styleCreateEvent.titleAddEvent}>CREAR NUEVO EVENTO</Text>
                    <Item>
                        <Input
                            placeholderTextColor="#757575"
                            value={this.state.nameEvent}
                            onChangeText={this._onChangeEventName}
                            placeholder="Nombre del Evento" />
                    </Item>

                    <Textarea
                        style={[{ marginTop: 30 }]}
                        rowSpan={5}
                        value={this.state.descriptionEvent}
                        onChangeText={this._onChangeEventDescription}
                        bordered
                        placeholderTextColor="#757575"
                        placeholder="Descripción del evento" />

                    <TimeDatePicker
                        _handleDate={this._handleDatePicked.bind(this)}
                        _handleTime={this._handleTimePicked.bind(this)}
                    />

                    <Button
                        success block
                        style={styleCreateEvent.btnAddEvent}
                        onPress={() => this.sendEvent()}>

                        <Text style={{ color: "white" }}>Agregar Evento</Text>
                    </Button>
                </View>

            </View>
        );
    }
}

Border = (color) => {
    return {
        borderColor: color,
        borderWidth: 1,
    }
}

const styleCreateEvent = StyleSheet.create({
    btnAddEvent: {
        backgroundColor: "#03A9F4",
        marginTop: 20
    },
    txtAddEvent: {
        color: "white"
    },
    titleAddEvent: {
        fontSize: 20,
        paddingVertical: 10
    },
    containerAddEvent: {
        marginHorizontal: 30,
        marginTop: 20
    }
})
