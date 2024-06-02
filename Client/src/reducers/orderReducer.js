import {
  ASSIGNED_ORDER_LIST_FAIL,
  ASSIGNED_ORDER_LIST_REQUEST,
  ASSIGNED_ORDER_LIST_RESET,
  ASSIGNED_ORDER_LIST_SUCCESS,
  ASSIGN_WRITER_FAIL,
  ASSIGN_WRITER_REQUEST,
  ASSIGN_WRITER_SUCCESS,
  DOWNLOAD_ATTACHMENT_FAIL,
  DOWNLOAD_ATTACHMENT_REQUEST,
  DOWNLOAD_ATTACHMENT_RESET,
  DOWNLOAD_ATTACHMENT_SUCCESS,
  GET_ORDER_STATUS_ENUMS_FAIL,
  GET_ORDER_STATUS_ENUMS_REQUEST,
  GET_ORDER_STATUS_ENUMS_RESET,
  GET_ORDER_STATUS_ENUMS_SUCCESS,
  LIST_ORDERS_FAIL,
  LIST_ORDERS_REQUEST,
  LIST_ORDERS_RESET,
  LIST_ORDERS_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_RESET,
  ORDER_UPDATE_SUCCESS,
} from "../constants/ordersConstants";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const assignOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case ASSIGN_WRITER_REQUEST:
      return { loading: true };
    case ASSIGN_WRITER_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ASSIGN_WRITER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const orderStatusListReducer = (
  state = { orderstatuses: [] },
  action
) => {
  switch (action.type) {
    case GET_ORDER_STATUS_ENUMS_REQUEST:
      return { loading: true };
    case GET_ORDER_STATUS_ENUMS_SUCCESS:
      return { loading: false, orderstatuses: action.payload };
    case GET_ORDER_STATUS_ENUMS_FAIL:
      return { loading: false, error: action.payload };
    case GET_ORDER_STATUS_ENUMS_RESET:
      return { orderstatuses: [] };
    default:
      return state;
  }
};

export const ordersListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case LIST_ORDERS_REQUEST:
      return { loading: true };
    case LIST_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };
    case LIST_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    case LIST_ORDERS_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

//update order reducer
export const orderUpdateReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_UPDATE_REQUEST:
      return { loading: true };
    case ORDER_UPDATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_UPDATE_RESET:
      return { order: {} };
    default:
      return state;
  }
};

//assigned orders reducer
export const assignedOrdersListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ASSIGNED_ORDER_LIST_REQUEST:
      return { loading: true };
    case ASSIGNED_ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case  ASSIGNED_ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ASSIGNED_ORDER_LIST_RESET:
      return { users: [] };
    default:
      return state;
  }
}

// Reducer for download attachment operation
export const downloadAttachmentReducer = (state = {}, action) => {
  switch (action.type) {
    case DOWNLOAD_ATTACHMENT_REQUEST:
      return { loading: true };
    case DOWNLOAD_ATTACHMENT_SUCCESS:
      return { loading: false, success: true };
    case DOWNLOAD_ATTACHMENT_FAIL:
      return { loading: false, error: action.payload };
      case DOWNLOAD_ATTACHMENT_RESET:
      return {};
    default:
      return state;
  }
};
