import 'whatwg-fetch';

//const siteurl = 'http://wptest.me'
const siteurl = 'http://treasureisland.local'

let apiurl = siteurl + '/wp-json/wp/v2/';
let login = siteurl + '/wp-json/jwt-auth/v1/token';
var GLOBAL = {
	OFFINE: false,
	API_LOGIN_URL: login,
	API_POST_URL: apiurl + 'posts',
  API_AUDIO_URL: siteurl + '/wp-json/audio/',
  API_MENU_URL: siteurl  + '/wp-json/menu/',
  API_DICTIONARY_URL: siteurl + '/wp-json/dictionary/',
	isAdmin:false
}

fetch(`${GLOBAL.API_LOGIN_URL}?username=demo&password=demo`,
  {
    method: 'POST'
  })
  .then( result => result.json() )
  .then( json => GLOBAL.token = json.token )
  .catch( error => alert('Login error'))

export default GLOBAL