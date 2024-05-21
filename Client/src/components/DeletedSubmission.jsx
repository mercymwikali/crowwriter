import React from 'react';
import { Modal, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder } from '../actions/submitAction';

const DeleteOrderModal = ({ visible, onCancel, selectedOrder }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.deleteSubmittedOrder);

  const handleDelete = () => {
    if (selectedOrder && selectedOrder.id) {
      dispatch(deleteOrder(selectedOrder.id)).then(() => {
        onCancel();
      });
    } else {
      message.error('Selected order is invalid');
    }
  };

  return (
    <Modal
      title="Delete Submitted Order"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this submitted order?</p>
    </Modal>
  );
};

export default DeleteOrderModal;
