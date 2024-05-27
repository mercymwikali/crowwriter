import React, { useEffect, useState } from 'react';
import { Skeleton, Typography, Button, Space, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { writerFines } from '../actions/FinesActions';
import useAuth from '../hooks/useAuth';
import { EyeFilled } from '@ant-design/icons';

const MyFines = () => {
    const dispatch = useDispatch();
    const writer = useAuth();
    const writerId = writer ? writer.UserInfo.id : null;

    const myFines = useSelector(state => state.writerFines);
    const { loading, error, fines } = myFines;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFine, setSelectedFine] = useState(null);

    useEffect(() => {
        if (writerId) {
            dispatch(writerFines(writerId));
        }
    }, [dispatch, writerId]);

    const handleViewDetails = (fine) => {
        setSelectedFine(fine);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedFine(null);
    };

    return (
        <div>
            <Typography.Title level={3} underline>My Fines</Typography.Title>
            {loading ? (
                <Skeleton active />
            ) : error ? (
                <tr className="text-danger py-2">{error}</tr>
            ) : fines ? (
                <table className="table table-hover table-responsive">
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Order Id</th>
                            <th scope='col'>Order Topic</th>
                            <th scope='col'>Date Posted</th>
                            <th scope='col'>Fine Amount</th>
                            <th scope='col'>Reason</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fines.map((fine, index) => (
                            <tr key={fine.id}>
                                <td>{index + 1}</td>
                                <td>{fine.order.orderId}</td>
                                <td>{fine.order.topic}</td>
                                <td>{new Date(fine.order.deadline).toLocaleDateString()}</td>
                                <td>{fine.amount}</td>
                                <td>{fine.reason}</td>
                                <td>
                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<EyeFilled />}
                                            onClick={() => handleViewDetails(fine)}
                                        >
                                            View Details
                                        </Button>
                                    </Space>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <tbody>
                    <tr className='text-danger py-2'>No records found</tr>
                </tbody>
            )}
            <Modal
                title="Fine Details"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {selectedFine && (
                    <div>
                        <Typography.Title level={4}>Fine Details</Typography.Title>
                        <p><strong>Fine Amount:</strong> {selectedFine.amount}</p>
                        <p><strong>Reason:</strong> {selectedFine.reason}</p>
                        <hr />
                        <Typography.Title level={4}>Order Details</Typography.Title>
                        <p><strong>Order Id:</strong> {selectedFine.order.orderId}</p>
                        <p><strong>Topic:</strong> {selectedFine.order.topic}</p>
                        <p><strong>Description:</strong> {selectedFine.order.description}</p>
                        <p><strong>Cost Per Page:</strong> {selectedFine.order.costPerPage}</p>
                        <p><strong>Full Amount:</strong> {selectedFine.order.fullAmount}</p>
                        <p><strong>Deadline:</strong> {new Date(selectedFine.order.deadline).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedFine.order.status}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyFines;
