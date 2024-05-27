import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createdOrder, listOrderstatusEnums } from '../actions/orderActions';
import FileUpload from '../components/FileUpload';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles

const { Option } = Select;

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

  const services = [
    { value: 'Writing', label: 'Writing' },
    { value: 'Rewriting', label: 'Rewriting' },
    { value: 'Editing', label: 'Editing' },
    { value: 'Proofreading', label: 'Proofreading' },
    { value: 'Translation', label: 'Translation' },
    { value: 'Problem-Solving', label: 'Problem-Solving' },
    { value: 'Other', label: 'Other' },
  ];

  const disciplines = [
    { value: 'English', label: 'English' },
    { value: 'Math', label: 'Math' },
    { value: 'Social Works', label: 'Social Works' },
    { value: 'History', label: 'History' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Art', label: 'Art' },
    { value: 'Business & Management', label: 'Business & Management' },
    { value: 'Nursing', label: 'Nursing' },
  ];

  const sources = [
    { value: 'One source', label: 'One source' },
    { value: 'Two sources', label: 'Two sources' },
    { value: 'Three sources', label: 'Three sources' },
    { value: 'Four sources', label: 'Four sources' },
    { value: 'Five sources', label: 'Five sources' },
    { value: 'Six sources', label: 'Six sources' },
    { value: 'Seven sources', label: 'Seven sources' },
    { value: 'Eight sources', label: 'Eight sources' },
    { value: 'Nine sources', label: 'Nine sources' },
    { value: 'Ten sources', label: 'Ten sources' },
  ];

  const citationStyles = [
    { value: 'APA 6th Edition', label: 'APA 6th Edition' },
    { value: 'APA 7th Edition', label: 'APA 7th Edition' },
    { value: 'ASA', label: 'ASA' },
    { value: 'IEEE', label: 'IEEE' },
    { value: 'MLA', label: 'MLA' },
    { value: 'Chicago', label: 'Chicago' },
    { value: 'Harvard', label: 'Harvard' },
  ];

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
    dispatch(createdOrder(formattedOrder))
      .then(() => {
        if (success) {
          message.success('Order created successfully');
          navigate('/manager/all-jobs');
        }
      })
      .catch((error) => {
        message.error('Failed to create order');
      });
  };

  const handleRemainingTime = (deadline) => {
    const now = moment();
    const end = moment(deadline);
    const duration = moment.duration(end.diff(now));
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours() % 24);
    const minutes = Math.floor(duration.asMinutes() % 60);
    setNewOrder(prevState => ({ ...prevState, remainingTime: `${days} days and ${hours} hours ` }));

    //if 0 days, then show only hours
    if (days === 0) {
      setNewOrder(prevState => ({ ...prevState, remainingTime: `${hours} hours ` }));
    }

    //if hours are 0, then show only show minutes
    if (hours === 0) {
      setNewOrder(prevState => ({ ...prevState, remainingTime: `${minutes} minutes ` }));
    }
   

    //else if cleared deadline
    if (deadline === null) {  
      setNewOrder(prevState => ({ ...prevState, remainingTime: 'No Deadline' }));


    };

  };

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
            <Select
              value={newOrder.discipline}
              onChange={(value) => handleChange('discipline', value)}
              options={disciplines}
            />
          </Form.Item>
          <Form.Item label="Service">
            <Select
              value={newOrder.service}
              onChange={(value) => handleChange('service', value)}
              options={services}
            />
          </Form.Item>
          {/* <Form.Item label="No of Sources Required">
            <Select
              value={newOrder.sources}
              onChange={(value) => handleChange('sources', value)}
              options={sources}
            />
          </Form.Item> */}
          <Form.Item label="Format/Citation Style">
            <Select
              value={newOrder.format}
              onChange={(value) => handleChange('format', value)}
              options={citationStyles}
            />
          </Form.Item>
          <Form.Item label="Description">
            <ReactQuill value={newOrder.description} onChange={(value) => handleChange('description', value)} theme="snow" style={{ height: '200px' }} />
          </Form.Item>
          <Form.Item label="No of Pages" style={{ marginTop: '50px' }}>
            <InputNumber
              className="w-100"
              value={newOrder.noOfPages}
              onChange={(value) => handleChange('noOfPages', value)}
            />
          </Form.Item>
          <Form.Item label="Cost Per Page">
            <InputNumber
              className="w-100"
              value={newOrder.costPerPage}
              onChange={(value) => handleChange('costPerPage', value)}
            />
          </Form.Item>
          <Form.Item label="Full Amount (ksh)">
            <InputNumber className="w-100" value={newOrder.fullAmount} readOnly />
          </Form.Item>
          <Form.Item label="Deadline">
            <DatePicker
              showTime
              value={newOrder.deadline ? moment(newOrder.deadline) : null}
              onChange={(date, dateString) => handleChange('deadline', dateString)}
              className="w-100"
            />
          </Form.Item>
          <Form.Item label="Due In">
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
