// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from 'react-redux';
// import { message } from 'antd';
// import { setCredentials } from '../Auth/authSlice';
// import { useLoginMutation } from '../Auth/authApiSlice';
// import {jwtDecode} from "jwt-decode";

// const useLogin = () => {
//     const [error, setError] = useState(null);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [login, { isLoading }] = useLoginMutation();

//     useEffect(() => {
//         setError(null);
//     }, []);

//     const loginUser = async (values) => {
//         try {
//             const { accessToken } = await login(values).unwrap();
//             const decodedToken = jwtDecode(accessToken);
//             dispatch(setCredentials({ accessToken }));
//             localStorage.setItem('userInfo', JSON.stringify(decodedToken.UserInfo)); // Save decoded user info in local storage
//             navigate('/');
//         } catch (error) {
//             if (!error.status) {
//                 setError('No Server Response');
//             } else if (error.status === 400) {
//                 setError('Missing Username or Password');
//             } else if (error.status === 401) {
//                 setError('Unauthorized');
//             } else {
//                 setError('Login Failed');
//             }
//         }

//         if(isLoading) {
//             message.loading('Logging in...');
//         }
//     };

//     return { loginUser, error };
// };

// export default useLogin;
