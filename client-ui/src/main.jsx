import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import globalReducer from './store/index'
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import {api} from './store/api';

const store= configureStore({
  reducer:{
    global:globalReducer,
    [api.reducerPath]: api.reducer,
  },
  //this is needed for using toolkit query
  middleware:(getDefault)=>getDefault().concat(api.middleware),
});
//this setup is needed for toolkit query
setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
