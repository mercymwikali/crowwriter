import axios from "axios";
import { API_URL as API } from "../../config";
import {
  CREATE_FINE_FAIL,
  CREATE_FINE_REQUEST,
  CREATE_FINE_RESET,
  CREATE_FINE_SUCCESS,
  FINES_BY_USER_FAIL,
  FINES_BY_USER_REQUEST,
  FINES_BY_USER_RESET,
  FINES_BY_USER_SUCCESS,
  FINE_DELETE_FAIL,
  FINE_DELETE_REQUEST,
  FINE_DELETE_RESET,
  FINE_DELETE_SUCCESS,
  FINE_UPDATE_FAIL,
  FINE_UPDATE_REQUEST,
  FINE_UPDATE_RESET,
  FINE_UPDATE_SUCCESS,
  LIST_FINES_FAIL,
  LIST_FINES_REQUEST,
  LIST_FINES_RESET,
  LIST_FINES_SUCCESS,
} from "../constants/FinesConstant";
import { message } from "antd";

export const createFine = (fine) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_FINE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    // Log the fine data to verify
    console.log("Fine data being sent to server:", fine);

    const { data } = await axios.post(`${API}/fines/create-fine`, fine, config);

    dispatch({ type: CREATE_FINE_SUCCESS, payload: data });

    message.success(data.message);

    dispatch({ type: CREATE_FINE_RESET });
  } catch (error) {
    dispatch({
      type: CREATE_FINE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    await message.error(error.response.data.message);
  }
};

export const listFines = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_FINES_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.get(`${API}/fines/get-fines`, config);

    dispatch({ type: LIST_FINES_SUCCESS, payload: data });

    console.log(data);
  } catch (error) {
    dispatch({
      type: LIST_FINES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    await message.error(error.response.data.message);

    dispatch({ type: LIST_FINES_RESET });
  }
};

//edit fine details

export const editFine = (id, fine) => async (dispatch, getState) => {
  try {
    dispatch({ type:FINE_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    // Log the fine data to verify
    console.log("Fine data being sent to server:", fine);

    const { data } = await axios.patch(
      `${API}/fines/update-fine/${id}`,
      fine,
      config
    );

    dispatch({ type: FINE_UPDATE_SUCCESS, payload: data });

    message.success(data.message);

    dispatch({ type: FINE_UPDATE_RESET });

  } catch (error) {
    dispatch({
      type: FINE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    await message.error(error.response.data.message);
  }
};



//writer fines
export const writerFines = (writerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINES_BY_USER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.get(`${API}/fines/get-writers-fines/${writerId}`, config);

    dispatch({ type:FINES_BY_USER_SUCCESS, payload: data });

    console.log(data);

    
  } catch (error) {
    dispatch({
      type:FINES_BY_USER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    await message.error(error.response.data.message);

    dispatch({ type: FINES_BY_USER_RESET });
  }
};


//delete fine
export const deleteFine = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.delete(`${API}/fines/delete-fine/${id}`, config);

    dispatch({ type: FINE_DELETE_SUCCESS, payload: data });

    message.success(data.message);

    dispatch({ type: FINE_DELETE_RESET });

  } catch (error) {
    dispatch({
      type: FINE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    }); 

    await message.error(error.response.data.message);

    dispatch({ type: FINE_DELETE_RESET });
  }
}