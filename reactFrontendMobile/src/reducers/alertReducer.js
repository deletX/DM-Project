import uuid from 'react-native-uuid';
import {ADD_ALERT, REMOVE_ALERT, REMOVE_ALL_ALERTS} from '../actions/types';

const initialState = [];

const addAlert = (state, action) => {
  //window.scrollTo(0, 0); // scroll top in order to show alert
  return [
    ...state,
    {
      text: action.text,
      style: action.style,
      id: uuid.v4(),
    },
  ];
};

const removeAlert = (state, action) => {
  return state.filter((alert) => {
    return alert.id !== action.id;
  });
};

const removeAllAlerts = (state, action) => {
  return initialState;
};

const alertsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ALERT:
      return addAlert(state, action);
    case REMOVE_ALERT:
      return removeAlert(state, action);
    case REMOVE_ALL_ALERTS:
      return removeAllAlerts(state, action);
    default:
      return state;
  }
};

export default alertsReducer;
