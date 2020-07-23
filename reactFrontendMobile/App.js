import React from 'react';

import Navigation from './src/Navigation';
import {Provider, connect} from 'react-redux';
import store from './src/store';
import {NavigationContainer} from "@react-navigation/native";
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';


const theme = {
    ...DefaultTheme,
    roundness: 4,
    colors: {
        ...DefaultTheme.colors,
        primary: '#00675b',
        accent: '#c56200',
    },
};

const App = (props) => {
    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Navigation/>
                </NavigationContainer>
            </PaperProvider>
        </Provider>
    );
};


export default App
