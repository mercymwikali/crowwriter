import { CREATE_FINE_FAIL, CREATE_FINE_REQUEST, CREATE_FINE_RESET, CREATE_FINE_SUCCESS, FINES_BY_USER_FAIL, FINES_BY_USER_REQUEST, FINES_BY_USER_RESET, FINES_BY_USER_SUCCESS, FINE_DELETE_FAIL, FINE_DELETE_REQUEST, FINE_DELETE_RESET, FINE_DELETE_SUCCESS, FINE_UPDATE_FAIL, FINE_UPDATE_REQUEST, FINE_UPDATE_RESET, FINE_UPDATE_SUCCESS, LIST_FINES_FAIL, LIST_FINES_REQUEST, LIST_FINES_RESET, LIST_FINES_SUCCESS } from "../constants/FinesConstant"

export const fineCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_FINE_REQUEST:
            return { loading: true };
        case CREATE_FINE_SUCCESS:
            return { loading: false, success: true, fine: action.payload };
        case CREATE_FINE_FAIL:
            return { loading: false, error: action.payload };
        case CREATE_FINE_RESET:
            return {};
        default:
            return state;
    }
};


export const listFinesReducer = (state = { fines: [] }, action) => {
    switch (action.type) {
        case LIST_FINES_REQUEST:
            return { loading: true };
        case LIST_FINES_SUCCESS:
            return { loading: false, fines: action.payload };
        case LIST_FINES_FAIL:
            return { loading: false, error: action.payload };
        case LIST_FINES_RESET:
            return {};
        default:
            return state;
    }
};

//edit fine details 
export const fineUpdateReducer = (state = { fine: {} }, action) => {
    
    switch (action.type) {
        case FINE_UPDATE_REQUEST:
            return { loading: true };
        case FINE_UPDATE_SUCCESS:
            return { loading: false, success: true, fine: action.payload };
        case FINE_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case FINE_UPDATE_RESET:
            return {};
        default:
            return state;
    }
}


//fines by writer
export const writerFinesReducer = (state = { fines: [] }, action) => {
    switch (action.type) {
        case FINES_BY_USER_REQUEST:
            return { loading: true };
        case FINES_BY_USER_SUCCESS:
            return { loading: false, success: true, fines: action.payload };
        case FINES_BY_USER_FAIL:
            return { loading: false, error: action.payload };
        case FINES_BY_USER_RESET:
            return {};
        default:
            return state;
    }
}


//delete fine
export const fineDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case FINE_DELETE_REQUEST:
            return { loading: true };
        case FINE_DELETE_SUCCESS:
            return { loading: false, success: true, fine: action.payload };
        case FINE_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case FINE_DELETE_RESET :
            return {};
        default:
            return state;
    }
}
