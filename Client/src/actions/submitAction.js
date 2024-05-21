import axios from "axios";
import { API_URL as API } from "../../config";
import {
  DELETE_SUBMIT_ORDER_FAIL,
  DELETE_SUBMIT_ORDER_REQUEST,
  DELETE_SUBMIT_ORDER_SUCCESS,
  DOWNLOAD_SUBMISSION_FAIL,
  DOWNLOAD_SUBMISSION_REQUEST,
  DOWNLOAD_SUBMISSION_RESET,
  DOWNLOAD_SUBMISSION_SUCCESS,
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
import { message } from "antd";

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

      console.log(data);

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
export const listWritersSubmissions =
  (writerId) => async (dispatch, getState) => {
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
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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

    const { data } = await axios.delete(`${API}/submitJob/delete-order/${id}`, config);

    dispatch({ type: DELETE_SUBMIT_ORDER_SUCCESS, payload: data });
    message.success(data.message);
  } catch (error) {
    let errorMessage = error.message;

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    dispatch({
      type: DELETE_SUBMIT_ORDER_FAIL,
      payload: errorMessage,
    });
    message.error(errorMessage);
  }
};


// Redux action for downloading submission
export const downloadSubmission = (documentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOWNLOAD_SUBMISSION_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      responseType: "blob",
    };

    const response = await axios.get(
      `${API}/submitJob/fetch-job-docs/${documentId}`,
      config
    );

    const { data, headers } = response;

    // Extract the filename from the Content-Disposition header
    const contentDisposition = headers['content-disposition'];
    let fileName = 'downloaded_file.pdf'; // Default to .pdf

    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches?.length > 1) {
        fileName = matches[1].replace(/['"]/g, '');
      }
    }

    // Create a Blob URL for the file and handle the download
    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    dispatch({ type: DOWNLOAD_SUBMISSION_SUCCESS });
    message.success("File downloaded successfully");

    setTimeout(() => {
      dispatch({ type: DOWNLOAD_SUBMISSION_RESET });
    }, 1000);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    dispatch({
      type: DOWNLOAD_SUBMISSION_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage);
  }
};