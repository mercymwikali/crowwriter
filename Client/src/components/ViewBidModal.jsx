import { Button, Card, Modal, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listBidsWithDetails } from '../actions/bidActions';
import { LoadingOutlined } from '@ant-design/icons';
import { assignOrder } from '../actions/assigningActions';
import { FaUserPlus } from 'react-icons/fa';

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
            // title="Bids"
            visible={visible}
            onCancel={onCancel}
            style={{ scrollbarColor: 'red', scrollbarWidth: 'thin', overflowY: 'auto' }}
            width={1000}
            footer={[
                <Button key="cancel" onClick={onCancel}>Close</Button>,
                <Button key="assign" type="primary" style={{backgroundColor: 'green' }} loading={loading} onClick={handleAssignOrder}><span className='px-2'>Hire Writer</span>
                <FaUserPlus />
                </Button>,
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
                <>
                    <h3>Order {bids[0]?.order?.orderId}!</h3> {/* Corrected order ID display */}
                    <Card title="Order Details" style={{ width: '100%', marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
                        <p>Topic: {bids[0]?.order?.topic}</p>
                        <p>Deadline: {new Date(bids[0]?.order?.deadline).toLocaleDateString()}</p>
                        <p>Cost: {bids[0]?.order?.costPerPage}.00</p>
                    </Card>
                    <table className='table table-hover table-responsive p-3'>
                        <thead className='table-success'>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>

                                <th scope="col" className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bids && bids.length > 0 && bids.map((bid, index) => (
                                <tr key={index}>
                                    <td>{bid.writer.username}</td>
                                    <td>{bid.writer.email}</td>
                                    <td className='text-center'>
                                        <Button type="primary" onClick={() => handleWriterSelection(bid.writer.id, bid.order.id)} ghost>Select Writer</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </Modal>
    );
};

export default ViewBidModal;
