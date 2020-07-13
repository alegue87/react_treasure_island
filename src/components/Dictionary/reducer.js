import { combineReducers } from 'redux';
import {
  REQUEST_MEANING, RECEIVE_MEANING
}
from './actions';
import _ from 'lodash';

const meaning = (state={}, action) => {
  switch(action.type) {
    case RECEIVE_MEANING:
      return Object.assign({}, state, action.meaning);
    case REQUEST_MEANING:
    default: return state;
  }
}

export const getMeaning = (state) => state.meaning;
export const getTraduction = (state) => ''//state.traduction;

export default combineReducers({
  meaning
})
