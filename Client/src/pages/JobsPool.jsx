import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders} from '../actions/orderActions';
import { Skeleton, message, Button, Tooltip, Modal, Input, Space, Form } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { createBid } from '../actions/bidActions';
import { login } from '../actions/userActions';
import JobViewModal from '../components/viewJob';
import BidJobModal from '../components/BidJob';

const { TextArea } = Input;

const JobsPool = () => {
  const dispatch = useDispatch();
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [bidJob, setBidJob] = useState(null);
  const [viewBidModal, setViewBidModal] = useState(false);

  const listedJobs = useSelector((state) => state.ordersList);
  const { loading, error, orders } = listedJobs;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo} = userLogin;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setViewModal(true);
  }

  const handleCloseModal = () => {
    setViewModal(false);
    setViewBidModal(false);
  }

  // Frontend handleBid Function
  const handleBid = (job) => {
    setBidJob(job);
    setViewBidModal(true);
  
  };
  
  return (
    <>
    <h1 style={{ textAlign: 'start', color: 'Green', textDecorationLine: 'underline' }}>New Jobs</h1>
    {loading ? (
      <Skeleton active />
    ) : error ? (
      message.error(error)
    ) : (
      <>
        <table className="table writer-table table-hover table-responsive">
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>OrderId</th>
              <th scope='col'>Topic</th>
              <th scope='col'>Discipline</th>
              <th scope='col'>No of Pages</th>
              <th scope='col'>Cost Per Page</th>
              <th scope='col'>Full Amount</th>
              <th scope='col'>Deadline</th>
              <th scope='col'>Remaining Time</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 && orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order.orderId}</td>
                <td>{order.topic}</td>
                <td>{order.discipline}</td>
                <td>{order.noOfPages}</td>
                <td>{order.costPerPage}</td>
                <td>{order.fullAmount}</td>
                <td>{new Date(order.deadline).toLocaleDateString()}</td>
                <td>{order.remainingTime}</td>
                <td>
                  <div className="d-flex gap-3">
                    <Tooltip title="View Details">
                      <Button className="view-job-btn bg-warning" onClick={() => handleViewJob(order)}>
                        View
                      </Button>
                    </Tooltip>
                    <Tooltip title="Bid Job">
                      <Button type="primary" className="bid-job-btn" onClick={() => handleBid(order)}>
                        Bid
                      </Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <JobViewModal visible={viewModal} onCancel={handleCloseModal} selectedJob={selectedJob} />
        <BidJobModal visible={viewBidModal} onCancel={handleCloseModal} bidJob={bidJob} />
      </>
    )}
  </>
  
  );
};

export default JobsPool;
