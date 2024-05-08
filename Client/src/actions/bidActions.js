import axios from "axios";
import {
  BIDS_LIST_FAIL,
  BIDS_LIST_REQUEST,
  BIDS_LIST_SUCCESS,
  BID_CREATE_FAIL,
  BID_CREATE_REQUEST,
  BID_CREATE_SUCCESS,
  BID_DELETE_FAIL,
  BID_DELETE_REQUEST,
  BID_DELETE_SUCCESS,
  WRITER_BIDS_LIST_FAIL,
  WRITER_BIDS_LIST_REQUEST,
  WRITER_BIDS_LIST_SUCCESS,
} from "../constants/bidsConstant";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { logout } from "./userActions";

const API = "https://crowwriter-api.vercel.app";

export const createBid = (orderId, writerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: BID_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,

    };

    // Pass orderId and writerId as separate parameters to the backend
    const { data } = await axios.post(
      `${API}/bids/create-bid`,
      { orderId, writerId }, // Pass orderId, writerId, and bid object

      config
    );

    dispatch({
      type: BID_CREATE_SUCCESS,
      payload: data.response && data.response,
    });

    await message.success(data.message);
  } catch (error) {
    dispatch({
      type: BID_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    await message.error(error.response.data.message);
  }
};

export const listBids = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BIDS_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,

    };

    const { data } = await axios.get(`${API}/bids/get-bids`, config);

    // Check if the response contains the expected 'orders' property
    if (!data || !data.orders || !Array.isArray(data.orders)) {
      throw new Error("Invalid API response: orders not found or not an array");
    }

    const orders = data.orders;
    dispatch({
      type: BIDS_LIST_SUCCESS,
      payload: orders, // Pass the 'orders' array directly as payload
    });

    console.log(orders);
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Unauthorized Access") {
      dispatch(logout());
    }

    dispatch({
      type: BIDS_LIST_FAIL,
      payload: message,
    });
  }
};

//writersBids list
export const listWritersBids = () => async (dispatch, getState) => {
  try {
    dispatch({ type: WRITER_BIDS_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,

    };

    // Decode the JWT token to extract userId
    const decoded = jwtDecode(userInfo.accessToken);
    console.log(decoded);
    const userId = decoded.UserInfo.id;
    console.log(userId);

    const { data } = await axios.get(
      `${API}/bids/bids/get-writers-bids/${userId}`,
      config
    );

    console.log(data);
    dispatch({
      type: WRITER_BIDS_LIST_SUCCESS,
      payload: data,
    });

    // message.success(data.message);
  } catch (error) {
    dispatch({
      type: WRITER_BIDS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    message.error(error.response.data.message);
  }
};

export const deleteBid = (bidId) => async (dispatch, getState) => {
  try {
    dispatch({ type: BID_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.delete(
      `${API}bids/delete-bid/${bidId}`,
      config
    );

    dispatch({
      type: BID_DELETE_SUCCESS,
      payload: data.response && data.response,
    });

    await message.success(data.message);
  } catch (error) {
    dispatch({
      type: BID_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    await message.error(error.response.data.message);
  }
};
