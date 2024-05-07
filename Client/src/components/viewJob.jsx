import React from 'react';
import { Modal, Input, Form, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const JobViewModal = ({ visible, onCancel, selectedJob }) => {
  return (
    <Modal
      title="Order Details"
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>
      ]}
    >
      {selectedJob && (
        <>
          <Form>
            <Form.Item label="Order ID">
              <Input value={selectedJob.orderId} readOnly />
            </Form.Item>
            <Form.Item label="Topic">
              <Input value={selectedJob.topic} readOnly />
            </Form.Item>
            <Form.Item label="Service">
              <Input value={selectedJob.service} readOnly />
            </Form.Item>
            <Form.Item label="Discipline">
              <Input value={selectedJob.discipline} readOnly />
            </Form.Item>
            <Form.Item label="Number of Pages">
              <Input value={selectedJob.noOfPages} readOnly />
            </Form.Item>
            <Form.Item label="Cost Per Page">
              <Input value={selectedJob.costPerPage} readOnly />
            </Form.Item>
            <Form.Item label="Full Amount">
              <Input value={selectedJob.fullAmount} readOnly />
            </Form.Item>
            <Form.Item label="Deadline">
              <Input value={new Date(selectedJob.deadline).toLocaleDateString()} readOnly />
            </Form.Item>
            <Form.Item label="Remaining Time">
              <Input value={selectedJob.remainingTime} readOnly />
            </Form.Item>
            <Form.Item label="Description">
              <TextArea rows={13} value={selectedJob.description} readOnly />
            </Form.Item>
            <Form.Item className='justify-content-center d-flex align-items-center'>
              <Button type="primary" icon={<DownloadOutlined />} style={{ marginTop: '16px' }} block>Download Attachment</Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default JobViewModal;
