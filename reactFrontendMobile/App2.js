import React, {Component} from 'react';
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Spinner, Content} from 'native-base';
import Logo from './src/Logo';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {CLIENT_ID} from './src/constants/constants';

const googleLogin = () => {
  GoogleSignin.signIn().then((data) => {
    console.log('TEST ' + JSON.stringify(data));

    const currentUser = GoogleSignin.getTokens().then((res) => {
      console.log(res.accessToken); //<-------Get accessToken
      var postData = {
        access_token: res.accessToken,
        code: data.idToken,
      };
    });
  });
};

export default class App2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '283420556311-tpt22dt7i551nup0pmrihp2a6j1qse7r.apps.googleusercontent.com', // client ID of type WEB for your server(needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
    });
  }

  onLogin() {
    const {username, password} = this.state;

    Alert.alert('Credentials', `${username} + ${password}`);
  }

  render() {
    return (
      <View style={styles.container}>
        <Logo/>
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
          onPress={this.onLogin.bind(this)}
        />
        <GoogleSigninButton
          onPress={googleLogin}
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
