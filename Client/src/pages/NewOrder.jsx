import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createdOrder, listOrderstatusEnums } from '../actions/orderActions';
import FileUpload from '../components/FileUpload';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const NewOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderCreate = useSelector(state => state.orderCreate);
  const { loading, error, success } = orderCreate;

  const orderStatus = useSelector(state => state.orderStatus);
  const { orderstatuses } = orderStatus;

  const [newOrder, setNewOrder] = useState({
    orderId: '',
    topic: '',
    discipline: '',
    service: '',
    format: '',
    description: '',
    noOfPages: 0,
    costPerPage: 0,
    fullAmount: 0,
    deadline: null,
    remainingTime: '',
    documentId: '',
    status: 'PENDING',
  });



  useEffect(() => {
    if (success) {
      message.success('Order created successfully');
      navigate('/manager/all-jobs');
    }
  }, [success, navigate]);

  const handleChange = (key, value) => {
    setNewOrder(prevState => ({ ...prevState, [key]: value }));
    if (key === 'noOfPages' || key === 'costPerPage') {
      setNewOrder(prevState => ({ ...prevState, fullAmount: prevState.noOfPages * prevState.costPerPage }));
    }
    if (key === 'deadline') {
      handleRemainingTime(value);
    }
  };

  const handleSubmit = () => {
    const formattedOrder = {
      ...newOrder,
      deadline: newOrder.deadline ? moment(newOrder.deadline).toISOString() : null,
    };
    dispatch(createdOrder(formattedOrder));
  };

  // Calculate remaining time in days and hours
  const handleRemainingTime = (deadline) => {
    const now = moment();
    const end = moment(deadline);
    const duration = moment.duration(end.diff(now));
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours() % 24);
    setNewOrder(prevState => ({ ...prevState, remainingTime: `${days} days and ${hours} hours remaining` }));
  };

  // Function to handle capturing the generated UUID from FileUpload component
  const handleFileUpload = (documentId) => {
    setNewOrder(prevState => ({ ...prevState, documentId }));
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
          <Form.Item label="Description">
            <TextArea value={newOrder.description} onChange={(e) => handleChange('description', e.target.value)} />
          </Form.Item>
          <Form.Item label="No of Pages">
            <InputNumber className='w-100' value={newOrder.noOfPages} onChange={(value) => handleChange('noOfPages', value)} />
          </Form.Item>
          <Form.Item label="Cost Per Page">
            <InputNumber className='w-100' value={newOrder.costPerPage} onChange={(value) => handleChange('costPerPage', value)} />
          </Form.Item>
          <Form.Item label="Full Amount (ksh)">
            <InputNumber className='w-100' value={newOrder.fullAmount} readOnly />
          </Form.Item>
          <Form.Item label="Deadline">
            <DatePicker
              value={newOrder.deadline ? moment(newOrder.deadline) : null}
              onChange={(date, dateString) => handleChange('deadline', dateString)}
              className='w-100'
            />
          </Form.Item>
          <Form.Item label="Remaining Time">
            <Input value={newOrder.remainingTime} readOnly />
          </Form.Item>
          <div className="my-3">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
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
