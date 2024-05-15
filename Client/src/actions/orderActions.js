import axios from "axios";
import {
  ASSIGNED_ORDER_LIST_FAIL,
  ASSIGNED_ORDER_LIST_SUCCESS,
  ASSIGN_WRITER_FAIL,
  ASSIGN_WRITER_REQUEST,
  ASSIGN_WRITER_SUCCESS,
  DOWNLOAD_ATTACHMENT_FAIL,
  DOWNLOAD_ATTACHMENT_REQUEST,
  DOWNLOAD_ATTACHMENT_SUCCESS,
  GET_ORDER_STATUS_ENUMS_REQUEST,
  LIST_ORDERS_FAIL,
  LIST_ORDERS_REQUEST,
  LIST_ORDERS_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
} from "../constants/ordersConstants";
import { message } from "antd";

import { API_URL as API } from "../../config";

export const createdOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

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
      `${API}/orders/create-order`,
      order,
      config
    );

    // Ensure that the response contains the expected 'data' property
    if (data && data.data) {
      dispatch({
        type: ORDER_CREATE_SUCCESS,
        payload: data.data, // Use 'data.data' instead of 'data.response'
      });

      message.success(data.message);
    } else {
      // Handle the case where the response does not contain the expected data
      throw new Error("Invalid response format");
    }
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message || "Failed to create order");
  }
};

//fetching the orderstatus

export const listOrderstatusEnums = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ORDER_STATUS_ENUMS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.get(`${API}/orders/order-Status`, config);
    console.log("Received data:", data);

    dispatch({
      type: GET_ORDER_STATUS_ENUMS_REQUEST,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    //add generic error
    message.error("Something went wrong, please try again later");
  }
};

export const listOrders = () => async (dispatch, getState) => {
  try {
    // Dispatch action to indicate request initiation
    dispatch({ type: LIST_ORDERS_REQUEST });

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
    const { data } = await axios.get(
      `${API}/orders/get-writers-orders`,
      config
    );

    // Log the received data
    console.log("Received data:", data);

    // Dispatch action to indicate request success
    dispatch({ type: LIST_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    // Dispatch action to indicate request failure
    dispatch({ type: LIST_ORDERS_FAIL, payload: error.message });
    message.error(error.response.data.message);
  }
};

//assign an order
export const assignOrder = (orderId, userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ASSIGN_WRITER_REQUEST }); // Dispatch action to indicate request initiation
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${API}/orders/assign-order`,
      { orderId, userId },
      config
    );
    dispatch({ type: ASSIGN_WRITER_SUCCESS, payload: data });
    message.success(data.message);

    console.log(data);
  } catch (error) {
    let errorMessage = error.message; // Default error message

    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "Order already assigned"
    ) {
      // If the error is "Order already assigned"
      errorMessage = error.response.data.error;
    }

    dispatch({
      type: ASSIGN_WRITER_FAIL,
      payload: errorMessage,
    });
    // Throw the error to be caught in the component
    throw new Error(errorMessage);
  }
};

export const updateOrder = (id, order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_UPDATE_REQUEST }); // Dispatch action to indicate request initiation
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
      },
      withCredentials: true,
    };

    const { data } = await axios.patch(
      `${API}/orders/update-order/${id}`,
      order,
      config
    );

    dispatch({ type: ORDER_UPDATE_REQUEST, payload: data });
    message.success(data.message);
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_UPDATE_FAIL,
      payload: message,
    });

    message.error(message);
  }
};

export const assignedOrderList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ASSIGNED_ORDER_LIST_SUCCESS }); // Dispatch action to indicate request initiation
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
      },
    };

    const { data } = await axios.get(`${API}/orders/assigned-Orders-list`, config);

    dispatch({ type: ASSIGNED_ORDER_LIST_SUCCESS, payload: data });
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
      type:ASSIGNED_ORDER_LIST_FAIL,
      payload: message,
    });
    console.error(message);
  }
};


//dowload order attachment

export const downloadOrderAttachment = (documentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOWNLOAD_ATTACHMENT_REQUEST }); // Dispatch action to indicate request initiation
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
      },
      responseType: 'blob', // Set response type to 'blob' for downloading files
    };

    const { data } = await axios.get(`${API}/uploadFile/download/${documentId}`, config);

    // Create a blob URL for the downloaded file
    const url = window.URL.createObjectURL(new Blob([data]));

    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document.pdf`); // Set generic filename here
    document.body.appendChild(link);
    link.click();

    // Dispatch action to indicate request success
    dispatch({ type: DOWNLOAD_ATTACHMENT_SUCCESS });

    message.success("Files downloaded successfully");

    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Debugging console log
    console.log("Downloaded attachment");

  } catch (error) {
    console.error("Error downloading attachment:", error);
    message.error("Failed to download attachment");
    // Dispatch action to indicate request failure
    dispatch({ type: DOWNLOAD_ATTACHMENT_FAIL , payload: error.message });
  }
};
