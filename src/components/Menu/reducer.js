import { combineReducers } from 'redux';
import { REQUEST_CATEGORY, RECEIVE_CATEGORY } from './actions';

const posts = (state=[], action) => {
  switch(action.type) {
    case RECEIVE_CATEGORY:
      return action.posts;
    case REQUEST_CATEGORY:
    default:
      return state;
  }
}

export const getCategoryPosts = (category) => category.posts

export default combineReducers({
  posts,
})