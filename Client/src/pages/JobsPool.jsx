import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../actions/orderActions';
import { Skeleton, message, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import JobViewModal from '../components/viewJob';
import BidJobModal from '../components/BidJob';
import { EyeFilled } from '@ant-design/icons';

const JobsPool = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [bidJob, setBidJob] = useState(null);
  const [viewBidModal, setViewBidModal] = useState(false);

  const listedJobs = useSelector((state) => state.ordersList);
  const { loading, error, orders, success } = listedJobs;

  const bidJobState = useSelector((state) => state.bidJob);
  const { success: bidSuccess } = bidJobState;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch, success, bidSuccess]);

  useEffect(() => {
    if (bidSuccess && bidSuccess === true) {
      navigate('/manager/writer-bids-list'); // Navigate to bid list on successful bid
    }
  }, [bidSuccess, navigate]);

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setViewModal(true);
  };

  const handleCloseModal = () => {
    setViewModal(false);
    setViewBidModal(false);
  };

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
          <table className="table table-hover table-responsive">
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
                        <Button className="view-job-btn " onClick={() => handleViewJob(order)}>
                         <EyeFilled />
                         view
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
