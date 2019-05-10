import React, { Component } from "react";
import Firebase from '../config/firebase'
import { Platform, View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import { Container, Header, Content, Accordion, Left, Button, Right, Body, Text} from "native-base";
import { Feather } from 'react-native-vector-icons'
const dataArray = [
    { title: "First Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
];
export default class AccordionExample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: undefined,
            data: [],
            loading:false
        }
    }

    componentDidMount = async () => {
        this.setState({loading:true})
        var contenido = await Firebase.allRegisterUser(this.props.navigation.getParam("id"))
        //console.log("contenido")
        //console.log(contenido)
        this.setState({ data: contenido, loading: false })
        this.setState({ id: this.props.navigation.getParam("id")})
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#6f54da' }}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Feather name="arrow-left" color="white" size={30} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={[{color:'white'},{fontSize:13}]}>Historial de registros de asistencias</Text>
                    </Body>
                    <Right/>
                </Header>
                <Content padder>
                    <Accordion dataArray={this.state.data}
                    />
                    {this.state.loading == true
                        ? <View style={styles.indicator}>
                            <ActivityIndicator size="large" color="green" />
                        </View>
                        : null
                    }
                </Content>
            </Container>
        );
    }
}

var styles = StyleSheet.create({
    indicator:{
        position: "absolute",
        backgroundColor:"black",
        opacity:0.7,
        height:Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        justifyContent:'center'
    }
})