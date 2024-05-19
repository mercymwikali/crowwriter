import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listWritersBids, deleteBid } from '../actions/bidActions';
import { Link } from 'react-router-dom';
import { Button, Skeleton, Tooltip, message, Modal } from 'antd';
import { FaEye } from 'react-icons/fa';
import { DeleteOutlined } from '@ant-design/icons';

const WriterBidList = () => {
    const dispatch = useDispatch();
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);

    const writerBidList = useSelector(state => state.writerBidList);
    const { loading, error, bids } = writerBidList;
    
    const deleteBidState = useSelector(state => state.deleteBid);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = deleteBidState;

    useEffect(() => {
        dispatch(listWritersBids());
    }, [dispatch, successDelete]);

    const handleViewJob = (bid) => {
        setSelectedBid(bid);
        setViewModalVisible(true);
    }

    const handleCloseViewModal = () => {
        setViewModalVisible(false);
    }

    const handleDeleteBid = (bid) => {
        setSelectedBid(bid);
        setDeleteModalVisible(true);
    }

    const handleConfirmDelete = async () => {
        await dispatch(deleteBid(selectedBid.id));
        setDeleteModalVisible(false);
        message.success('Bid deleted successfully');
    }

    const handleCancelDelete = () => {
        setDeleteModalVisible(false);
    }

    return (
        <>
            <h1 className='text-success'>Bids List</h1>
            <div className="d-block d-md-flex gap-4 justify-content-between align-items-center">
                <h4><Link className='btn btn-success' to="jobs-pool" type='button'>Job Pool</Link></h4>
            </div>

            {loading ? (
                <Skeleton active />
            ) : error ? (
                message.error(error)
            ) : (
                bids && bids.length > 0 ? (
                    <table className="table table-hover table-responsive">
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>OrderId</th>
                                <th scope='col'>Topic</th>
                                <th scope='col'>Full Amount(Ksh)</th>
                                <th scope='col'>Deadline</th>
                                <th scope='col'>Remaining Time</th>
                                <th scope='col'>Status</th>
                                <th scope='col'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bids.map((bid, index) => (
                                <tr key={index}>
                                    <td>{index + 1}.</td>
                                    <td>{bid.order.orderId}</td>
                                    <td>{bid.order.topic}</td>
                                    <td>{bid.order.fullAmount}</td>
                                    <td>{new Date(bid.order.deadline).toDateString()}</td>
                                    <td>{bid.order.remainingTime}</td>
                                    <td>{bid.order.status}</td>
                                    <td>
                                        <Tooltip title="View Details">
                                            <Button type='primary' icon={<FaEye />} onClick={() => handleViewJob(bid)} />
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <Button type='danger' icon={<DeleteOutlined />} onClick={() => handleDeleteBid(bid)} />
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No jobs to be bid</p>
                )
            )}

            {/* View Modal */}
            <Modal
                title="View Bid Details"
                visible={viewModalVisible}
                onCancel={handleCloseViewModal}
                footer={[
                    <Button key="back" onClick={handleCloseViewModal}>
                        Close
                    </Button>
                ]}
            >
                {selectedBid && (
                    <div>
                        <p>Order ID: {selectedBid.order.orderId}</p>
                        {/* Add other bid details */}
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                title="Confirm Delete"
                visible={deleteModalVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
            >
                Are you sure you want to delete this bid?
            </Modal>
        </>
    );
};

export default WriterBidList;
