import { USER_DELETE_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS } from '../constants/userConstants';
import {LIST_WRITER_FAIL, LIST_WRITER_REQUEST, LIST_WRITER_SUCCESS, LIST_WRITER_RESET, UPDATE_WRITER_REQUEST, UPDATE_WRITER_SUCCESS, UPDATE_WRITER_FAIL, UPDATE_WRITER_RESET} from '../constants/writersDetails'


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


export const writerUpdateReducer = (state = {user: {}}, action) => {
    switch (action.type) {
        case UPDATE_WRITER_REQUEST:
            return { loading: true };
        case UPDATE_WRITER_SUCCESS:
            return { loading: false, success: true , user: action.payload };
        case UPDATE_WRITER_FAIL:
            return { loading: false, error: action.payload };
            case UPDATE_WRITER_RESET:
            return {};
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
