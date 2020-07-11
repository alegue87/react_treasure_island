import 'whatwg-fetch';
import config from '../../config/config';
import _ from 'lodash';

export const REQUEST_AUDIO = 'REQUEST_AUDIO';
export const RECEIVE_AUDIO = 'RECEIVE_AUDIO';
export const SET_AUDIO = 'SET_AUDIO';
export const SETTED_AUDIO = 'SETTED_AUDIO';
export const AUDIO_RESET = 'AUDIO_RESET';

const request_audio = () => {
  return {
    type: REQUEST_AUDIO
  }
}

const receive_audio = (list) => {
  return {
    type: RECEIVE_AUDIO,
    list
  }
}

export const fetchAudioList = (params = {}) => (dispatch) => {
  dispatch(request_audio())

  //const showAlsoUnassigned = _.isUndefined(params.showAlsoUnassigned) ? '' : '&showAlsoUnassigned';
  fetch(
    config.API_AUDIO_URL + 'list?post_parent=' + params.postId + 'showAlsoUnassigned',
    {
      headers: {
        Authorization: 'Bearer ' + config.token
      }
    }
  )
    .then( response => response.json())
    .then( json => dispatch(receive_audio( json )))
    .catch( error => dispatch(receive_audio([])))
}

const set_audio = () => {
  return {
    type: SET_AUDIO
  }
}

const setted_audio = (result) => {
  return {
    type: SETTED_AUDIO,
    reference: result.reference
  }
}

export const setOrUpdateAudio = (params = {}) => dispatch => {
  dispatch(set_audio());

  const form = new FormData();
  form.append('post_id', params.id);
  form.append('reference', params.reference);
  form.append('post_parent', params.post_parent); // assign attachment to post ( eng )
  fetch(
    config.API_AUDIO_URL + 'set',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + config.token
      },
      body: form
    }
  )
    .then( response => response.json() )
    .then( json => dispatch(setted_audio(json)))
    .catch( error => dispatch(setted_audio({})))
}