import 'whatwg-fetch';
import config from '../../config/config';

export const REQUEST_CATEGORY = 'REQUEST_CATEGORY';
export const RECEIVE_CATEGORY = 'RECEIVE_CATEGORY';

const receive_category = (posts) => {
  return {
    type:RECEIVE_CATEGORY,
    posts
  }
}
export const fetchCategory = (params={}) => (dispatch) => {
  dispatch({type: REQUEST_CATEGORY})

  return fetch(config.API_MENU_URL + 'category?category_slug=' + params.categorySlug)
    .then( response => response.json() )
    .then( json => dispatch(receive_category(json)))
    .catch( error => receive_category([]))
}