import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title,View } from 'native-base';

export default class Cabecera extends Component {
  
  render() {
    return (
      <View >
        <Header style={[{ backgroundColor: '#4527a0' }]}>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
      </View>
    );
  }

}