import { combineReducers } from 'redux';
import {
  REQUEST_MEANING, RECEIVE_MEANING,
  REQUEST_TRADUCTION, RECEIVE_TRADUCTION
}
from './actions';
import _ from 'lodash';

const meaning = (state={}, action) => {
  switch(action.type) {
    case RECEIVE_MEANING:
      return action.meaning;
    case REQUEST_MEANING:
    default: return state;
  }
}

const traduction = (state={}, action) => {
  switch(action.type) {
    case RECEIVE_TRADUCTION:
      return action.traduction;
    case REQUEST_TRADUCTION:
    default: return state;
  }
}

const isFetchingMeaning = (state=0, action) => {
  switch(action.type) {
    case REQUEST_MEANING:
      return state+1;
    case RECEIVE_MEANING:
      return state-1;
    default: return state;
  }
}

const isFetchingTraduction = (state=0, action) => {
  switch(action.type) {
    case REQUEST_TRADUCTION:
      return state+1;
    case RECEIVE_TRADUCTION:
      return state-1;
    default: return state;
  }
}

export const getMeaning = (state) => state.meaning;
export const getTraduction = (state) => state.traduction;
export const fetchingMeaning = (state) => state.isFetchingMeaning;
export const fetchingTraduction = (state) => state.isFetchingTraduction;

export default combineReducers({
  meaning,
  traduction,
  isFetchingMeaning,
  isFetchingTraduction
})
