import { DELETE_SUBMIT_ORDER_FAIL, DELETE_SUBMIT_ORDER_REQUEST, DELETE_SUBMIT_ORDER_RESET, DELETE_SUBMIT_ORDER_SUCCESS, LIST_SUBMISSIONS_FAIL, LIST_SUBMISSIONS_REQUEST, LIST_SUBMISSIONS_RESET, LIST_SUBMISSIONS_SUCCESS, SUBMIT_ORDER_FAIL, SUBMIT_ORDER_REQUEST, SUBMIT_ORDER_RESET, SUBMIT_ORDER_SUCCESS } from "../constants/submitConstants"

export const submitOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case SUBMIT_ORDER_REQUEST:
            return { loading: true }
        case SUBMIT_ORDER_SUCCESS:
            return { loading: false, success: true }
        case SUBMIT_ORDER_FAIL:
            return { loading: false, error: action.payload }
        case SUBMIT_ORDER_RESET:
            return {}
        default:
            return state
    }
}


//list submissions reducer
export const listSubmissionsReducer = (state = { submissions: [] }, action) => {
    switch (action.type) {
        case LIST_SUBMISSIONS_REQUEST:
            return { loading: true }
        case LIST_SUBMISSIONS_SUCCESS:
            return { loading: false, submissions: action.payload }
        case LIST_SUBMISSIONS_FAIL:
            return { loading: false, error: action.payload }
        case LIST_SUBMISSIONS_RESET:
            return { submissions: [] }
        default:
            return state
    }
}




//delete order reducer
export const deleteSubmittedOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_SUBMIT_ORDER_REQUEST:
            return { loading: true }
        case DELETE_SUBMIT_ORDER_SUCCESS:
            return { loading: false, success: true }
        case DELETE_SUBMIT_ORDER_FAIL:
            return { loading: false, error: action.payload }
        case DELETE_SUBMIT_ORDER_RESET:
            return {}
        default:
            return state
    }
}