import React, { useState } from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Space, Typography, message } from 'antd';
import FileUpload from './FileUpload';

const { TextArea } = Input;

const NewOrder = () => {
  const [newOrder, setNewOrder] = useState({
    topic: '',
    typeOfPaper: '',
    discipline: '',
    noOfPages: '',
    deadline: null,
    description: '',
    citation: '',
    costPerPage: '',
    totalCost: '',
  });

  const handleChange = (key, value) => {
    setNewOrder({ ...newOrder, [key]: value });
  };
const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newOrder,
        typeofPaper: 'Research Paper', // Example value, replace with actual value
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit order');
    }
    message.success('Order submitted successfully!');
    setNewOrder({
      topic: '',
      typeOfPaper: '',
      discipline: '',
      noOfPages: '',
      deadline: null,
      description: '',
      citation: '',
      costPerPage: '',
      totalCost: '',
    });
  } catch (error) {
    console.error('Error submitting order:', error.message);
    message.error('Error submitting order: ' + error.message);
  }
};

  return (
    <>
      <Typography.Title level={3}>New Order</Typography.Title>
      <h6>Order Requirements</h6>
      <div>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Topic :" name="topic" rules={[{ required: true, message: 'Please input your Topic!' }]}>
            <Input size="large" placeholder="Enter your Topic" onChange={(e) => handleChange('topic', e.target.value)} />
          </Form.Item>
          <Form.Item label="Type of Paper :" name="typeOfPaper" rules={[{ required: true, message: 'Please input your Type of Paper!' }]}>
            <Input size="large" placeholder="Enter your Type of Paper" onChange={(e) => handleChange('typeOfPaper', e.target.value)} />
          </Form.Item>
          <Form.Item label="Discipline :" name="discipline" rules={[{ required: true, message: 'Please input your Discipline!' }]}>
            <Input size="large" placeholder="Enter your Discipline" onChange={(e) => handleChange('discipline', e.target.value)} />
          </Form.Item>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="No of Pages:" name="noOfPages" rules={[{ required: true, message: 'Please input your No of Pages!' }]}>
                <InputNumber size="large" min={0} defaultValue={1} onChange={(value) => handleChange('noOfPages', value)} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Deadline Date" name="deadline" rules={[{ required: true, message: 'Please input your Deadline Date!' }]}>
                <DatePicker size="large" onChange={(date) => handleChange('deadline', date)} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Cost Per Page" name="costPerPage" rules={[{ required: true, message: 'Please input the Cost Per Page!' }]}>
                <InputNumber size="large" min={0} defaultValue={0} onChange={(value) => handleChange('costPerPage', value)} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Description" name="description">
            <TextArea
              showCount
              maxLength={100}
              placeholder="Description"
              style={{ height: 120 }}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Citation" name="citation" rules={[{ required: true, message: 'Please input the Citation!' }]}>
            <Input size="large" placeholder="Citation" onChange={(e) => handleChange('citation', e.target.value)} />
          </Form.Item>
          <Form.Item label="Total Cost" name="totalCost" rules={[{ required: true, message: 'Please input the Total Cost!' }]}>
            <InputNumber size="large" min={0} defaultValue={0}  onChange={(value) => handleChange('totalCost', value)} />
          </Form.Item>
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" size="large">
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default NewOrder;
