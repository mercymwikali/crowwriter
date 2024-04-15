import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux
import { message } from 'antd';
import { setCredentials } from '../features/auth.js/authSlice';
import { useLoginMutation } from '../features/auth.js/authApiSlice';

const useLogin = () => {
    const [error, setError] = useState(null);
    const dispatch = useDispatch(); // Use useDispatch instead of UseDispatch
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        setError(null);
    }, []);

    const loginUser = async (values) => {
        // event.preventDefault(); // Corrected from values.preventDefault()
        try {
            const { accessToken } = await login(values).unwrap();
            dispatch(setCredentials({ accessToken }));
            // navigate('/');
        } catch (error) {
            if (!error.status) {
                setError('No Server Response');
            } else if (error.status === 400) {
                setError('Missing Username or Password');
            } else if (error.status === 401) {
                setError('Unauthorized');
            } else {
                setError('Login Failed');
            }
        }

        if(isLoading) {
            message.loading('Logging in...');
        }
    };

    return { loginUser, error };
};

export default useLogin;
