import axios from "axios";
import {
  LIST_WRITER_FAIL,
  LIST_WRITER_REQUEST,
  LIST_WRITER_SUCCESS,
  LIST_WRITER_RESET,
  UPDATE_WRITER_REQUEST,
  UPDATE_WRITER_SUCCESS,
  UPDATE_WRITER_FAIL,
  MY_JOBS_REQUEST,
  MY_JOBS_SUCCESS,
  MY_JOBS_FAIL,
} from "../constants/writersDetails";
import { message } from "antd"; // Import message from 'antd'
import {
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
} from "../constants/userConstants";

import { API_URL as API } from "../../config";
import useAuth from "../hooks/useAuth";

export const createWriter = (writer) => async (dispatch, getState) => {
  try {
    dispatch({ type: WRITER_CREATE_REQUEST });
    console.log(writer);
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${API}/users/create-writer`,
      writer,
      config
    );
  } catch (error) {}
};

export const listWriters = () => async (dispatch, getState) => {
  try {
    // Dispatch action to indicate request initiation
    dispatch({ type: LIST_WRITER_REQUEST });

    // Get userInfo from the state
    const {
      userLogin: { userInfo },
    } = getState();

    // Configure headers with Authorization token
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
      },
      withCredentials: true,
    };

    // Send GET request to fetch-All-writers endpoint
    const { data } = await axios.get(`${API}/users/fetch-All-writers/`, config);

    // Log the received data
    // console.log("Received data:", data);

    // Dispatch action to indicate request success
    dispatch({ type: LIST_WRITER_SUCCESS, payload: data });
  } catch (error) {
    // Dispatch action to indicate request failure
    dispatch({ type: LIST_WRITER_FAIL, payload: error.message });
    message.error(error.response.data.message);
  }
};
export const UpdateWriter = (id, updatedUser) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_WRITER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.patch(
      `${API}/users/updateUser/${id}`,
      updatedUser, // Pass updated user object here
      config
    );

    dispatch({
      type: UPDATE_WRITER_SUCCESS,
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
      type: UPDATE_WRITER_FAIL,
      payload: message,
    });

    message.error(message);
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    // Get userInfo from the state
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    await axios.delete(`${API}/users/deleteUser/${id}`, config);

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_DELETE_FAIL,
      payload: message,
    });
  }
};

//my jobs
export const myJobs = (writerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_JOBS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    // Include the writerId in the API endpoint URL
    const { data } = await axios.get(`${API}/orders/my-jobs/${writerId}`, config);

    dispatch({ type: MY_JOBS_SUCCESS, payload: data });

    console.log(data);
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: MY_JOBS_FAIL,
      payload: message,
    });
    message.error(message);
  }
};

