import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, message, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import FileUpload from '../components/FileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrder } from '../actions/orderActions';

const { Option } = Select;

const EditJob = ({ job, setOpenModal }) => {
  const dispatch = useDispatch();
  const updateOrderState = useSelector((state) => state.editOrder);
  
  const { loading, success } = updateOrderState;

  const initialFormState = job || {
    id: '',
    topic: '',
    description: '',
    pages: 0,
    costPerPage: 0,
    deadline: null,
    discipline: '',
    service: '',
    format: ''
  };

  const [formState, setFormState] = useState(initialFormState);

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleFormSubmit = () => {
    dispatch(updateOrder(formState.id, formState));
    closeModal();
  };

  const handleChange = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <Form onFinish={handleFormSubmit} layout="vertical">
      <Form.Item label="Topic">
        <Input
          value={formState.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Discipline">
        <Select
          value={formState.discipline}
          onChange={(value) => handleChange('discipline', value)}
        >
          <Option value="English">English</Option>
          <Option value="Math">Math</Option>
          <Option value="Social Works">Social Works</Option>
          <Option value="History">History</Option>
          <Option value="Psychology">Psychology</Option>
          <Option value="Art">Art</Option>
          <Option value="Business & Management">Business & Management</Option>
          <Option value="Nursing">Nursing</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Service">
        <Select
          value={formState.service}
          onChange={(value) => handleChange('service', value)}
        >
          <Option value="Writing">Writing</Option>
          <Option value="Rewriting">Rewriting</Option>
          <Option value="Editing">Editing</Option>
          <Option value="Proofreading">Proofreading</Option>
          <Option value="Translation">Translation</Option>
          <Option value="Problem-Solving">Problem-Solving</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Format/Citation Style">
        <Select
          value={formState.format}
          onChange={(value) => handleChange('format', value)}
        >
          <Option value="APA 6th Edition">APA 6th Edition</Option>
          <Option value="APA 7th Edition">APA 7th Edition</Option>
          <Option value="ASA">ASA</Option>
          <Option value="IEEE">IEEE</Option>
          <Option value="MLA">MLA</Option>
          <Option value="Chicago">Chicago</Option>
          <Option value="Harvard">Harvard</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Description">
        <ReactQuill
          value={formState.description}
          onChange={(value) => handleChange('description', value)}
          theme="snow"
          style={{ height: '200px' }}
        />
      </Form.Item>
      <Form.Item label="Pages" style={{ marginTop: '46px' }}>
        <InputNumber
          className="w-100"
          value={formState.pages}
          onChange={(value) => handleChange('pages', value)}
        />
      </Form.Item>
      <Form.Item label="Cost Per Page">
        <InputNumber
          className="w-100"
          value={formState.costPerPage}
          onChange={(value) => handleChange('costPerPage', value)}
        />
      </Form.Item>
      <Form.Item label="Deadline">
        <DatePicker
          showTime
          value={formState.deadline ? moment(formState.deadline) : null}
          onChange={(date) => handleChange('deadline', date)}
          className="w-100"
        />
      </Form.Item>
      <Form.Item label="Upload File">
        <FileUpload onFileUpload={(documentId) => handleChange('documentId', documentId)} />
      </Form.Item>
      <div className="modal-footer d-flex justify-content-between">
        <Button type="primary" htmlType="submit">
          Save changes
        </Button>

        <Button type="primary" onClick={closeModal} ghost>
          Close
        </Button>
      </div>
    </Form>
  );
};

export default EditJob;
