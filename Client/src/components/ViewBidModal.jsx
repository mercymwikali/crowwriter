import { Button, Modal, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listBidsWithDetails } from '../actions/bidActions';
import { LoadingOutlined } from '@ant-design/icons';
import {   createdOrder } from '../actions/orderActions';
import { assignOrder } from '../actions/assigningActions';

const ViewBidModal = ({ visible, onCancel, selectedBid }) => {
    const dispatch = useDispatch();
    const bidlistDetails = useSelector(state => state.bidlistDetails);
    const { loading, error, bids } = bidlistDetails || {};

    const [selectedWriterId, setSelectedWriterId] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Store the selected order ID

    useEffect(() => {
        if (selectedBid) {
            dispatch(listBidsWithDetails(selectedBid.id));
        }
    }, [selectedBid, dispatch]);

    const handleWriterSelection = (writerId, orderId) => {
        setSelectedWriterId(writerId);
        setSelectedOrderId(orderId); // Set the selected order ID
        console.log("Selected Writer ID:", writerId);
        console.log("Selected Order ID:", orderId);
    };   

    const handleAssignOrder = () => {
        if (!selectedWriterId || !selectedOrderId) {
            message.error("Please select a writer and order.");
            return;
        }
        dispatch(assignOrder(selectedBid.id, selectedWriterId, selectedOrderId));
        onCancel();
    };


    return (
        <Modal
        title="Bids"
        visible={visible}
        onCancel={onCancel}
        style={{ scrollbarColor: 'red', scrollbarWidth: 'thin', overflowY: 'auto' }}
        width={1000}
        footer={[
            <Button key="cancel" onClick={onCancel}>Close</Button>,
            <Button key="assign" type="primary" onClick={handleAssignOrder}>Assign Order</Button>,
        ]}
    >
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: '48px', color: '#1890ff' }} spin />}
                    />
                    <p style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>Loading list...</p>
                </div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <table className='table table-hover table-responsive p-3'>
                    <thead className='table-dark'>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">OrderID</th>
                            <th scope="col">Order Topic</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Deadline</th>
                            <th scope="col" className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids && bids.length > 0 && bids.map((bid, index) => (
                            <tr key={index}>
                                <td>{bid.writer.username}</td>
                                <td>{bid.writer.email}</td>
                                <td>{bid.order.orderId}</td>
                                <td>{bid.order.topic}</td>
                                <td>{bid.order.costPerPage}.00</td>
                                <td>{bid.status}</td>
                                <td>{new Date(bid.order.deadline).toLocaleDateString()}</td>
                                <td className='text-center'>
                                    <Button type="primary" onClick={() => handleWriterSelection(bid.writer.id, bid.order.id)}>Select Writer</Button>
                
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Modal>
    );
};

export default ViewBidModal;
