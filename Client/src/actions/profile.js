import axios from 'axios';
import { API_URL as API } from "../../config";
import { message } from 'antd';
import { GET_PROFILE_FAIL, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS } from '../constants/userConstants';

export const getProfile = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: GET_PROFILE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
            withCredentials: true,
        };

        const { data } = await axios.get(`${API}/users/profile/${id}`, config);

        dispatch({
            type: GET_PROFILE_SUCCESS,
            payload: data,
        });

        console.log(data);
    } catch (error) {
        dispatch({ type: GET_PROFILE_FAIL, payload: error.response.data.message || error.message });

        console.log(error.response.data.message || error.message);

        message.error(error.response.data.message || 'Something went wrong, please try again later');
    }
};
