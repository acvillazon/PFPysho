import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Button, Text, Label } from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker-nevo';
import { FontAwesome } from 'react-native-vector-icons'

export default class DateTimePickerTester extends Component {
    state = {
        isDateTimePickerVisible: false,
        isTimeDatePickerVisible: false,
        dateChoose: undefined,
        timeStartChoose: undefined,
        timeEndChoose: undefined,
        timeStart: undefined,
        timeEnd: undefined,
        tipo: undefined
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true })

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _showTimeDatePicker = (tipo) => {
        this.setState({ tipo })
        this.setState({ isTimeDatePickerVisible: true })
    }

    _hideTimeDatePicker = () => this.setState({ isTimeDatePickerVisible: false });


    _handleDatePicked = (date) => {
        var timeTemp = new Date().getFullYear
        var dateChoose = date.toLocaleDateString()
        var Split = dateChoose.toString().split("/")

        var year = date.getFullYear()
        var month = Split[0]
        var day = Split[1]
        dateChoose = year+"-"+month+"-"+day

        this.setState({ dateChoose })
        this._hideDateTimePicker();
        this.props._handleDate(date, dateChoose)
    };

    _handleTimePicked = async (date) => {
        var timeTemp = new Date()
        timeTemp = date

        var timeChoose = date.toTimeString().slice(0, 5)
        if (this.state.tipo == "1") {
            this.setState({ timeStartChoose: timeChoose, timeStart: date.getTime() })
            this.props._handleTime(this.state.tipo, date, timeChoose)
        } else {

            if (this.state.timeStart > timeTemp.getTime()) {
                alert("La fecha de finalización no puede ser menor a la inical")

            } else if (this.state.timeStart == undefined) {
                alert("Elige primero una fecha inicial")
            } else {
                this.setState({ timeEndChoose: timeChoose })
                this.props._handleTime(this.state.tipo, date, timeChoose)
            }
        }
        this._hideTimeDatePicker()
    };

    render() {
        return (
            <View>
                <View style={styles.containerClock}>

                    <View style={[{ flexDirection: "row" }]}>
                        <Button bordered block
                            style={styles.btnClock}
                            onPress={() => this._showDateTimePicker()}
                        >
                            <Text style={styles.textClock}>Seleccionar la fecha del evento</Text>
                        </Button>
                        <FontAwesome style={styles.icons}  name="calendar-o" size={26} />
                    </View>
                    <Label style={styles.labelClock}>

                        {this.state.dateChoose != undefined 
                            ? "Fecha: " + this.state.dateChoose 
                            : ""}
                    </Label>

                </View>

                <View style={[{ marginTop: 20 }]}>

                    <View style={styles.containerClock}>

                        <View style={[{ flexDirection: "row" }]}>

                            <Button
                                style={styles.btnClock}
                                bordered block
                                onPress={() => this._showTimeDatePicker("1")}
                            >
                                <Text style={styles.textClock}>Seleccionar hora de inicio</Text>
                            </Button>

                            <FontAwesome style={styles.icons}  name="clock-o" size={26} />
                        </View>

                        <Label style={styles.labelClock}>{this.state.timeStartChoose != undefined ? "Hora: " + this.state.timeStartChoose : ""}</Label>

                    </View>

                    <View style={styles.containerClock}>
                        <View style={[{ flexDirection: "row" }]}>
                            <Button
                                style={styles.btnClock}
                                bordered block
                                onPress={() => this._showTimeDatePicker("2")}
                            >
                                <Text style={styles.textClock}>Seleccionar hora de finalización</Text>
                            </Button>
                            <FontAwesome style={styles.icons} name="clock-o" size={26} />
                        </View>
                        <Label style={styles.labelClock}>{this.state.timeEndChoose != undefined ? "Hora: " + this.state.timeEndChoose : ""}</Label>

                    </View>

                </View>

                <DateTimePicker
                    mode="time"
                    is24Hour={false}
                    isVisible={this.state.isTimeDatePickerVisible}
                    onConfirm={this._handleTimePicked}
                    onCancel={this._hideTimeDatePicker}
                />

                <DateTimePicker
                    style={[{ marginTop: 50 }]}
                    mode="date"
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerClock: {
        marginTop: 10
    },
    icons:{
        alignSelf: 'center',
        color: /*"#FF5252"*/ "#9370DB"  ,
        paddingLeft: 10,
        flex: 1
    },
    labelClock:{
        fontSize:12
    },
    textClock:{
        fontSize:12,
        color:"#9370DB"
    },
    btnClock:{
        borderColor:"#9370DB",
        flex:12
    }
})