import {
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

export const orderStatusListReducer = (state = { orderstatuses: [] }, action) => {
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
            return { users: [] };
        default:
            return state;
    }
}

