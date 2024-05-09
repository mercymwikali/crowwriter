import { EyeOutlined, DeleteFilled } from '@ant-design/icons';
import { Skeleton, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listBids } from '../actions/bidActions';
import ViewBidModal from '../components/ViewBidModal';

const BidsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewBids, setViewBids] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  const bidsList = useSelector(state => state.bidsList);
  const { loading, error, orders } = bidsList;

  useEffect(() => {
    dispatch(listBids());
  }, [dispatch]);

  const handleViewBids = (order) => {
    setSelectedBid(order); // Set the selected order directly
    setViewBids(true); // Open the modal
  }
  
  const handleCancel = () => {
    setSelectedBid(null);
    setViewBids(false);
  }
  
  return (
    <>
      <h1 className='text-success'>Bids List</h1>
      <div className="d-block d-md-flex gap-4 justify-items-between align-items-center">
        <button className='btn my-3 btn-success' type='button' onClick={() => navigate('/Order-requirements-details')}>Create Job</button>
        <button className='btn btn-success' type='button' onClick={() => navigate('/Create-order')}>Download List</button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : error ? (
        message.error(error)
      ) : (
        <div className="mt-4">
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Order ID</th>
                <th scope="col">Topic</th>
                <th scope="col">Deadline</th>
                <th scope="col">Cost Per Page</th>
                <th scope="col">Status</th>
                <th scope="col">Bid Count</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.orderId}</td>
                    <td>{order.topic}</td>
                    <td>{new Date(order.deadline).toLocaleDateString()}</td>
                    <td>{order.costPerPage}</td>
                    <td>{order.status}</td>
                    <td>{order.bidCount}</td> {/* Display the bid count here */}
                    <td>
                      <div className="d-flex justify-content-space-around align-items-center gap-3">
                        <Tooltip title="View">
                          <EyeOutlined className='fs-5 text-primary' onClick={() => handleViewBids(order)} style={{ marginRight: '8px' }} />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <DeleteFilled className='fs-5 text-danger' />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No bids found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <ViewBidModal visible={viewBids} onCancel={handleCancel} selectedBid={selectedBid} />
        </div>
      )}
    </>
  );
};

export default BidsList;
