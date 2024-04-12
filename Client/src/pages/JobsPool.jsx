import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, DatePicker } from 'antd';
import { Tooltip } from 'antd';
import { DeleteFilled, DollarCircleOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import EditJob from '../components/EditJob';
import { JobContext, useJobContext } from '../context/JobContext';
import useFetchOrder from '../hooks/useFetchOrder';

const JobsPool = () => {
  const {sortedJobs}=useJobContext();
  const {loading, error, fetchOrders} = useFetchOrder();
  const [orders, setOrders]=useState([]);
  const [openModal, setOpenModal] = useState(false);

useEffect(() => {
  fetchOrders();
}, []);


useEffect(() => {
  setOrders(sortedJobs);

}, [sortedJobs]);

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
            <h2>Jobs Pool</h2>
          </div>
          <div className='col-sm-6'>
            <button className='btn btn-success' onClick={handleModal}>Add Job</button>
          </div>
        </div>
      </div>
      {/* Table */}
      <table className='table table-hover table-responsive'>
        <thead>
          <tr>
            <th scope='col'>Topic</th>
            <th scope='col'>Description</th>
            <th scope='col'>Pages</th>
            <th scope='col'>Deadline</th>
            <th scope='col'>Cost Per Page</th>
            <th scope='col'>Total Cost</th>
            <th scope='col'>Status</th>
            <th scope='col' className='text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through orders and display each order in a table row */}
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.topic}</td>
              <td>{order.description}</td>
              <td>{order.noOfPages}</td>
              <td>{new Date(order.deadline).toLocaleDateString()}</td>
              <td>{order.costPerPage}</td>
              <td>{order.totalCost}</td>
              <td>{order.status}</td>
              <td>
                <div className="d-flex gap-3 align-items-center justify-content-center">
                  {/* Action buttons */}
                  <Tooltip placement='bottom' title='View Job'>
                    <button className='btn btn-primary' onClick={() => handleViewJob(order)}>
                      <EyeOutlined />
                      <span className='px-1'>View Job</span>
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
      {/* Modal */}
      {openModal && (
        <div className="modal" tabIndex="-1" role="dialog">
          {/* Modal content */}
        </div>
      )}
    </>
  );
};

export default JobsPool;
