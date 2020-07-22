import React, {Component} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View, ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import {Button, TextInput} from 'react-native-paper';
import Logo from '../Logo';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import {CLIENT_ID} from '../constants/constants';
import {authLogin, googleOAuthLogin} from '../actions/authActions';
import NativeToastAndroid from 'react-native/Libraries/Components/ToastAndroid/NativeToastAndroid';

const LoginScreen = ({authLogin, googleLogin}) => {
  //
  // username: '',
  // password: '',
  // idToken: '',
  // googleToken: '',
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [googleToken, setGoogleToken] = React.useState('');

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: CLIENT_ID, // client ID of type WEB for your server(needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
    });
  });

  const onLogin = () => {
    Alert.alert('Credentials', `username: ${username} \npassword:${password}`);
    authLogin(username, password).catch((err) => {
      ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
      console.log(err);
    });
  };

  const googleSignIn = () => {
    GoogleSignin.signIn().then((data) => {
      //console.log('TEST ' + JSON.stringify(data));
      console.log('scopes: ' + JSON.stringify(data.scopes));
      console.log('serverAuthCode: ' + JSON.stringify(data.serverAuthCode));
      console.log('ID token: ' + JSON.stringify(data.idToken));
      console.log('user: ' + JSON.stringify(data.user));
      // this.setState({
      //   idToken: data.idToken,
      // });
      const currentUser = GoogleSignin.getTokens().then((res) => {
        // this.setState({
        //   accessToken: res.accessToken,
        // });
        setGoogleToken(res.accessToken);

        const postData = {
          access_token: res.accessToken,
          code: data.idToken,
        };

        console.log('Access token: ' + googleToken); //<-------Get accessToken
        // Alert.alert('Google Credentials', `ID TOKEN: ${this.state.idToken}`);
        Alert.alert('Google Credentials', `ACCESS TOKEN: ${googleToken}`);
        googleLogin(googleToken);
      });
    });
  };

  return (
    <View style={styles.container}>
      <Logo />
      <TextInput
        value={username}
        onChangeText={(username) => setUsername(username)}
        placeholder={'Username'}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(password) => setPassword(password)}
        placeholder={'Password'}
        secureTextEntry={true}
        style={styles.input}
      />

      <Button
        title={'Sign in now!'}
        style={styles.input}
        onPress={onLogin}
        mode="outlined">
        titolo
      </Button>
      <GoogleSigninButton
        onPress={googleSignIn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
      />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

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
  },
});

const mapStateToProps = (state) => {
  //prendi var da stato
  return {};
};

const mapDispatchToProps = (dispatch) => {
  //prendi le azioni da fare
  return {
    authLogin: (username, password) => dispatch(authLogin(username, password)),
    googleLogin: (googleToken) => dispatch(googleOAuthLogin(googleToken)),
  };
};
//username, password dispatchiamo la funzione authlogin, la mandi a chi la deve fare
//istruzioni/compito
//auth login è un azione, prende user e pass e fa il logn interrogando server, dammi il token
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
