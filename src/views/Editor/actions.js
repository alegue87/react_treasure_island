import 'whatwg-fetch';
import config from '../../config/config'

export const REQUEST_POST = 'REQUEST_POST';
export const RECEIVE_POST = 'RECEIVE_POST';

const request_post = () => {
  return {
    type: REQUEST_POST
  }
}

const receive_post = (post) => {
  return {
    type: RECEIVE_POST,
    post
  }
}

export const fetchPost = (params = {}) => (dispatch) => {
  dispatch(request_post())

  return fetch(config.API_POST_URL + '/' + (params.postId || ''), {
    headers: {'Authorization': 'Bearer '+ config.token }
  })
    .then( response => response.json() )
    .then( json => dispatch(receive_post(json)) )
    .catch( (error) => dispatch(receive_post([])) )
}