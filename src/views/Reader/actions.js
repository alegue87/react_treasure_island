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

export const REQUEST_REFERENCES = 'REQUEST_REFERENCES';
export const RECEIVE_REFERENCES = 'RECEIVE_REFERENCES';

const request_references = () => {
  return {
    type: REQUEST_REFERENCES
  }
}

const receive_references = (references) => {
  return {
    type: RECEIVE_REFERENCES,
    references
  }
}

export const fetchReferences = (params = {}) => (dispatch) => {
  dispatch(request_references())

  return fetch(config.API_AUDIO_URL + 'references?post_id=' + (params.postId || ''), {
    headers: {'Authorization': 'Bearer '+ config.token }
  })
    .then( response => response.json() )
    .then( json => dispatch(receive_references(json)) )
    .catch( (error) => dispatch(receive_references([])) )
}