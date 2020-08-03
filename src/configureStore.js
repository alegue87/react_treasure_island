import { createStore, applyMiddleware } from 'redux';
import { persistCombineReducers, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { reducer as toastr } from 'react-redux-toastr';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import { createBrowserHistory } from "history";
import { routerMiddleware } from 'react-router-redux';

import config from './config/config';
import posts from './views/Editor/reducer';
import reader from './views/Reader/reducer';
import audio from './components/Audio/reducer';
import category from './components/Menu/reducer';
import dictionary from './components/Dictionary/reducer';

/*
import reviews from './components/Reviews/reducer';
import search from './views/Search/reducer';
import navbar from './components/NavBar/reducer';
*/
const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: [/*
    'navbar',
    'search',
    'toastr',
    'reviews',
    */
    'posts',
    'audio',
    'reader',
    'category',
    'dictionary'
  ],
  debug: true
};


const rootReducer = persistCombineReducers(rootPersistConfig, {
  posts: persistReducer(
    {
      key: 'posts',
      storage,
      blacklist: config.OFFLINE ? ['isFetching', 'hasMore'] : ['isFetching', 'hasMore', 'items'],
    },
    posts,
  ),
  reader: persistReducer(
    {
      key: 'reader',
      storage,
      blacklist: config.OFFLINE ? ['isFetching', 'hasMore'] : ['isFetching', 'hasMore', 'items'],
    },
    reader,
  ),
  audio: persistReducer(
    {
      key: 'audio',
      storage,
      blacklist: config.OFFLINE ? ['isFetching', 'hasMore'] : ['isSetting'],
    },
    audio,
  ),
  category: persistReducer(
    {
      key: 'category',
      storage,
      blacklist: config.OFFLINE ? ['isFetching', 'hasMore'] : ['isSetting'],
    },
    category,
  ),
  dictionary: persistReducer(
    {
      key: 'dictionary',
      storage,
      blacklist: config.OFFLINE ? ['isFetching', 'hasMore'] : ['isSetting'],
    },
    dictionary,
  ), 
});


const history = createBrowserHistory();

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  undefined,
  applyMiddleware(thunk, routerMiddleware(history)),
);

persistStore(store);

export { history };
export default store;
