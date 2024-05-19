import axios from "axios";
import { API_URL as API } from "../../config";
import {
  DELETE_SUBMIT_ORDER_FAIL,
  DELETE_SUBMIT_ORDER_REQUEST,
  DELETE_SUBMIT_ORDER_SUCCESS,
  LIST_SUBMISSIONS_FAIL,
  LIST_SUBMISSIONS_FAIL_WRITER,
  LIST_SUBMISSIONS_REQUEST,
  LIST_SUBMISSIONS_REQUEST_WRITER,
  LIST_SUBMISSIONS_SUCCESS,
  LIST_SUBMISSIONS_SUCCESS_WRITER,
  SUBMIT_ORDER_FAIL,
  SUBMIT_ORDER_REQUEST,
  SUBMIT_ORDER_SUCCESS,
} from "../constants/submitConstants";

export const submitOrder =
  (orderId, writerId, documentId) => async (dispatch, getState) => {
    try {
      dispatch({ type: SUBMIT_ORDER_REQUEST });

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
        `${API}/submitJob/submit-order`,
        { orderId, writerId, documentId },
        config
      );

      dispatch({ type: SUBMIT_ORDER_SUCCESS, payload: data });

      await message.success(data.message);
    } catch (error) {
      let errorMessage = error.message;

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      dispatch({
        type: SUBMIT_ORDER_FAIL,
        payload: errorMessage,
      });
    }
  };

//fetch submissions
export const listSubmissions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_SUBMISSIONS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${API}/submitJob/fetch-jobs-docs`,
      config
    );

    dispatch({ type: LIST_SUBMISSIONS_SUCCESS, payload: data });

    console.log(data);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    dispatch({
      type: LIST_SUBMISSIONS_FAIL,
      payload: errorMessage,
    });
  }
};

//writers submissions
export const listWritersSubmissions = (writerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_SUBMISSIONS_REQUEST_WRITER });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${API}/submitJob/fetch-jobs-docs/writer/${writerId}`,
      config
    );

    dispatch({ type: LIST_SUBMISSIONS_SUCCESS_WRITER, payload: data });

    console.log(data);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    dispatch({
      type: LIST_SUBMISSIONS_FAIL_WRITER,
      payload: errorMessage,
    });
  }
};

//delete order
export const deleteOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_SUBMIT_ORDER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.delete(
      `${API}/submitJob/delete-order/${id}`,
      config
    );

    dispatch({ type: DELETE_SUBMIT_ORDER_SUCCESS, payload: data });
    console.log(data);
    await message.success(data.message);
  } catch (error) {
    let errorMessage = error.message;

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    dispatch({
      type: DELETE_SUBMIT_ORDER_FAIL,
      payload: errorMessage,
    });
  }
};
