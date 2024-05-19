import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignedOrderList } from '../actions/orderActions';
import { Skeleton, Typography, message, Button, Space } from 'antd';
import { deleteAssignedOrder } from '../actions/assigningActions';

const AssignedJobsList = () => {
    const dispatch = useDispatch();

    const assignedOrders = useSelector((state) => state.assignedOrdersList);
    const { loading, error, orders } = assignedOrders;

    useEffect(() => {
        dispatch(assignedOrderList());
    }, [dispatch, ]);

    const handleDelete = () => {
        dispatch(deleteAssignedOrder());
        message.success('Assigned orders deleted successfully');
        
    };

    return (
        <>
            <Typography.Title>Assigned Orders List</Typography.Title>
            {loading ? (
                <Skeleton active />
            ) : error ? (
                <>{message.error(error)}</>
            ) : orders ? (
                <>
                    <Space className='d-flex align-items-center justify-content-end mb-3'>
                        <Button type="primary" danger onClick={handleDelete}>
                            Delete Assigned Orders
                        </Button>
                    </Space>
                    <table className="table table-hover table-responsive">
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>OrderId</th>
                                <th scope='col'>Topic</th>
                                <th scope='col'>Full Amount(ksh)</th>
                                <th scope='col'>Username</th>
                                <th scope='col'>Email</th>
                                <th scope='col'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    <td>{order.order.orderId}</td>
                                    <td>{order.order.topic}</td>
                                    <td>{order.order.fullAmount}</td>
                                    <td>{order.user.username}</td>
                                    <td>{order.user.email}</td>
                                    <td>{order.order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : null}
        </>
    );
};

export default AssignedJobsList;
