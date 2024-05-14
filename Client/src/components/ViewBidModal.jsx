import { Button, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listBidsWithDetails } from '../actions/bidActions';
import { LoadingOutlined } from '@ant-design/icons';
import {  assignOrder, createdOrder } from '../actions/orderActions';

const ViewBidModal = ({ visible, onCancel, selectedBid }) => {
    const dispatch = useDispatch();
    const bidlistDetails = useSelector(state => state.bidlistDetails);
    // Add error handling here
    const { loading, error, bids } = bidlistDetails || {};

    const [selectedWriterId, setSelectedWriterId] = useState(null);

    useEffect(() => {
        if (selectedBid) {
            dispatch(listBidsWithDetails(selectedBid.id));
        }
    }, [selectedBid, dispatch]);

    
    const handleWriterSelection = (writerId) => {
        setSelectedWriterId(writerId);
        console.log('Selected writer:', writerId);
    };   

    const handleAssignOrder = () => {
        if (selectedBid && selectedWriterId) {
            dispatch(assignOrder(selectedBid.orderId, selectedWriterId))
            onCancel();
        }

        console.log('Selected writer:', selectedWriterId);
        console.log('Selected bid:', selectedBid);
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
                                    <Button type='primary' onClick={() => handleWriterSelection(bid.writer.id)}>Select Writer</Button>                                  
                
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
