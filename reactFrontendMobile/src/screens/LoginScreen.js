import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {ActivityIndicator, Button, Colors, TextInput,} from 'react-native-paper';
import Logo from '../Logo';
import {GoogleSignin, GoogleSigninButton,} from '@react-native-community/google-signin';
import {CLIENT_ID} from '../constants/constants';
import {authLogin, googleOAuthLogin} from '../actions/authActions';
import {HOME_SCREEN} from '../constants/screens';

/**
 * Login screen. It is possible to login through:
 * - Google OAuth
 * - username and password
 */
const LoginScreen = (props) => {
    const {
        authLogin,
        googleLogin,
        isLoading,
        isAuthenticated,
        navigation,
    } = props;
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

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

    /**
     * Use the google SignIn API in order to get the accessToken required by the DMProject auth flow
     */
    const googleSignIn = () => {
        GoogleSignin.signIn().then((data) => {
            GoogleSignin.getTokens()
                .then((res) => {
                    googleLogin(res.accessToken);
                })
                .catch((err) => {
                    console.log("googleSignIn error: ", err)
                });
        });
    };

    return (
        <View style={[styles.container, {flex: 1}]}>
            <Logo/>
            {!isLoading && !isAuthenticated ? (
                <>
                    <View style={styles.container}>
                        <GoogleSigninButton
                            onPress={googleSignIn}
                            size={GoogleSigninButton.Size.Standard}
                            style={[styles.login, styles.loginText]}
                            color={GoogleSigninButton.Color.Auto}/>
                        <TextInput
                            value={username}
                            label={'Username'}
                            onChangeText={(username) => setUsername(username)}
                            placeholder={'Username'}
                            style={styles.input}
                            mode="flat"/>
                        <TextInput
                            value={password}
                            label={'Password'}
                            onChangeText={(password) => setPassword(password)}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            style={styles.input}
                            mode="flat"/>
                    </View>
                    <Button
                        contentStyle={styles.loginText}
                        style={[styles.login, {marginTop: 60}]}
                        onPress={() => {
                            authLogin(username, password);
                        }}
                        mode="contained"
                        color={Colors.orange600}>
                        login
                    </Button>
                </>
            ) : (
                <ActivityIndicator animating={true} size={'large'}/>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
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
    return {
        isLoading: state.auth.loading,
        isAuthenticated: state.auth.token !== undefined,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        authLogin: (username, password) => dispatch(authLogin(username, password)),
        googleLogin: (googleToken) => dispatch(googleOAuthLogin(googleToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
