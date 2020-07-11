import { combineReducers } from 'redux';
import { 
  REQUEST_POST, RECEIVE_POST,
  REQUEST_REFERENCES, RECEIVE_REFERENCES
} from './actions'
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

const references = (state = [], action) => {
  switch(action.type) {
    case REQUEST_REFERENCES:
      return state;
    case RECEIVE_REFERENCES:
      return Object.assign(action.references, state) // rimuove doppioni
    default:
      return state;
  }
}

const status = (state = 0, action) => {
  switch(action.type) {
    case RECEIVE_REFERENCES:
    case RECEIVE_POST:
      return state-1;
    case REQUEST_REFERENCES:
    case REQUEST_POST:
      return state+1;
    default: 
      return state;
  }
}

export const getPosts = state => state.items 
export const getReferences = state => state.references
export const isFetching = state => state.status > 0

export default combineReducers({
  items,
  references,
  status
})