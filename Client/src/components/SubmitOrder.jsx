import { Button, Form, Input, Modal, Typography, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubmitDocs from './SubmitDocs';
import useAuth from '../hooks/useAuth';
import { submitOrder, deleteOrder } from '../actions/submitAction';
import DeleteOrderModal from './DeletedSubmission';

const SubmitOrder = ({ visible, onCancel, selectedOrder }) => {
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector(state => state.submitOrder);
    const { success: deleteSuccess, error: deleteError } = useSelector(state => state.deleteSubmittedOrder);

    const [documentId, setDocumentId] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete modal visibility

    const { UserInfo } = useAuth();
    const writerId = UserInfo ? UserInfo.id : null;

    useEffect(() => {
        if (success) {
            message.success(success);
            onCancel(); // Close the modal on success
        } else if (error) {
            message.error(error);
        }

        if (deleteSuccess) {
            message.success(deleteSuccess);
        } else if (deleteError) {
            message.error(deleteError);
        }
    }, [success, error, deleteSuccess, deleteError, onCancel]);

    const handleOrderSubmit = () => {
        if (selectedOrder && selectedOrder.order.orderId && documentId && writerId) {
            dispatch(submitOrder(selectedOrder.orderId, writerId, documentId));
        } else {
            if (!documentId) message.error('Please upload at least one document.');
            if (!selectedOrder || !selectedOrder.orderId) message.error('Please select an order.');
            if (!writerId) message.error('Please login to submit order.');
        }
    };

    const onDocumentUpload = (docId) => {
        setDocumentId(docId);
    };

    return (
        <>
            <Modal
                title="Submit Order"
                visible={visible}
                onCancel={onCancel}
                width={800}
                footer={[
                    <Button key="submit" type="primary" loading={loading} onClick={handleOrderSubmit}>
                        Submit
                    </Button>,
                    <Button key="cancel" onClick={onCancel}>Cancel</Button>
                ]}
            >{selectedOrder && selectedOrder.order ? (
                <>
                    <Form.Item>
                        <Typography.Text strong>Order ID:</Typography.Text>
                        <Input value={selectedOrder.order.orderId} readOnly />
                    </Form.Item>
                    <Form.Item>
                        <Typography.Text strong>Topic:</Typography.Text>
                        <Input value={selectedOrder.order.topic} readOnly />
                    </Form.Item>
                    <Form.Item>
                        <Typography.Text strong>Full Amount (ksh):</Typography.Text>
                        <Input value={selectedOrder.order.fullAmount} readOnly />
                    </Form.Item>
                    <div className="my-3">
                        <Typography.Text strong>Submit Documents:</Typography.Text>
                        <SubmitDocs onSubmitDocs={onDocumentUpload} />
                    </div>
                </>
            ) : null}
            
            </Modal>
            <DeleteOrderModal visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                selectedOrder={selectedOrder}/>
        </>
    );
};

export default SubmitOrder;
