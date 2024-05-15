import { Button, Flex, Form, Input, Modal, Typography } from 'antd';
import React from 'react';
import SubmitDocs from './SubmitDocs';

const SubmitOrder = ({ visible, onCancel, selectedOrder }) => {
    return (
        <>
            <Modal
                title="Submit Order"
                visible={visible}
                onCancel={onCancel}
                width={800}
                footer={[
                    <Button key="submit" type="primary">Submit</Button>,
                    <Button key="cancel" onClick={onCancel}>Cancel</Button>
                ]}
            >
                {selectedOrder && selectedOrder.orderId ? ( // Add conditional check
                    <>
                        <Form.Item >
                            <Typography.Text strong>Order ID:</Typography.Text>
                            <Input value={selectedOrder.order.orderId} readOnly />
                        </Form.Item>
                        <Form.Item >
                            <Typography.Text strong>Topic:</Typography.Text>
                            <Input value={selectedOrder.order.topic} readOnly />
                        </Form.Item>
                        <Form.Item >
                            <Typography.Text strong>Full Amount (ksh):</Typography.Text>
                            <Input value={selectedOrder.order.fullAmount} readOnly />
                        </Form.Item>
                        <div className="my-3">
                            <Typography.Text strong>Submit Documents:</Typography.Text>
                            <SubmitDocs/>
                        </div>


                    </>
                ) : null}
            </Modal>
        </>
    );
}

export default SubmitOrder;
