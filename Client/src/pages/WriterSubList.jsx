import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton, Tooltip, Typography, Button, message } from 'antd';
import { CloudDownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { downloadSubmission, listWritersSubmissions, deleteOrder } from '../actions/submitAction';
import useAuth from '../hooks/useAuth';
import SubmitOrder from '../components/SubmitOrder';
import DeleteOrderModal from '../components/DeletedSubmission';

const WriterSubList = () => {
    const dispatch = useDispatch();
    const writer = useAuth();
    const writerId = writer ? writer.UserInfo.id : null;

    const mysubmissions = useSelector(state => state.submissionByWriter);
    const { loading, error, submissions } = mysubmissions;
    const { success: deleteSuccess, error: deleteError } = useSelector(state => state.deleteSubmittedOrder);

    const [submitOrderModal, setSubmitOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleDownload = async (documentId) => {
        try {
            if (documentId) {
                await dispatch(downloadSubmission(documentId));
            }
        } catch (error) {
            message.error("Failed to download file");
        }
    };

    useEffect(() => {
        if (writerId) {
            dispatch(listWritersSubmissions(writerId));
        }
        if (deleteSuccess) {
            message.success(deleteSuccess);
        } else if (deleteError) {
            message.error(deleteError);
        }
    }, [dispatch, writerId, deleteSuccess, deleteError]);

    const handleSubmitOrder = (order) => {
        setSelectedOrder(order);
        setSubmitOrderModal(true);
    };

    const handleCancel = () => {
        setSubmitOrderModal(false);
    };

    const handleDelete = (submission) => {
        setSelectedOrder(submission);
        setDeleteModalVisible(true);
    };

    return (
        <>
            <Typography.Title>Submitted Jobs</Typography.Title>
            {loading ? (
                <Skeleton active />
            ) : error ? (
                <>{message.error(error)}</>
            ) : submissions && submissions.documents && submissions.documents.length > 0 ? (
                <table className="table table-hover table-responsive">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">OrderId</th>
                            <th scope="col">Topic</th>
                            <th scope="col">Full Amount (ksh)</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Status</th>
                            <th scope="col" className='text-center'>Attachment</th>
                            <th scope="col" className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.documents.map((submission, index) => (
                            <tr key={submission.documentId}>
                                <td>{index + 1}</td>
                                <td>{submission.orderId}</td>
                                <td>{submission.topic}</td>
                                <td>{submission.amount}</td>
                                <td>{new Date(submission.deadline).toLocaleDateString()}</td>
                                <td>{submission.status}</td>
                                <td className='text-center'>
                                    <Tooltip title="Download Attachment File">
                                        <Button
                                            type="primary"
                                            onClick={() => handleDownload(submission.documentId)}
                                        >
                                            <CloudDownloadOutlined style={{ marginRight: '5px', fontSize: '20px' }} />
                                        </Button>
                                    </Tooltip>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button
                                            icon={<DeleteOutlined />}
                                            danger
                                            onClick={() => handleDelete(submission)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No submitted jobs available.</p>
            )}
            <SubmitOrder visible={submitOrderModal} onCancel={handleCancel} selectedOrder={selectedOrder} />
            <DeleteOrderModal
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                selectedOrder={selectedOrder}
            />
        </>
    );
};

export default WriterSubList;
