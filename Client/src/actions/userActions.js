// src/store/actions/userActions.js
import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USERS_DETAILS_REQUEST,
  USERS_DETAILS_SUCCESS,
  USER_CREATE_FAIL,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
} from "../constants/userConstants";
import { message } from "antd";
import {jwtDecode} from 'jwt-decode'

const API = "https://crowwriter-api.vercel.app/"

export const login = (email, password) => async (dispatch) => {

  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,

    };

    const { data } = await axios.post(
      `${API}/auth/login`,
      { email, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    const userInfo = jwtDecode(data.accessToken);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const logout = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accesstoken}`,
      },
      withCredentials: true,

    };

    // Send POST request to clear token
    await axios.post(`${API}/auth/logout`, {}, config);

    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
    document.location.href = "/login";
  } catch (error) {
    // Handle error if unable to logout
    console.error("Error logging out:", error);
  }
};

export const createUser = (userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.post(
      `${API}/auth/register-user`,
      userData,
      config
    );

    dispatch({
      type: USER_CREATE_SUCCESS,
      payload: data.response && data.response,

    });
message.success(data.message)
  } catch (error) {
    dispatch({
      type: USER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message);
  }
};

//userdetails actions
export const getUserDetails = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accesstoken}`,
      },
      withCredentials: true,  
    };

    const { data } = await axios.get(
      `${API}/users/fetch-UserById/${userInfo.id}`,
      user,
      config
    );
    console.log(data);
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });

  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};



