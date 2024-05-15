import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Progress } from 'antd';
import { useSelector } from 'react-redux';
import { API_URL as API } from "../../config";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function
const { Dragger } = Upload;

const SubmitDocs = ({ onSubmitDocs }) => { // Receive onSubmitDocs function as a prop
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const props = {
    name: 'file',
    multiple: true,
    action: `${API}/submitJob/job-docs`,
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const documentId = file.name
          resolve({
            name: file.name,
            url: reader.result,
            documentId: documentId, // Include document ID in file object
          });
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    },
    
    onChange(info) {
      const { status, response } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        // Extract documentId from response and send it back to the parent component
        if (response && response.documentId) {
          onSubmitDocs(response.documentId);
        } else if (response && response.data && response.data.documentId) {
          onSubmitDocs(response.data.documentId); // Adjust this line if documentId is nested in response.data
        } else {
          message.error('Failed to retrieve documentId from the response.');
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        console.error(info.file, info.fileList);
      }
    },

    onProgress({ percent }) {
      setProgress(percent);
    }
  };

  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support File Size Up to 5MB</p>
      </Dragger>
      {uploading && (
        <div style={{ marginTop: '1rem' }}>
          <Progress percent={progress} />
        </div>
      )}
    </div>
  );
};

export default SubmitDocs;
