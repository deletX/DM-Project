import React from 'react';

import Navigation from './src/Navigation';
import {Provider, connect} from 'react-redux';
import store from './src/store';

const App = (props) => {
    return (
        <Provider store={store}>
            <Navigation/>
        </Provider>
    );
};


export default App
