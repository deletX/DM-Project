import React, {Component} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Logo from './src/Logo';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import {CLIENT_ID} from './src/constants/constants';

export default class App2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      idToken: '',
      accessToken: '',
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: CLIENT_ID, // client ID of type WEB for your server(needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
    });
  }

  onLogin = () => {
    Alert.alert(
      'Credentials',
      `username: ${this.state.username} \npassword:${this.state.password}`,
    );
  };

  googleLogin = () => {
    GoogleSignin.signIn().then((data) => {
      //console.log('TEST ' + JSON.stringify(data));
      console.log('scopes: ' + JSON.stringify(data.scopes));
      console.log('serverAuthCode: ' + JSON.stringify(data.serverAuthCode));
      console.log('ID token: ' + JSON.stringify(data.idToken));
      console.log('user: ' + JSON.stringify(data.user));
      this.setState({
        idToken: data.idToken,
      });
      const currentUser = GoogleSignin.getTokens().then((res) => {
        this.setState({
          accessToken: res.accessToken,
        });
        const postData = {
          access_token: res.accessToken,
          code: data.idToken,
        };

        console.log('Access token: ' + this.state.accessToken); //<-------Get accessToken
      });
      Alert.alert('Google Credentials', `ID TOKEN: ${this.state.idToken}`);
      Alert.alert(
        'Google Credentials',
        `ACCESS TOKEN: ${this.state.accessToken}`,
      );
    });
  };r

  render() {
    return (
      <View style={styles.container}>
        <Logo />
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({username})}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />

        <Button
          title={'Sign in now!'}
          style={styles.input}
          onPress={this.onLogin}
        />
        <GoogleSigninButton
          onPress={this.googleLogin}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
        />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
