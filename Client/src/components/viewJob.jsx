import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber } from 'antd';

const ViewJob = ({ rowData, closeModal }) => {
  const [formState, setFormState] = useState({
    topic: '',
    description: '',
    pages: 0,
    costPerPage: 0,
    deadline: null,
  });

  useEffect(() => {
    if (rowData) {
      setFormState({
        topic: rowData.topic,
        description: rowData.description,
        pages: rowData.pages,
        costPerPage: rowData.costPerPage,
        deadline: rowData.deadline,
      });
    }
  }, [rowData]);

  const handleSubmit = () => {
    // Handle submit logic here
    closeModal();
  };

  const { TextArea } = Input;

  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">View Job</h5>
            <button type="button" className="close" onClick={closeModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item label="Topic :" name="topic" rules={[{ required: true, message: 'Please input your Topic!' }]}>
                <Input value={formState.topic} disabled />
              </Form.Item>
              <Form.Item label="Description :" name="description" rules={[{ required: true, message: 'Please input your Description!' }]}>
                <TextArea value={formState.description} disabled />
              </Form.Item>
              <Form.Item label="Pages :" name="pages" rules={[{ required: true, message: 'Please input your Pages!' }]}>
                <InputNumber value={formState.pages} disabled />
              </Form.Item>
              <Form.Item label="Cost Per Page :" name="costPerPage" rules={[{ required: true, message: 'Please input your Cost Per Page!' }]}>
                <InputNumber value={formState.costPerPage} disabled />
              </Form.Item>
              <Form.Item label="Deadline :" name="deadline" rules={[{ required: true, message: 'Please input your Deadline!' }]}>
                <DatePicker value={formState.deadline} disabled />
              </Form.Item>
            </Form>
          </div>
          <div className="modal-footer">
            <Button type="button" className="btn btn-secondary" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJob;
