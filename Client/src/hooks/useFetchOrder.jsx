import { useState } from "react";
import { message } from 'antd';
import { useJobContext } from "../context/JobContext.jsx";
const useFetchOrder = () => {
    const { addJob } = useJobContext();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('https://crowwriter-api.vercel.app/orders/get-orders');
            if (!res.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await res.json();
            data.forEach(order => {
                addJob(order);
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, fetchOrders };
};

export default useFetchOrder;
