import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listFines, editFine, deleteFine } from '../actions/FinesActions';
import { Modal, Button, Skeleton, Typography, message, Form, Input, Space, InputNumber } from 'antd';
import { DeleteOutlined, EditFilled } from '@ant-design/icons';

const FinedOrders = () => {
    const dispatch = useDispatch();
    const fineslist = useSelector(state => state.fineList);
    const { loading, error, fines } = fineslist;

    const fineUpdate = useSelector(state => state.updateFine);
    const { success: successUpdate } = fineUpdate;

    const fineDelete = useSelector(state => state.deleteFine);
    const { success: successDelete } = fineDelete;

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedFine, setSelectedFine] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(listFines());
    }, [dispatch]);

   useEffect(() => {
       if (successUpdate || successDelete) {
        dispatch(listFines());
        
       }
    }, [dispatch, successUpdate, successDelete]);

    const handleEditModalOpen = (fine) => {
        setSelectedFine(fine);
        setEditModalVisible(true);
        form.setFieldsValue({
            writer: fine.finedTo.username,
            topic: fine.order.topic,
            reason: fine.reason,
            amount: fine.amount
        });
    };

    const handleDeleteModalOpen = (fine) => {
        setSelectedFine(fine);
        setDeleteModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalVisible(false);
    };

    const handleEditSubmit = async (values) => {
        try {
            await dispatch(editFine(selectedFine.id, { ...selectedFine, ...values }));
            setEditModalVisible(false);
            // message.success('Fine updated successfully');
        } catch (error) {
            message.error('Failed to update fine');
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteFine(selectedFine.id));
            setDeleteModalVisible(false);
            // message.success('Fine deleted successfully');
        } catch (error) {
            message.error('Failed to delete fine');
        }
    };

    return (
        <div>
            <Typography.Title level={2} underline>Fined Orders</Typography.Title>
            {loading ? (
                <Skeleton active />
            ) : (
                <table className="table table-hover table-responsive">
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Writer</th>
                            <th scope='col'>Order ID</th>
                            <th scope='col'>Topic</th>
                            <th scope='col'>Date Posted</th>
                            <th scope='col'>Order Amount</th>
                            <th scope='col'>Fine Amount</th>
                            <th scope='col'>Reason</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr>
                                <td colSpan="8" className='text-danger py-2'>No records found</td>
                            </tr>
                        ) : fines && fines.length > 0 ? (
                            fines.map((fine, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{fine.finedTo.username}</td>
                                    <td>{fine.order.orderId}</td>
                                    <td>{fine.order.topic}</td>
                                    <td>{fine.order.createdAt}</td>
                                    <td>{fine.order.fullAmount}</td>
                                    <td>{fine.amount}</td>
                                    <td>{fine.reason}</td>
                                    <td>
                                        <Space>
                                            <Button type='primary' style={{ backgroundColor: '#FFC107' }} onClick={() => handleEditModalOpen(fine)}>
                                                <EditFilled style={{ color: 'white', fontSize: '21px' }} />
                                            </Button>
                                            <Button type='primary' danger onClick={() => handleDeleteModalOpen(fine)}>
                                                <DeleteOutlined style={{ color: 'white', fontSize: '21px' }} />
                                            </Button>
                                        </Space>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className='text-danger py-2'>No records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            {/* Edit Fine Modal */}
            <Modal
                title="Edit Fine"
                visible={editModalVisible}
                onCancel={handleEditModalClose}
                footer={[
                    <Button key="cancel" onClick={handleEditModalClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Save
                    </Button>,
                ]}
            >
                {selectedFine && (
                    <Form
                        form={form}
                        onFinish={handleEditSubmit}
                    >
                        <Form.Item
                            label="Writer"
                            name="writer"
                            rules={[{ required: true, message: 'Please enter the writer!' }]}
                        >
                            <Input readOnly />
                        </Form.Item>
                        <Form.Item
                            label="Topic"
                            name="topic"
                            rules={[{ required: true, message: 'Please enter the topic!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Reason"
                            name="reason"
                            rules={[{ required: true, message: 'Please enter the reason for fine!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true, message: 'Please enter the fine amount!' }]}
                        >
                            <InputNumber className='w-100' />
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            {/* Delete Fine Modal */}
            <Modal
                title="Confirm Delete"
                visible={deleteModalVisible}
                onCancel={handleDeleteModalClose}
                footer={[
                    <Button key="cancel" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" danger onClick={handleDelete}>
                        Delete
                    </Button>,
                ]}
            >
                {selectedFine && (
                    <p>Are you sure you want to delete the fine with ID: <span className='fw-bold'>{selectedFine.order.orderId}</span>?</p>
                )}
            </Modal>
        </div>
    );
};

export default FinedOrders;
