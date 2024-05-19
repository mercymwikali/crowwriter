import React from 'react';
import { Modal, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder } from '../actions/submitAction';

const DeleteOrderModal = ({ visible, onCancel, selectedOrder }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.deleteSubmittedOrder);
  

  const handleDelete = () => {
    dispatch(deleteOrder(selectedOrder.order.id))
      .then(() => {
        message.success('Order deleted successfully');
        onCancel();
      })
      .catch((error) => {
        message.error('Failed to delete order');
        console.error('Error deleting order:', error);
      });
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
