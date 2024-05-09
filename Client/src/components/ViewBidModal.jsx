import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Spin } from 'antd';
import { listBidsWithDetails } from '../actions/bidActions';
import { LoadingOutlined } from '@ant-design/icons';

const ViewBidModal = ({ visible, onCancel, selectedBid }) => {
    const dispatch = useDispatch();

    const bidlistDetails = useSelector(state => state.bidlistDetails);
    const { loading, error, bids } = bidlistDetails;

    useEffect(() => {
        if (selectedBid) {
            dispatch(listBidsWithDetails(selectedBid.id)); // Fetch bid details based on selected order ID
        }
    }, [selectedBid, dispatch]);

    return (
        <>
            {selectedBid && (
                <Modal
                    title="Bids"
                    visible={visible}
                    onCancel={onCancel}
                    style={{ scrollbarColor: 'red', scrollbarWidth: 'thin', overflowY: 'auto' }}
                    width={1000}
                    footer={<Button onClick={onCancel}>Close</Button>}
                >
                    {loading ? (
                        <div style={{ textAlign: 'center' }}>
                            <Spin
                                indicator={
                                    <LoadingOutlined
                                        style={{
                                            fontSize: '48px', // Increase the size
                                            color: '#1890ff', // Optional: Customize the color
                                        }}
                                        spin
                                    />
                                }
                            />
                            <p style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>Loading list...</p>
                        </div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                        <table className='table table-hover table-responsive p-3'>
                            <thead className='table-dark '>
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
                                        <td>
                                            <div className='d-flex justify-content-space-around align-items-center gap-3'>
                                                <Button type="primary" >Assign Order</Button>
                                                <Button type="primary" danger >Delete Order</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Modal>
            )}
        </>
    );
};

export default ViewBidModal;
