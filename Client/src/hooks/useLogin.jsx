import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth.js/authSlice';
import { useLoginMutation } from '../features/auth.js/authApiSlice';

const useLogin = () => {
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        setError(null);
    }, []);

    const loginUser = async (values) => {
        try {
            const { accessToken } = await login(values).unwrap();
            dispatch(setCredentials({ accessToken }));
            values({ email: '', password: '' });
            // navigate('/'); // Assuming you navigate from the component
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
    };

    return { loginUser, error };
};

export default useLogin; // Export the hook as default
