import { combineReducers } from "@reduxjs/toolkit";
import {
  userCreateReducer,
  userDetailsReducer,
  userLoginReducer,
  usersDetailsReducer,
} from "./userSlice";
import {
  deleteUserReducer,
  writerListReducer,
  writerUpdateReducer,
} from "./writersReducer";
import {
  orderCreateReducer,
  orderStatusListReducer,
  orderUpdateReducer,
  ordersListReducer,
} from "./orderReducer";
import { bidCreateReducer, bidListDetailsReducer, bidListReducer, deleteBidReducer, writersBidListReducer } from "./bidsReducer";

export const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  usersDetails: usersDetailsReducer,
  writersList: writerListReducer,
  writersUpdate: writerUpdateReducer,
  deleteUser: deleteUserReducer,
  userCreate: userCreateReducer,
  orderCreate: orderCreateReducer,
  orderStatus: orderStatusListReducer,
  ordersList: ordersListReducer,
  editOrder: orderUpdateReducer,
  bidJob: bidCreateReducer,
  writerBidList:writersBidListReducer,
  deleteBid:deleteBidReducer,
  bidsList:bidListReducer,
  bidlistDetails:bidListDetailsReducer,

});
