import axios from "axios";
import { DELETE_ASSIGNED_ORDERS_FAIL, DELETE_ASSIGNED_ORDERS_REQUEST, DELETE_ASSIGNED_ORDERS_SUCCESS } from "../constants/assignedConstants";
import { API_URL as API } from "../../config";
import { ASSIGN_WRITER_FAIL, ASSIGN_WRITER_REQUEST, ASSIGN_WRITER_SUCCESS } from "../constants/ordersConstants";


//assigning orders
//assign an order
export const assignOrder = (orderId, userId) => async (dispatch, getState) => {
    try {
      dispatch({ type: ASSIGN_WRITER_REQUEST }); // Dispatch action to indicate request initiation
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
        },
        withCredentials: true,
      };
  
      const { data } = await axios.post(
        `${API}/orders/assign-order`,
        { orderId, userId },
        config
      );
      dispatch({ type: ASSIGN_WRITER_SUCCESS, payload: data });
      message.success(data.message);
  
      console.log(data);
    } catch (error) {
      let errorMessage = error.data.message; // Default error message
  
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message; // Use custom error message if available
      }
  
      // Dispatch action to indicate request failure
      dispatch({ type: ASSIGN_WRITER_FAIL, payload: errorMessage });
  
      // Display error message
      message.error(errorMessage);
    }
  };




//delete assigned orderlist
export const deleteAssignedOrder = () => async (dispatch, getState) => {
    try {
      dispatch({ type: DELETE_ASSIGNED_ORDERS_REQUEST }); // Dispatch action to indicate request initiation
      const {
        userLogin: { userInfo },
      } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`, // Use accessToken here
        },
      };
  
      // Make DELETE request to delete-assigned-orders endpoint
      await axios.delete(`${API}/orders/delete-assigned-orders`, config);
  
      // Dispatch action to indicate request success
      dispatch({ type:DELETE_ASSIGNED_ORDERS_SUCCESS, payload: {} });
      
      // Display success message
      message.success("Assigned orders deleted successfully");
  
    } catch (error) {
      // Handle errors
      console.error("Error deleting assigned orders:", error);
      message.error("Failed to delete assigned orders");
  
      // Dispatch action to indicate request failure
      dispatch({ type: DELETE_ASSIGNED_ORDERS_FAIL, payload: error.message });
    }
  };
  