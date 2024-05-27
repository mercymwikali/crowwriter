import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton, Tooltip, message, Button, Modal, Pagination } from 'antd';
import { DeleteFilled, DeleteOutlined, EditFilled, TagsOutlined } from '@ant-design/icons';
import { listOrders } from '../actions/orderActions';
import moment from 'moment';
import AssignWriter from '../components/AssignButton';
import EditJob from '../components/EditJob';

const Allorders = () => {
  const dispatch = useDispatch();

  const ordersList = useSelector(state => state.ordersList);
  const { loading, error, orders } = ordersList;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [writerId, setWriterId] = useState('');
  const [assignOrderModal, setAssignOrderModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const deleteOrder = async (id) => {
    try {
      const deleteResponse = await fetch(`https://crowwriter-api.vercel.app/orders/delete-order/${id}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete order');
      }

      dispatch(listOrders());
      message.success(`Order ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting order:', error.message);
      message.error('Failed to delete order');
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditModalVisible(true);
  };

  const assignOrder = (order) => {
    setSelectedOrder(order);
    setAssignOrderModal(true);
  };

  const handleCancel = () => {
    setSelectedOrder(null);
    setEditModalVisible(false);
    setAssignOrderModal(false);
  };

  const handleEditSubmit = () => {
    dispatch(updateOrder(selectedOrder.id, selectedOrder));
    setEditModalVisible(false);
  };

  const handleAssignOrder = async () => {
    dispatch(assignOrder(selectedOrder.id, writerId));
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, orders && orders.length);

  return (
    <>
      <h1 className='text-dark'>My Orders</h1>
      <div className="d-block d-flex justify-content-end align-items-center my-1">
        <h4>
          <Link className='btn btn-success' to={'/manager/'} type='button'>Create New Order</Link>
        </h4>
      </div>
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>OrderId</th>
            <th scope='col'>Topic</th>
            <th scope='col'>No of Pages</th>
            <th scope='col'>Full Amount</th>
            <th scope='col'>Due In</th>
            <th scope='col'>Status</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10"><Skeleton active /></td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="10">{message.error(error)}</td>
            </tr>
          ) : (
            orders && orders.length === 0 ? (
              <tr>
                <td colSpan="10">No orders found</td>
              </tr>
            ) : (
              orders && orders.length > 0 && orders.slice(startIndex, endIndex).map((order, index) => (
                <tr key={order.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{order.orderId}</td>
                  <td>{order.topic}</td>
                  <td>{order.noOfPages}</td>
                  <td>{order.fullAmount}</td>
                  <td>{order.remainingTime}</td>
                  <td>{order.status}</td>
                  <td>
                   <div className="d-flex flex-col gap-2 ">
                   <Tooltip title="Update Order">
                      <Button type="primary" icon={<EditFilled style={{ color: '#fff' }} />} onClick={() => handleEdit(order)} >
                        Update Order
                      </Button>
                    </Tooltip>
                    <Tooltip title="Hire Writer">
                      <Button type="primary" icon={<TagsOutlined style={{ color: 'blue', fontSize: '18px' }} />} onClick={() => assignOrder(order)} ghost >
                        Hire Writer
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button type="primary" icon={<DeleteOutlined style={{ color: '#fff' }} />} onClick={() => deleteOrder(order.id)} danger>
                        Delete
                      </Button>
                    </Tooltip>
                   </div>
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
      <Pagination
        current={currentPage}
        total={orders ? orders.length : 0}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
      />

      <Modal
        title="Edit order"
        visible={editModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        maskClosable
        width={800}
        onOk={handleEditSubmit}
        okText="Update"
        cancelText="Cancel"
        centered
        style={{ top: 20, maxHeight: '90vh', overflow: 'auto' }}
      >
        {selectedOrder && (
          <EditJob job={selectedOrder} setOpenModal={setEditModalVisible} handleSubmit={handleEditSubmit} />
        )}
      </Modal>
      <AssignWriter
        selectedorder={selectedOrder}
        onCancel={handleCancel}
        visible={assignOrderModal}
        handleAssignOrder={handleAssignOrder}
        setWriterId={setWriterId}
      />
    </>
  );
};

export default Allorders;
