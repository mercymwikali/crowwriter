import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myJobs } from '../actions/writersActions';
import useAuth from '../hooks/useAuth';
import { Button, Skeleton, Tooltip, Typography, message } from 'antd';
import { IoSendSharp } from 'react-icons/io5';
import SubmitOrder from '../components/SubmitOrder';
import { CloudDownloadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { downloadOrderAttachment } from '../actions/orderActions';
import DeleteOrderModal from '../components/DeletedSubmission';

const WriterSubList = () => {
    const dispatch = useDispatch();
    const writer = useAuth();
    const writerId = writer ? writer.UserInfo.id : null;

    const myJobsState = useSelector((state) => state.myJobs);
    const { loading, error, orders } = myJobsState;
    const { success: deleteSuccess, error: deleteError } = useSelector(state => state.deleteSubmittedOrder);

    const [submitOrderModal, setSubmitOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete modal visibility

    const handleDownload = async (order) => {
        try {
            await dispatch(downloadOrderAttachment(order.id, order.order.orderId));
        } catch (error) {
            message.error('Failed to download attachment');
        }
    }

    useEffect(() => {
        if (writerId) {
            dispatch(myJobs(writerId));
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
    }

    const handleCancel = () => {
        setSubmitOrderModal(false);
    }

    return (
        <>
            <Typography.Title>Submitted Jobs List</Typography.Title>
            {loading ? (
                <Skeleton active />
            ) : error ? (
                <>{message.error(error)}</>
            ) : orders ? (
                <table className="table table-hover table-responsive">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">OrderId</th>
                            <th scope="col">Topic</th>
                            <th scope="col">Full Amount(ksh)</th>
                            <th scope='col'>Due Date</th>
                            <th scope="col">Status</th>
                            <th scope='col' className='text-center'>Attachment</th>
                            <th scope="col" className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{order.order.orderId}</td>
                                <td>{order.order.topic}</td>
                                <td>{order.order.fullAmount}</td>
                                <td>{new Date(order.order.deadline).toLocaleDateString()}</td>
                                <td>{order.order.status}</td>
                                <td className='text-center'>
                                    <Tooltip title="Download Attachment File">
                                        <Button
                                            type="primary"
                                            onClick={() => handleDownload(order)} // Pass the order to handleDownload
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
                                            onClick={() => setDeleteModalVisible(true)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
            <SubmitOrder visible={submitOrderModal} onCancel={handleCancel} selectedOrder={selectedOrder} />
            <DeleteOrderModal
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                orderId={selectedOrder?.id ? selectedOrder.id : null}
                onSubmit={() => setDeleteModalVisible(false)}
                selectedOrder={selectedOrder} // Pass selectedOrder to the modal
            />
        </>
    );
};

export default WriterSubList;
