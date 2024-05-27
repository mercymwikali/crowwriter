import { combineReducers } from "@reduxjs/toolkit";
import {
  userCreateReducer,
  userDetailsReducer,
  userLoginReducer,
  userProfileReducer,
  userUpdateReducer,
  usersDetailsReducer,
} from "./userSlice";
import {
  deleteUserReducer,
  myJobsListReducer,
  writerListReducer,
} from "./writersReducer";
import {
  assignOrderReducer,
  assignedOrdersListReducer,
  downloadAttachmentReducer,
  orderCreateReducer,
  orderStatusListReducer,
  orderUpdateReducer,
  ordersListReducer,
} from "./orderReducer";
import { bidCreateReducer, bidListDetailsReducer, bidListReducer, deleteBidReducer, writersBidListReducer } from "./bidsReducer";
import { deleteSubmittedOrderReducer, downloadSubmissionReducer, listSubmissionsByWriterReducer, listSubmissionsReducer, submitOrderReducer } from "./submissionReducer";
import { deleteAssignedOrderReducer } from "./assignmentReducer";
import { fineCreateReducer, fineDeleteReducer, fineUpdateReducer, listFinesReducer, writerFinesReducer } from "./FinesReducer";

export const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  usersDetails: usersDetailsReducer,
  writersList: writerListReducer,
  userUpdate: userUpdateReducer,
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
  assignOrder:assignOrderReducer,
  assignedOrdersList:assignedOrdersListReducer,
  myJobs: myJobsListReducer,
  downloadAttachment:downloadAttachmentReducer,
  submitOrder:submitOrderReducer,
  deleteSubmittedOrder:deleteSubmittedOrderReducer,
  deleteAssignedOrderList:deleteAssignedOrderReducer,
  listSubmission:listSubmissionsReducer,
  submissionByWriter:listSubmissionsByWriterReducer,
  downloadSubmission:downloadSubmissionReducer,
  userProfile:userProfileReducer,
  fineOrder:fineCreateReducer,
  fineList:listFinesReducer,
  updateFine:fineUpdateReducer,
  writerFines:writerFinesReducer,
  deleteFine:fineDeleteReducer

});
