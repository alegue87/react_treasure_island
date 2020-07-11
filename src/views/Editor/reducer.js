import { combineReducers } from 'redux';
import { REQUEST_POST, RECEIVE_POST } from './actions'
import _ from 'lodash'

const items = (state = [], action) => {
  switch(action.type) {
    case REQUEST_POST:
      return state;
    case RECEIVE_POST:
      return _.unionBy( _.isArray(action.post) ? action.post : [action.post], state, 'id') // rimuove doppioni
    default:
      return state;
  }
}

export const getPosts = state => state.items 

export default combineReducers({
  items
})