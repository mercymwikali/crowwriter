import { Button, Form, Input, Modal, Typography, message } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBid } from '../actions/bidActions';
import { jwtDecode } from 'jwt-decode'; // Make sure this import is correct

const BidJobModal = ({ visible, onCancel, bidJob }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const decoded = jwtDecode(userInfo.accessToken);
//   console.log('Decoded token:', decoded);

//   // Access UserInfo from the decoded object
//   const { UserInfo } = decoded;
//   console.log( UserInfo);
  
  const { loading, success, error } = useSelector((state) => state.bidJob);

  useEffect(() => {
    if (success) {
      onCancel(); // Close the modal after successful bid creation
    }

    if (error) {
        onCancel(); // Close the modal if there's an error
    }
  }, [success, onCancel, error]);
  
  const handleBid = () => {    
    dispatch(createBid(bidJob.id, decoded.UserInfo.id));
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
              <Typography.Text ttype="primary" strong >Full Amount (ksh)</Typography.Text>
              <Input value={bidJob.fullAmount} readOnly />
            </Form.Item>
         
          </Form>
        </>
      )}
    </Modal>
  );
};

export default BidJobModal;
