import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx"
import { message } from 'antd';


const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const registerUser = async (values) => {
        if (values.password !== values.passwordConfirm) {
            return setError('Passwords are not the same');
        }

        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:3001/users', {
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
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                message.error('Registration Failed');
            }
        } catch (error) {
            message.error(error.message || String(error)); // Display error message if available, or convert error object to string
        } finally {
            setLoading(false);
        }


    };
    return { loading, error, registerUser };
};

export default useSignup;