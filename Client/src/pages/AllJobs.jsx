import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton, Tooltip, message, Button, Modal, Pagination } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { listOrders } from '../actions/orderActions';

const Allorders = () => {
  const dispatch = useDispatch();

  const ordersList = useSelector(state => state.ordersList)
  const { loading, error, orders } = ordersList

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedorder, setSelectedorder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25; // Display 25 rows per page

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const deleteorder = async (id) => {
    try {
      // Make API call to delete order
      const deleteResponse = await fetch(`https://crowwriter-api.vercel.app/orders/delete-order/${id}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete order');
      }

      // If deletion is successful, fetch the updated list of orders
      dispatch(listOrders());
      message.success(`order ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting order:', error.message);
      // Handle error
    }
  };

  const editorder = (order) => {
    setSelectedorder(order);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Pagination change handler
  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  // Calculate the start and end index for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <>
      <h1 className='text-success'>Listed orders</h1>
      <div className="d-block d-md-flex gap-4 justify-content-between align-items-center">
        <h4><Link className='btn btn-success' to="/Order-requirements-details" type='button'>Create New Order</Link></h4>
      </div>
      {loading ? (
        <Skeleton active />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>OrderId</th>
                <th scope='col'>Topic</th>
                <th scope='col'>Discipline</th>
                <th scope='col'>No of Pages</th>
                <th scope='col'>Cost Per Page</th>
                <th scope='col'>Full Amount</th>
                <th scope='col'>Deadline</th>
                <th scope='col'>Remaining Time</th>
                <th scope='col'>Status</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 && orders.slice(startIndex, endIndex).map((order, index) => (
                <tr key={order.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{order.orderId}</td>
                  <td>{order.topic}</td>
                  <td>{order.discipline}</td>
                  <td>{order.noOfPages}</td>
                  <td>{order.costPerPage}</td>
                  <td>{order.fullAmount}</td>
                  <td>{new Date(order.deadline).toLocaleDateString()}</td>
                  <td>{order.remainingTime}</td>
                  <td>{order.status}</td>
                  <td>
                    <Tooltip title="Edit">
                      <Button type="primary" icon={<EditFilled />} onClick={() => editorder(order)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button type="danger" icon={<DeleteFilled />} onClick={() => deleteorder(order.id)} />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            total={orders.length}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </>
      )}
      {/* Edit order Modal */}
      <Modal
        title="Edit order"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedorder && (
          <p>Implement your edit order form here</p>
        )}
      </Modal>
    </>
  );
};

export default Allorders;
