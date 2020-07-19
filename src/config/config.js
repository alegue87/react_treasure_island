
//const siteurl = 'http://wptest.me'
const siteurl = 'http://treasureisland.local'

let apiurl = siteurl + '/wp-json/wp/v2/';
let login = siteurl + '/jwt-auth/v1/token';
var GLOBAL = {
	OFFINE: false,
	API_LOGIN_URL: login,
	API_POST_URL: apiurl + 'posts',
  API_AUDIO_URL: siteurl + '/wp-json/audio/',
  API_MENU_URL: siteurl  + '/wp-json/menu/',
  API_DICTIONARY_URL: siteurl + '/wp-json/dictionary/',
	//token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cud3B0ZXN0Lm1lIiwiaWF0IjoxNTk0MTI2NDQ4LCJuYmYiOjE1OTQxMjY0NDgsImV4cCI6MTU5NDczMTI0OCwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMSJ9fX0.au8Hq_AMO_lhqGYEkxN2jc-wmXw-bNVaUqDjlah6VZo"
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90cmVhc3VyZWlzbGFuZC5sb2NhbCIsImlhdCI6MTU5NTE2MTU3OCwibmJmIjoxNTk1MTYxNTc4LCJleHAiOjE1OTU3NjYzNzgsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.EJTZURBHy7q036uojs9N-tD5-G5wItQfHb5s7H0r8hE"
}

export default GLOBAL