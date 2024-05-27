import { USER_DELETE_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS } from '../constants/userConstants';
import {LIST_WRITER_FAIL, LIST_WRITER_REQUEST, LIST_WRITER_SUCCESS, LIST_WRITER_RESET, UPDATE_WRITER_REQUEST, UPDATE_WRITER_SUCCESS, UPDATE_WRITER_FAIL, UPDATE_WRITER_RESET, MY_JOBS_REQUEST, MY_JOBS_SUCCESS, MY_JOBS_FAIL, MY_JOBS_RESET} from '../constants/writersDetails'


export const writerListReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case LIST_WRITER_REQUEST:
            return { loading: true };
        case LIST_WRITER_SUCCESS:
            return { loading: false, users: action.payload };
        case LIST_WRITER_FAIL:
            return { loading: false, error: action.payload };
            case LIST_WRITER_RESET:
            return { users: [] };
        default:
            return state;
    }
}


export const myJobsListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case MY_JOBS_REQUEST:
            return { loading: true };
        case MY_JOBS_SUCCESS:
            return { loading: false, orders: action.payload };
        case MY_JOBS_FAIL:
            return { loading: false, error: action.payload };
        case MY_JOBS_RESET:
            return { orders: [] };
        default:
            return state;
    }
}


export const deleteUserReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true };
        case USER_DELETE_SUCCESS:
            return { loading: false, success: true }; // Update state with success:true upon successful deletion
        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
