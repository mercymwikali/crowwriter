import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton, Tooltip, message, Button, Modal, Pagination, Form, Input, DatePicker, Tag } from 'antd';
import { DeleteFilled, EditFilled, TagsOutlined } from '@ant-design/icons';
import { assignOrder, listOrders, updateOrder } from '../actions/orderActions';
import moment from 'moment';
import AssignWriter from '../components/AssignButton';

const { TextArea } = Input;

const Allorders = () => {
  const dispatch = useDispatch();

  const ordersList = useSelector(state => state.ordersList)
  const { loading, error, orders } = ordersList

  const [editModalVisible, seteditModalVisible] = useState(false);
  const [selectedorder, setSelectedorder] = useState(null);
  const [writerId, setWriterId] = useState('');
  const [assignOrderModal, setAssignOrderModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25; // Display 25 rows per page

  const editOrder = useSelector(state => state.editOrder);
  const { success: successEdit } = editOrder;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch, successEdit]);

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
    seteditModalVisible(true);
  };

  const assignorder = (order) => {
    setSelectedorder(order);
    setAssignOrderModal(true); // Correctly set assignOrderModal to true
  }

  const handleCancel = () => {
    setSelectedorder(null);
    seteditModalVisible(false);
    setAssignOrderModal(false);
  };

  const handleEditSubmit = async () => {
    console.log("Selected order:", selectedorder);

    if (selectedorder && selectedorder.id) {
      await dispatch(updateOrder(selectedorder.id, selectedorder));
      await dispatch(listOrders()); // Fetch the updated list of orders
    } else {
      console.error("Selected order or order ID is null");
    }
    handleCancel();
  }

  const handleAssignOrder = async () => {
    // Implement the logic to assign the order to a writer here
    console.log("Assigning order:", selectedorder);
    // You can dispatch an action to assign the order
    // For example: dispatch(assignOrder(selectedorder.id, writerId));
    dispatch(assignOrder(selectedorder.id, writerId));
    // Remember to handle the assignment logic based on the selected writer ID
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
        <h4><Link className='btn btn-success' to="/" type='button'>Create New Order</Link></h4>
      </div>
      {loading ? (
        <Skeleton active />
      ) : error ? (
        message.error(error)
      ) : (
        <>
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>OrderId</th>
                <th scope='col'>Topic</th>
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
                  <td>{order.noOfPages}</td>
                  <td>{order.costPerPage}</td>
                  <td>{order.fullAmount}</td>
                  <td>{new Date(order.deadline).toLocaleDateString()}</td>
                  <td>{order.remainingTime}</td>
                  <td>{order.status}</td>
                  <td>
                    <Tooltip title="Edit">
                      <Button type="ghost" icon={<EditFilled style={{ color: 'blue' }}/>} onClick={() => editorder(order)} />
                    </Tooltip>
                    <Tooltip title="Assign Order">
                      <Button type="ghost" icon={<TagsOutlined style={{ color: 'blue' }} />} onClick={() => assignorder(order)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button type="danger" icon={<DeleteFilled style={{ color: 'red' }} />} onClick={() => deleteorder(order.id)} />
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
        {selectedorder && (
          <Form>
            <Form.Item label="Order ID">
              <Input
                value={selectedorder.orderId}
                onChange={(e) =>
                  setSelectedorder({
                    ...selectedorder,
                    orderId: e.target.value,
                  })
                }
              />
            </Form.Item>
            {/* Other form fields */}
            <Button type="primary" onClick={handleEditSubmit} htmlType="submit">
              Save Changes
            </Button>
          </Form>
        )}
      </Modal>
      {/* Assign Writer Modal */}
      <AssignWriter
        selectedorder={selectedorder}
        onCancel={handleCancel}
        visible={assignOrderModal}
        handleAssignOrder={handleAssignOrder} // Pass the function here
        setWriterId={setWriterId} // Pass the setter function to update writerId
      />
    </>
  );
};

export default Allorders;
