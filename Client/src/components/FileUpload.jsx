import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Progress } from 'antd';
import axios from 'axios';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:3001/uploadFile/upload', // Adjusted endpoint
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFileHandler = async (file) => {
    const formData = new FormData();
    formData.append('file', file); // Use 'file' instead of 'image'

    try {
      setUploading(true);
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      };

      const { data } = await axios.post('http://localhost:3001/uploadFile/upload', formData, config);
      console.log(data); // Log the response data
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <div>
      <Dragger {...props} beforeUpload={uploadFileHandler}>
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

export default FileUpload;
