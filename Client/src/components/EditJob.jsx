import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, message } from 'antd';

const EditJob = ({ job, setOpenModal, handleSubmit }) => {
  const initialFormState = job || {
    id: '',
    topic: '',
    description: '',
    pages: 0,
    costPerPage: 0,
    deadline: null,
  };

  const [formState, setFormState] = useState(initialFormState);

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleFormSubmit = async () => {
    try {
      // Make API call to update job
      const response = await fetch(`http://localhost:3001/orders/update-order/${formState.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      message.success('Job updated successfully');
      handleSubmit();
      closeModal();
    } catch (error) {
      console.error('Error updating job:', error.message);
      // Handle error
      message.error('Failed to update job');
    }
  };

  const { TextArea } = Input;

  return (
    <Form onFinish={handleFormSubmit} layout="vertical">
      {/* Form fields */}
      <div className="modal-footer">
        <Button type="button" className="btn btn-secondary" onClick={closeModal}>
          Close
        </Button>
        <Button type="primary" htmlType="submit">
          Save changes
        </Button>
      </div>
    </Form>
  );
};

export default EditJob;
