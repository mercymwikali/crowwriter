import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../actions/orderActions';
import { Skeleton, Button, Tooltip, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import JobViewModal from '../components/viewJob';
import BidJobModal from '../components/BidJob';
import { EyeFilled } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const JobsPool = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [bidJob, setBidJob] = useState(null);
  const [viewBidModal, setViewBidModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const listedJobs = useSelector((state) => state.ordersList);
  const { loading, error, orders, success } = listedJobs;

  const bidJobState = useSelector((state) => state.bidJob);
  const { success: bidSuccess } = bidJobState;

  const disciplines = [
    { value: 'English', label: 'English' },
    { value: 'Math', label: 'Math' },
    { value: 'Social Works', label: 'Social Works' },
    { value: 'History', label: 'History' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Art', label: 'Art' },
    { value: 'Business & Management', label: 'Business & Management' },
    { value: 'Nursing', label: 'Nursing' },
  ];

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate('/dashboard/writer-bids-list');
    }
  }, [success, navigate]);

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

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleCategoryFilter = (value) => {
    setFilterCategory(value);
  };

  const handleSortOrder = (value) => {
    setSortOrder(value);
  };

  const filteredOrders = orders && orders.filter((order) =>
    (order.orderId.includes(searchText) || order.topic.toLowerCase().includes(searchText.toLowerCase())) &&
    (filterCategory ? order.discipline === filterCategory : true)
  ).sort((a, b) => {
    if (sortOrder === 'amountAsc') {
      return a.fullAmount - b.fullAmount;
    }
    if (sortOrder === 'amountDesc') {
      return b.fullAmount - a.fullAmount;
    }
    return 0;
  });

  return (
    <>
      <h1 style={{ textAlign: 'start', marginBottom:'12px'}}>Available Jobs</h1>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <Search
              placeholder="Search by Order ID or Topic"
              onSearch={handleSearch}
              style={{ width: 200 }}
              enterButton
            />
            <Select
              placeholder="Filter by Category"
              onChange={handleCategoryFilter}
              style={{ width: 200 }}
              allowClear
            >
              {disciplines.map((discipline) => (
                <Option key={discipline.value} value={discipline.value}>{discipline.label}</Option>
              ))}
            </Select>
            <Select
              placeholder="Sort by Amount"
              onChange={handleSortOrder}
              style={{ width: 200 }}
              allowClear
            >
              <Option value="amountAsc">Amount (Low to High)</Option>
              <Option value="amountDesc">Amount (High to Low)</Option>
            </Select>
          </div>
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>OrderId</th>
                <th scope='col'>Topic</th>
                <th scope='col'>Category</th>
                <th scope='col'>No of Pages</th>
                <th scope='col'>Full Amount</th>
                <th scope='col'>Due In</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.orderId}</td>
                    <td>{order.topic}</td>
                    <td>{order.discipline}</td>
                    <td>{order.noOfPages}</td>
                    <td>{order.fullAmount}</td>
                    <td>{order.remainingTime}</td>
                    <td>
                      <div className="d-flex gap-3">
                        <Tooltip title="View Details">
                          <Button className="view-job-btn" onClick={() => handleViewJob(order)}>
                            <EyeFilled /> view
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
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No jobs listed</td>
                </tr>
              )}
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
