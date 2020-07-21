import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const Logo = () => {
  return (
    <View>
      <Image
        style={{width: 250, height: 250}}
        source={require('./logo.jpg')}
      />
    </View>
  );
};

export default Logo
