import { DELETE_ASSIGNED_ORDERS_FAIL, DELETE_ASSIGNED_ORDERS_REQUEST, DELETE_ASSIGNED_ORDERS_RESET, DELETE_ASSIGNED_ORDERS_SUCCESS } from "../constants/assignedConstants";

//delete assignedorderlist reducer
export const deleteAssignedOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_ASSIGNED_ORDERS_REQUEST:
            return { loading: true };
        case DELETE_ASSIGNED_ORDERS_SUCCESS:
            return { loading: false, success: true };
        case DELETE_ASSIGNED_ORDERS_FAIL:
            return { loading: false, error: action.payload };
        case DELETE_ASSIGNED_ORDERS_RESET:
            return {};
        default:
            return state;
    }
}