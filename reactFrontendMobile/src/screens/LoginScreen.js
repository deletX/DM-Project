import React, {Component} from 'react';
import {Alert, StyleSheet, View, ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import {
  Button,
  TextInput,
  ActivityIndicator,
  Colors,
  Snackbar,
} from 'react-native-paper';
import Logo from '../Logo';
import {Toast} from 'native-base';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import {CLIENT_ID} from '../constants/constants';
import {authLogin, googleOAuthLogin} from '../actions/authActions';
import NativeToastAndroid from 'react-native/Libraries/Components/ToastAndroid/NativeToastAndroid';
import {HOME_SCREEN} from '../constants/screens';

const LoginScreen = ({
  authLogin,
  googleLogin,
  isLoading,
  isAuthenticated,
  navigation,
}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [googleToken, setGoogleToken] = React.useState('');

  if (isAuthenticated) {
    navigation.navigate(HOME_SCREEN);
  }

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: CLIENT_ID, // client ID of type WEB for your server(needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
    });
  });

  const onLogin = () => {
    //Alert.alert('Credentials', `username: ${username} \npassword:${password}`);
    authLogin(username, password).catch((err) => {
      ToastAndroid.show('This catch doesnt catch the error', ToastAndroid.SHORT);
    });
  };

  const googleSignIn = () => {
    GoogleSignin.signIn().then((data) => {
      //console.log('TEST ' + JSON.stringify(data));
      console.log('scopes: ' + JSON.stringify(data.scopes));
      console.log('serverAuthCode: ' + JSON.stringify(data.serverAuthCode));
      console.log('ID token: ' + JSON.stringify(data.idToken));
      console.log('user: ' + JSON.stringify(data.user));
      const currentUser = GoogleSignin.getTokens()
        .then((res) => {
          setGoogleToken(res.accessToken);
          const postData = {
            access_token: res.accessToken,
            code: data.idToken,
          };

          console.log('Access token: ' + res.accessToken); //<-------Get accessToken
          // Alert.alert('Google Credentials', `ID TOKEN: ${this.state.idToken}`);
          //Alert.alert('Google Credentials', `ACCESS TOKEN: ${res.accessToken}`);
          googleLogin(res.accessToken);
        })
        .catch((err) => {});
    });
  };

  return (
    <View style={[styles.container, {flex: 1}]}>
      <Logo />
      {!isLoading && !isAuthenticated ? (
        <>
          <View style={styles.container}>
            <GoogleSigninButton
              onPress={googleSignIn}
              size={GoogleSigninButton.Size.Standard}
              style={[styles.login, styles.loginText]}
              color={GoogleSigninButton.Color.Auto}
            />
            <TextInput
              value={username}
              label={'Username'}
              onChangeText={(username) => setUsername(username)}
              placeholder={'Username'}
              style={styles.input}
              mode="flat"
            />
            <TextInput
              value={password}
              label={'Password'}
              onChangeText={(password) => setPassword(password)}
              placeholder={'Password'}
              secureTextEntry={true}
              style={styles.input}
              mode="flat"
            />
          </View>
          <Button
            contentStyle={styles.loginText}
            style={[styles.login, {marginTop: 60}]}
            onPress={onLogin}
            mode="contained"
            color={Colors.orange600}>
            login
          </Button>
        </>
      ) : (
        <ActivityIndicator animating={true} size={'large'} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fffffsf',
  },
  loginText: {
    width: 235,
    height: 45,
  },

  login: {
    marginBottom: 20,
  },
  input: {
    width: 235,
    height: 55,
    marginTop: 10,
    marginBottom: 10,
    padding: 2,
  },
});

const mapStateToProps = (state) => {
  //prendi var da stato
  return {
    isLoading: state.auth.loading,
    isAuthenticated: state.auth.token !== undefined,
  };
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
