import React, { useContext, useState } from 'react';
import { Button, Form, Input, InputNumber, DatePicker } from 'antd';
import { Tooltip } from 'antd';
import { DeleteFilled, DollarCircleOutlined, EditOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import EditJob from '../components/EditJob';
import { JobContext } from '../context/JobContext';

const WritersTransactions = () => {
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
            <h2>Payments</h2>
          </div>
          
        </div>
      </div>
      <table className='table table-hover table-responsive'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Title</th>
            <th scope='col'>Pages</th>
            <th scope='col'>Total Cost</th>
            <th scope='col'>Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedJobs.map((job, index) => (
            <tr key={index}>
              <td>{job.topic}</td>
              <td>{job.pages}</td>
              <td>{job.cost}</td>
              <td>{job.date}</td>
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

export default WritersTransactions;
