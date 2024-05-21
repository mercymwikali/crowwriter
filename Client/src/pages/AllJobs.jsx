import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton, Tooltip, message, Button, Modal, Pagination, Form, Input, DatePicker, Tag } from 'antd';
import { DeleteFilled, EditFilled, TagsOutlined } from '@ant-design/icons';
import { listOrders, updateOrder } from '../actions/orderActions';
import moment from 'moment';
import AssignWriter from '../components/AssignButton';
import FileUpload from '../components/FileUpload';
import { assignOrder } from '../actions/assigningActions';

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
    try {
      await dispatch(updateOrder(selectedorder.id, selectedorder));
      message.success('Order updated successfully');
      seteditModalVisible(false);

      // Optionally, clear the form fields
      oncancel();
    } catch (error) {
      message.error('Failed to update order');
    }

  }

  const handleAssignOrder = async () => {
    // Implement the logic to assign the order to a writer here
    console.log("Assigning order:", selectedorder);
    // You can dispatch an action to assign the order
    // For example: dispatch(assignOrder(selectedorder.id, writerId));
    dispatch(assignOrder(selectedorder.id, writerId));
    // Remember to handle the assignment logic based on the selected writer ID
  };

  const handleFileChange = (event) => {
    setSelectedorder({ ...selectedorder, [event.target.name]: event.target.value });
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
      <h1 className='text-success'>All orders</h1>
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
            <Form.Item label="Topic">
              <Input value={selectedorder.topic} onChange={(e) => setSelectedorder({ ...selectedorder, topic: e.target.value })} />
            </Form.Item>
            <Form.Item label="Discipline">
              <Input value={selectedorder.discipline} onChange={(e) => setSelectedorder({ ...selectedorder, discipline: e.target.value })} />
            </Form.Item>
            <Form.Item label="Service">
              <Input value={selectedorder.service} onChange={(e) => setSelectedorder({ ...selectedorder, service: e.target.value })} />
            </Form.Item>
            <Form.Item label="No of Pages">
              <Input value={selectedorder.noOfPages} onChange={(e) => setSelectedorder({ ...selectedorder, noOfPages: e.target.value })} />
            </Form.Item>
            <Form.Item label="Cost Per Page">
              <Input value={selectedorder.costPerPage} onChange={(e) => setSelectedorder({ ...selectedorder, costPerPage: e.target.value })} />
            </Form.Item>
            <Form.Item label="Full Amount">
              <Input value={selectedorder.fullAmount} onChange={(e) => setSelectedorder({ ...selectedorder, fullAmount: e.target.value })} />
            </Form.Item>
            <Form.Item label="Deadline">
              <DatePicker
                style={{ width: '100%' }}
                value={selectedorder.deadline ? moment(selectedorder.deadline) : null}
                onChange={(date, dateString) => setSelectedorder({ ...selectedorder, deadline: dateString })}
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea rows={14} cols={30}  value={selectedorder.description} onChange={(e) => setSelectedorder({ ...selectedorder, description: e.target.value })} />
            </Form.Item>
            {/* file upload */}
            <Form.Item label="Upload File">
              <FileUpload onFileUpload={handleFileChange} />
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
