import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import ActionButton from 'react-native-action-button'
import firebase from '../config/firebase'
import { Ionicons } from 'react-native-vector-icons'
import { Dialog } from 'react-native-simple-dialogs'
import { Button } from 'native-base';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';


LocaleConfig.locales['fr'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun', 'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo.', 'Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.']
};

LocaleConfig.defaultLocale = 'fr';

class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      itemsMarked: {},
      dialogVisible: false,
      descripcion: '',
      screenHeight: 0,
      loading: false
    };
  }

  async componentDidMount() { this.getEventos() }

  async getEventos() {
    this.setState({ loading: true })
    await firebase.getAllEvent((items, itemsMarked) => {
      this.setState({ items, itemsMarked })
      this.setState({ loading: false })
    })
  }

  onContentSizeChange = (Width, Height) => {
    this.setState({ screenHeight: Height })
  }

  componentWillUnmount() {
    firebase.refOffFirestoreCalendar()
  }

  createEvent = () => { this.props.navigation.navigate("createEvent") }

  _extraInformation = (data) => {
    this.setState({ descripcion: data, dialogVisible: true })
  }

  _isRefreshing = () => { this.getEventos() }

  rowHasChanged(r1, r2) { return r1.name !== r2.name; }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];

  }
  renderItem(item) {
    return (
      <View style={[styles.item, { height: 100 }, { flex: 1 }, { flexDirection: 'row' }]}>
        <View style={{ flex: 6 }}>
          <Text style={[{ fontSize: 20 }]}>{item.nombre}</Text>
          <Text style={[{ color: "#9E9E9E" }]}>Hora de inicio {item.timeStart}</Text>
          <Text style={[{ color: "#9E9E9E" }]}>Hora de finalización {item.timeEnd}</Text>
        </View>
        <View style={[{ flex: 1 }, { justifyContent: "center" }, { textAlign: "right" }]}>
          <TouchableHighlight onPress={() => this._extraInformation(item.descripcion)}>
            <Ionicons name="md-eye" size={27} style={[{ color: "#7B7D7D" }]} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <Agenda
          monthFormat={"MMMM yyyy"}
          items={this.state.items}
          // callback that gets called when day changes while scrolling agenda list
          onDayChange={(day) => { console.log('day changed') }}
          selected={new Date()}
          renderItem={this.renderItem.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          refreshing={false}
          theme={{
            agendaDayTextColor: '#7B7D7D',
            agendaDayNumColor: '#7B7D7D',
            agendaTodayColor: '#9370DB',
            agendaKnobColor: '#9370DB'
          }}
          renderEmptyData={() => <View style={[{ flex: 1 }, { justifyContent: "center" }, { alignItems: 'center' }]}><Text>NO EXISTEN EVENTOS EN ESTA FECHA</Text></View>}
          onRefresh={() => this._isRefreshing()}
          markedDates={this.state.itemsMarked}
        />
        {this.props.credentials.Auth.usuario.tipo == "1"
          ?
          <ActionButton
            buttonColor="#9370DB"
            renderIcon={() => <Ionicons name="md-calendar" size={30} color="#fff" />}
            onPress={() => this.createEvent()} />
          : null
        }


        {this.state.loading == true
          ? <View style={styles.indicator}>
            <ActivityIndicator size="large" color="#9370DB" />
          </View>
          : null
        }

        <Dialog
          visible={this.state.dialogVisible}
          title="Descripcion del evento"
          onTouchOutside={() => this.setState({ dialogVisible: false })} >
          <ScrollView
            scrollEnabled={true}
          >
            <Text style={{ fontSize: 16 }}>{this.state.descripcion}</Text>
            <View style={{ marginTop: 10 }}>
              <Button onPress={() => this.setState({ dialogVisible: false })} rounded block style={[{ padding: 10 }, { backgroundColor: '#9370DB' }]}>
                <Text style={[{ color: "white" }]}>Cerrar</Text>
              </Button>
            </View>
          </ScrollView>
        </Dialog>
      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: 'center',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  indicator: {
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.7,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  return {
    credentials: state.credentials,
  }
}
const Nav = withNavigation(AgendaScreen)
export default connect(mapStateToProps, null)(Nav)
/**
 *
 * <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2019-05-22'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
         // monthFormat={'yyyy'}
         // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
 *
 *
 *
 *
 *
 *
 *
 * <Agenda
  // the list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key kas to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  items={
    {'2012-05-22': [{text: 'item 1 - any js object'}],
     '2012-05-23': [{text: 'item 2 - any js object'}],
     '2012-05-24': [],
     '2012-05-25': [{text: 'item 3 - any js object'},{text: 'any js object'}],
    }}
  // callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
  // callback that fires when the calendar is opened or closed
  onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
  // callback that gets called on day press
  onDayPress={(day)=>{console.log('day pressed')}}
  // callback that gets called when day changes while scrolling agenda list
  onDayChange={(day)=>{console.log('day changed')}}
  // initially selected day
  selected={'2012-05-16'}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={'2012-05-10'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2012-05-30'}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // specify how each item should be rendered in agenda
  renderItem={(item, firstItemInDay) => {return (<View />);}}
  // specify how each date should be rendered. day can be undefined if the item is not first in that day.
  renderDay={(day, item) => {return (<View />);}}
  // specify how empty date content with no items should be rendered
  renderEmptyDate={() => {return (<View />);}}
  // specify how agenda knob should look like
  renderKnob={() => {return (<View />);}}
  // specify what should be rendered instead of ActivityIndicator
  renderEmptyData = {() => {return (<View />);}}
  // specify your item comparison function for increased performance
  rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
  // Hide knob button. Default = false
  hideKnob={true}
  // By default, agenda dates are marked if they have at least one item, but you can override this if needed
  markedDates={{
    '2012-05-16': {selected: true, marked: true},
    '2012-05-17': {marked: true},
    '2012-05-18': {disabled: true}
  }}
  // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
  onRefresh={() => console.log('refreshing...')}
  // Set this true while waiting for new data from a refresh
  refreshing={false}
  // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
  refreshControl={null}
  // agenda theme
  theme={{
    ...calendarTheme,
    agendaDayTextColor: 'yellow',
    agendaDayNumColor: 'green',
    agendaTodayColor: 'red',
    agendaKnobColor: 'blue'
  }}
  // agenda container style
  style={{}}
/>
 */