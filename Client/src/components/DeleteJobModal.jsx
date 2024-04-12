import React from 'react';
import { Modal, Button } from 'antd';

const DeleteJobModal = ({ visible, setVisible, job, deleteJob }) => {
  const handleDelete = () => {
    deleteJob(job.id);
  };

  return (
    <Modal
      title={`Delete Job: ${job.topic}`}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setVisible(false)}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this job?</p>
    </Modal>
  );
};

export default DeleteJobModal;
