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

        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (res.status === 200) {
                message.success(data.message);
                login(data.token, data.user)
                Navigate('/manager-dashboard')
            } else if (res.status === 404) {
                setError(data.message);
            } else {
                setError('Login Failed');
            }
        }
        catch (error) {
            console.log(error)

        }
        if (isLoading) {
            message.loading('Logging in...');
        }
    };

    return { loginUser, error };
};

export default useLogin;
