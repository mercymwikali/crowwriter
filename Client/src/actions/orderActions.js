import axios from "axios";
import {
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

const API = "https://crowwriter.vercel.app/";

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
    };

    const { data } = await axios.post(
      `${API}/orders/create-order`,
      order,
      config
    );

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data.response && data.response,
    });

    message.success(data.message);
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message);
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

export const updateOrder = ( id,order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_UPDATE_REQUEST }); // Dispatch action to indicate request initiation
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
      },
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
}
