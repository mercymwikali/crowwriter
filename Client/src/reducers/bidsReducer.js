import {
  BIDS_LIST_FAIL,
  BIDS_LIST_REQUEST,
  BIDS_LIST_RESET,
  BIDS_LIST_SUCCESS,
  BID_CREATE_FAIL,
  BID_CREATE_REQUEST,
  BID_CREATE_SUCCESS,
  BID_DELETE_FAIL,
  BID_DELETE_REQUEST,
  BID_DELETE_SUCCESS,
  WRITER_BIDS_LIST_FAIL,
  WRITER_BIDS_LIST_REQUEST,
  WRITER_BIDS_LIST_RESET,
  WRITER_BIDS_LIST_SUCCESS,
} from "../constants/bidsConstant";

export const bidCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BID_CREATE_REQUEST:
      return { loading: true };
    case BID_CREATE_SUCCESS:
      return { loading: false, success: true, bid: action.payload };
    case BID_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const writersBidListReducer = (state = { bids: [] }, action) => {
  switch (action.type) {
    case WRITER_BIDS_LIST_REQUEST:
      return { loading: true };
    case WRITER_BIDS_LIST_SUCCESS:
      return { loading: false, bids: action.payload };
    case WRITER_BIDS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case WRITER_BIDS_LIST_RESET:
      return { bids: [] };
    default:
      return state;
  }
};

export const deleteBidReducer = (state = {}, action) => {
  switch (action.type) {
    case BID_DELETE_REQUEST:
      return { loading: true };
    case BID_DELETE_SUCCESS:
      return { loading: false, success: true };
    case BID_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const bidListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case BIDS_LIST_REQUEST:
      return { loading: true };
    case BIDS_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case BIDS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case BIDS_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
};
