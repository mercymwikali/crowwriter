import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createdOrder, listOrderstatusEnums } from '../actions/orderActions';
import FileUpload from '../components/FileUpload';

const { TextArea } = Input;
const { Option } = Select;

const NewOrder = () => {
  const dispatch = useDispatch();
  const orderCreate = useSelector(state => state.orderCreate);
  const { loading, error, success, order } = orderCreate;

  const orderStatus = useSelector(state => state.orderStatus);
  const { orderstatuses } = orderStatus;

  const [newOrder, setNewOrder] = useState({
    orderId: '',
    topic: '',
    discipline: '',
    service: '',
    description: '',
    format: '',
    noOfPages: '',
    costPerPage: '',
    fullAmount: '',
    deadline: null,
    remainingTime: '',
    status: 'PENDING',
  });

  useEffect(() => {
    dispatch(listOrderstatusEnums());

  }, [dispatch]);

  const handleChange = (key, value) => {
    if (key === 'deadline') {
      // Calculate remaining time when deadline changes
      const currentTime = new Date();
      const remainingTimeInMilliseconds = new Date(value) - currentTime;
      const remainingHours = Math.floor(remainingTimeInMilliseconds / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingTimeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const remainingTimeString = `${remainingHours}hrs ${remainingMinutes}mins`;
      setNewOrder(prevState => ({ ...prevState, [key]: value, remainingTime: remainingTimeString }));
    } else {
      setNewOrder({ ...newOrder, [key]: value });
    }
  };

  const handleSubmit = async () => {
    // Handling deadline separately to ensure it's in the correct format
    const deadlineISOString = newOrder.deadline ? new Date(newOrder.deadline).toISOString() : null;
  
    // Creating a new order object with the updated deadline
    const updatedOrder = {
      ...newOrder,
      deadline: deadlineISOString,
    };
  
    // Dispatching the action to create the order with the updated order object
    dispatch(createdOrder(updatedOrder));
  
    // Reset the form after successful creation
    setTimeout(() => {
      setNewOrder({
        orderId: '',
        topic: '',
        discipline: '',
        service: '',
        description: '',
        format: '',
        noOfPages: '',
        costPerPage: '',
        fullAmount: '',
        deadline: null,
        remainingTime: '',
        status: 'PENDING',
      });
    }, 100);
  };
  

  return (
    <>
      <Typography.Title level={3}>New Order</Typography.Title>
      <h6>Order Requirements</h6>
      <div>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Order ID" name="orderId" rules={[{ required: true, message: 'Please input the Order ID!' }]}>
            <Input size="large" placeholder="Enter the Order ID" onChange={(e) => handleChange('orderId', e.target.value)} />
          </Form.Item>
          <Form.Item label="Topic" name="topic" rules={[{ required: true, message: 'Please input the Topic!' }]}>
            <Input size="large" placeholder="Enter the Topic" onChange={(e) => handleChange('topic', e.target.value)} />
          </Form.Item>
          <Form.Item label="Discipline" name="discipline" rules={[{ required: true, message: 'Please input the Discipline!' }]}>
            <Input size="large" placeholder="Enter the Discipline" onChange={(e) => handleChange('discipline', e.target.value)} />
          </Form.Item>
          <Form.Item label="Service" name="service" rules={[{ required: true, message: 'Please input the Service!' }]}>
            <Input size="large" placeholder="Enter the Service" onChange={(e) => handleChange('service', e.target.value)} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea
              showCount
              placeholder="Description"
              style={{ height: 120 }}
              onChange={(e) => handleChange('description', e.target.value)}
              onScroll={(e) => handleChange('description', e.target.value)}
            />
          </Form.Item>
          <div className="d-block d-md-flex justify-content-between align-items-center">
            <Form.Item label="Format" name="format" rules={[{ required: true, message: 'Please input the Format!' }]}>
              <Input size="large" placeholder="Enter the Format" className='col-12  ' onChange={(e) => handleChange('format', e.target.value)} />
            </Form.Item>
            <Form.Item label="No of Pages" name="noOfPages" rules={[{ required: true, message: 'Please input the No of Pages!' }]}>
              <InputNumber size="large" min={0} defaultValue={1} className='col-12  ' onChange={(value) => handleChange('noOfPages', value)} />
            </Form.Item>
            <Form.Item label="Cost Per Page" name="costPerPage" rules={[{ required: true, message: 'Please input the Cost Per Page!' }]}>
              <InputNumber size="large" min={0} defaultValue={0} className='col-12 col-md-auto' onChange={(value) => handleChange('costPerPage', value)} />
            </Form.Item>
            <Form.Item label="Full Amount" name="fullAmount" rules={[{ required: true, message: 'Please input the Full Amount!' }]}>
              <InputNumber size="large" min={0} defaultValue={0} className='col-12 ' onChange={(value) => handleChange('fullAmount', value)} />
            </Form.Item>
            <Form.Item label="Deadline" name="deadline" rules={[{ required: true, message: 'Please input the Deadline!' }]}>
              <DatePicker size="large" onChange={(date, dateString) => handleChange('deadline', dateString)} />
            </Form.Item>

          </div>


          <Form.Item label="Remaining Time" name="remainingTime">
            <Input size="large" value={newOrder.remainingTime} readOnly />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please input the Status!' }]}>
            <Select
              size="large"
              placeholder="Select Status"
              onChange={(value) => handleChange('status', value)}
            >
              <Option value="PENDING">PENDING</Option>
              {orderstatuses && orderstatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="div my-3">
            <FileUpload />
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
