// src/store/store.js
import { configureStore  } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import { rootReducer } from "../reducers";

const mymiddleware=[thunk]

const userInforFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

  const initialState = {
    userLogin: {
      userInfo: userInforFromStorage,
    },
  };
  

const store = configureStore({
  reducer:rootReducer,
  preloadedState: initialState,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(mymiddleware),
  devTools: true
});

export default store;
