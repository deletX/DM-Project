import {applyMiddleware, createStore} from 'redux';
import rootReducer from './reducers/index';
import thunk from 'redux-thunk';

const initialState = {};
const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default store;
