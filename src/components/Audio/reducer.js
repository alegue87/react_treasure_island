import { 
  REQUEST_AUDIO, RECEIVE_AUDIO,
  SET_AUDIO, SETTED_AUDIO,
  AUDIO_RESET
} from './actions';
import { combineReducers } from 'redux';
import _ from 'lodash';

const items = (state = [], action) => {
  switch(action.type) {
    case AUDIO_RESET:
      return [];
    case REQUEST_AUDIO:
      return state;
    case RECEIVE_AUDIO:
      return _.unionBy(action.list, state, 'id') // evita doppioni
    default:
      return state;
  }
}

const reference = (state = [], action) => {
  switch(action.type) {
    case SET_AUDIO:
      return state;
    case SETTED_AUDIO:
      return action.reference
    default:
      return state;
  }
}

const isSetting = (state = 0, action) => {
  switch(action.type) {
    case SET_AUDIO:
      return state+1;
    case SETTED_AUDIO:
      return state-1;
    default:
      return state;
  }
}

export const getAudioList = (state) => state.items;
export const getReference = (state) => state.reference;
export const isSettingReference = (state) => state.isSetting;

export default combineReducers({
  items,
  reference,
  isSetting
})