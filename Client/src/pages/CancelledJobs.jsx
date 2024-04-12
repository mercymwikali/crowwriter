import React, { useContext, useState } from 'react';
import { Button, Form, Input, InputNumber, DatePicker } from 'antd';
import { Tooltip } from 'antd';
import { DeleteFilled, DollarCircleOutlined, EditFilled, EditOutlined, EyeOutlined } from '@ant-design/icons';
import EditJob from '../components/EditJob';
import { JobContext } from '../context/JobContext';

const CancelledJobs = () => {
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
            <h2>Cancelled Jobs</h2>
          </div>
          <div className='col-sm-6'>
            <button className='btn btn-success' onClick={handleModal}>Cancel Job</button>
          </div>
        </div>
      </div>
      <table className='table table-hover table-responsive'>
        <thead>
          <tr>
            <th scope='col'>Id</th>
            <th scope='col'>Title</th>
            <th scope='col'>Assigned Writer</th>
            <th scope='col'>Pages</th>
            <th scope='col'>Deadline</th>
            <th scope='col'>Cost Per Page</th>
            <th scope='col'>Total Cost</th>
            <th scope='col'>Status</th>
            <th scope='col'>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedJobs.map((job, index) => (
            <tr key={index}>
              <td>{job.topic}</td>
              <td>{job.description}</td>
              <td>{job.pages}</td>
              <td>{job.deadline}</td>
              <td>{job.costPerPage}</td>
              <td>{job.totalCost}</td>
              <td>{job.status}</td>
              <td>
                <div className="d-flex gap-3 align-items-center justify-content-center">
                  <Tooltip placement='bottom' title='Edit Job'>
                    <button className='btn btn-warning' onClick={() => handleModal(job)}>
                      <EditFilled />
                      <span className='px-1'>Edit Job</span>
                    </button>
                  </Tooltip>
                  <Tooltip placement='bottom' title='Bid Job'>
                    <button className='btn btn-success'>
                      <DollarCircleOutlined />
                      <span className='px-1'>Bid Job</span>

                    </button>
                  </Tooltip>
                </div>
              </td>
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

export default CancelledJobs;
