import React from 'react';
import { Modal, Input, Form, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch hook
import { downloadOrderAttachment } from '../actions/orderActions';

const { TextArea } = Input;

const JobViewModal = ({ visible, onCancel, selectedJob }) => {
  const dispatch = useDispatch(); // Initialize useDispatch hook

  const downloadDocument = useSelector(state => state.downloadAttachment);
  const { loading, error, document } = downloadDocument;

  const handleDownload = () => {
    if (selectedJob && selectedJob.documentId) {
      dispatch(downloadOrderAttachment(selectedJob.documentId)); // Dispatch the action to download the attachment
    } else {
      message.error('No document available for download');
    }
  };

  // Function to remove <p> tags from description
  const extractDescription = (description) => {
    return description.replace(/<p>/g, '').replace(/<\/p>/g, '');
  };

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
            <Form.Item label="Due In:">
              <Input value={selectedJob.remainingTime} readOnly />
            </Form.Item>
            <Form.Item label="Description">
              <TextArea value={extractDescription(selectedJob.description)} readOnly style={{ resize: 'none', overflowY: 'auto' }} />
            </Form.Item>
            <Form.Item className='justify-content-center d-flex align-items-center'>
              <Button type="primary" size='large' icon={<DownloadOutlined />} style={{ marginTop: '16px' }} block onClick={handleDownload}>Download Attachment</Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default JobViewModal;
