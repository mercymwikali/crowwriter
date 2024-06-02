import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listWritersBids, deleteBid } from '../actions/bidActions';
import { Link } from 'react-router-dom';
import { Button, Skeleton, Tooltip, Modal, Input, message } from 'antd';
import { FaEye } from 'react-icons/fa';
import { DeleteOutlined } from '@ant-design/icons';

const WriterBidList = () => {
    const dispatch = useDispatch();
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchTopic, setSearchTopic] = useState('');

    const writerBidList = useSelector(state => state.writerBidList);
    const { loading, error, bids } = writerBidList;

    const deleteBidState = useSelector(state => state.deleteBid);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = deleteBidState;

    useEffect(() => {
        dispatch(listWritersBids());
    }, [dispatch, successDelete]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
        if (errorDelete) {
            message.error(errorDelete);
        }
    }, [error, errorDelete]);

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

    const handleSearchOrderId = (e) => {
        setSearchOrderId(e.target.value);
    }

    const handleSearchTopic = (e) => {
        setSearchTopic(e.target.value);
    }

    const filteredBids = bids && bids.filter(bid =>
        bid.order.orderId.includes(searchOrderId) &&
        bid.order.topic.toLowerCase().includes(searchTopic.toLowerCase())
    );

    return (
        <>
            <h1 className='text-dark'>My Bids</h1>
            {/* <h4><Link className='btn btn-success' to="/dashboard/" >Go back to Available Jobs</Link></h4> */}

            <div className="d-block d-md-flex gap-4 justify-content-between align-items-center mb-3">
                <Input
                    placeholder="Search by Order ID"
                    value={searchOrderId}
                    onChange={handleSearchOrderId}
                    style={{ width: 200 }}
                />
                <Input
                    placeholder="Search by Topic"
                    value={searchTopic}
                    onChange={handleSearchTopic}
                    style={{ width: 200 }}
                />
            </div>

            {loading ? (
                <Skeleton active />
            ) : (
                <>
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
                            {filteredBids && filteredBids.length > 0 ? (
                                filteredBids.map((bid, index) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>No bids found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}

            {/* View Modal */}
            <Modal
                title="View Order Details"
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
                        {Object.entries(selectedBid.order)
                            .filter(([key]) => key !== 'id') // Exclude 'id' field
                            .map(([key, value]) => {
                                if (key === 'deadline') {
                                    value = new Date(value).toLocaleDateString(); // Format 'deadline' to ISO string
                                }
                                return (
                                    <p key={key}>
                                        <strong>{key}: </strong>
                                        {value}
                                    </p>
                                );
                            })}
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
