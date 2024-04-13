import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx"
import { message } from 'antd';
import { Navigate } from "react-router-dom";


const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const loginUser = async (values) => {

        try {
            setError(null);
            setLoading(true);
            const res = await fetch('https://crowwriter-api.vercel.app/users/login', {
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
                message.error('Login Failed');
            }
        } catch (error) {
            message.error(error);
        } finally {
            setLoading(false);
        }

    };
    return { loading, error, loginUser };
};

export default useLogin;
