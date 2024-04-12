import React, { useContext, useState } from 'react';
import { Button, Form, Input, InputNumber, DatePicker } from 'antd';
import { Tooltip } from 'antd';
import { DeleteFilled, DollarCircleOutlined, EditOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import EditJob from '../components/EditJob';
import { JobContext } from '../context/JobContext';

const RejectedJobs = () => {
  const { sortedJobs } = useContext(JobContext);
  const [openModal, setOpenModal] = useState(false);

  const handleModal = (job) => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    // Handle submit logic here
    closeModal();
  };

  return (
    <>
      <div className='table-title'>
        <div className='row'>
          <div className='col-sm-6'>
            <h2>Rejected Jobs</h2>
          </div>
          <div className='col-sm-6'>
            <button className='btn btn-success' onClick={handleModal}>Request Payment</button>
          </div>
        </div>
      </div>
      <table className='table table-hover table-responsive'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Topic</th>
            <th scope='col'>Reason</th>
            <th scope='col'>Job Fine</th>
            <th scope='col'>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedJobs.map((job, index) => (
            <tr key={index}>
              <td>{job.topic}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {openModal && (
        <div className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Job</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditJob closeModal={closeModal} setOpenModal={setOpenModal} handleSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RejectedJobs;
