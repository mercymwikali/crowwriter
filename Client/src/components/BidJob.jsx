import { Button, Form, Input, Modal, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBid } from '../actions/bidActions';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook

const BidJobModal = ({ visible, onCancel, bidJob }) => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.bidJob);

  // Use the useAuth hook to extract user information
  const userInfo = useAuth();


  
  const handleBid = () => {    
    // Ensure user information is available before attempting to access it
    if (userInfo) {
      dispatch(createBid(bidJob.id, userInfo.UserInfo.id)); // Pass user ID as a parameter
    }

    onCancel();
  };

  return (
    <Modal
      title="Bid Job"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleBid} loading={loading}>Bid</Button>
      ]}
    >
      {bidJob && (
        <>
          <Form>
            <Form.Item>
              <p>Are you sure you want to bid on this job?</p>
              <Typography.Text type="primary" strong >Order ID:</Typography.Text>
              <Input value={bidJob.orderId} readOnly />
            </Form.Item>
            <Form.Item>
              <Typography.Text type="primary" strong >Topic:</Typography.Text>
              <Input value={bidJob.topic} readOnly />
            </Form.Item>
            <Form.Item>
              <Typography.Text type="primary" strong >Full Amount (ksh)</Typography.Text>
              <Input value={bidJob.fullAmount} readOnly />
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default BidJobModal;
