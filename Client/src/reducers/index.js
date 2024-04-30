import { combineReducers } from "@reduxjs/toolkit";
import { userCreateReducer, userDetailsReducer, userLoginReducer, usersDetailsReducer  } from "./userSlice";
import { deleteUserReducer, writerListReducer, writerUpdateReducer } from "./writersReducer";
import { orderCreateReducer, orderStatusListReducer, ordersListReducer } from "./orderReducer";


export const rootReducer=combineReducers({
    userLogin:userLoginReducer,
    userDetails:userDetailsReducer,    
    usersDetails: usersDetailsReducer,
    writersList:writerListReducer,
    writersUpdate:writerUpdateReducer,
    deleteUser:deleteUserReducer,
    userCreate:userCreateReducer,
    orderCreate:orderCreateReducer,
    orderStatus:orderStatusListReducer,
    ordersList:ordersListReducer,

})