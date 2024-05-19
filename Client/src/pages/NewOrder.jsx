import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createdOrder, listOrderstatusEnums } from '../actions/orderActions';
import FileUpload from '../components/FileUpload';
import AssignButton from '../components/AssignButton';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;

const NewOrder = () => {
  const dispatch = useDispatch();
  const orderCreate = useSelector(state => state.orderCreate);
  const { loading, error, success, order } = orderCreate;

  const orderStatus = useSelector(state => state.orderStatus);
  const { orderstatuses } = orderStatus;


  useEffect(() => {
    dispatch(listOrderstatusEnums());

  }, [dispatch]);

  const [newOrder, setNewOrder] = useState({
    orderId:'',
    topic: '',
    discipline: '',
    service: '',
    format: '',
    noOfPages: '',
    costPerPage: '',
    fullAmount: '',
    deadline: null,
    remainingTime: '',
    documentId: '',
status: 'PENDING',

  })

  const handleChange = (key, value) => {
    setNewOrder(prevState => ({ ...prevState, [key]: value }));

    // Add code to handle file upload

  }

  const handleSubmit = () => {
    dispatch(createdOrder(newOrder));

    // Reset all fields
    setNewOrder({
      orderId: '',
      topic: '',
      discipline: '',
      service: '',
      format: '',
      noOfPages: '',
      costPerPage: '',
      fullAmount: '',
      deadline: null,
      remainingTime: '',
      documentId: '',
      status: 'PENDING',
    });
  };


  // Function to handle capturing the generated UUID from FileUpload component
  const handleFileUpload = (documentId) => {
    setNewOrder(prevState => ({ ...prevState, documentId: documentId }));
  };

  return (
    <>
      <Typography.Title level={3}>New Order</Typography.Title>
      <h6>Order Requirements</h6>
      <div>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Order ID">
            <Input value={newOrder.orderId} onChange={(e) => handleChange('orderId', e.target.value)} />
          </Form.Item>
          <Form.Item label="Topic">
            <Input value={newOrder.topic} onChange={(e) => handleChange('topic', e.target.value)} />
          </Form.Item>
          <Form.Item label="Discipline">
            <Input value={newOrder.discipline} onChange={(e) => handleChange('discipline', e.target.value)} />
          </Form.Item>
          <Form.Item label="Service">
            <Input value={newOrder.service} onChange={(e) => handleChange('service', e.target.value)} />
          </Form.Item>
          <Form.Item label="Format">
            <Input value={newOrder.format} onChange={(e) => handleChange('format', e.target.value)} />
          </Form.Item>
          <Form.Item label="No of Pages">
            <InputNumber value={newOrder.noOfPages} onChange={(value) => handleChange('noOfPages', value)} />
          </Form.Item>
          <Form.Item label="Cost Per Page">
            <InputNumber value={newOrder.costPerPage} onChange={(value) => handleChange('costPerPage', value)} />
          </Form.Item>
          <Form.Item label="Full Amount">
            <InputNumber value={newOrder.fullAmount} onChange={(value) => handleChange('fullAmount', value)} />
          </Form.Item>
          <Form.Item label="Deadline">
  <DatePicker
    value={newOrder.deadline ? moment(newOrder.deadline, 'YYYY-MM-DD') : null}
    onChange={(date, dateString) => handleChange('deadline', dateString)}
  />
</Form.Item>


          <div className="div my-3">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
          <Form.Item label="Select Writer">
            <AssignButton />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              Create Order
            </Button>
          </Form.Item>
        </Form>

      </div>
    </>
  );
};

export default NewOrder;