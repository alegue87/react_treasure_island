import 'whatwg-fetch';
import config from '../../config/config';

export const REQUEST_MEANING = 'REQUEST_MEANING';
export const RECEIVE_MEANING = 'RECEIVE_MEANING';

const receive_meaning = (meaning) => {
  return {
    type: RECEIVE_MEANING,
    meaning
  }
}

export const fetchMeaning = (params = {}) => dispatch => {

  dispatch({type:REQUEST_MEANING});

  fetch(
    config.API_DICTIONARY_URL + 'meaning?word=' + params.word || '',
    {
      header: { 'Autorization': 'Bearer ' + config.token }      
    }
  )
    .then( result => result.json() )
    .then( json => dispatch(receive_meaning(json)))
    .catch( error => dispatch(receive_meaning({})))
}