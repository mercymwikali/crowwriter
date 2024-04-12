import { DeleteFilled, DollarCircleFilled, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BidsList = () => {
  const navigate = useNavigate();

  // Dummy data for jobs with bid details
  const jobsWithBids = [
    { 
      id: 1, 
      topic: 'Job 1', 
      pages: 5, 
      deadline: '2024-04-01', 
      costPerPage: 10, 
      status: 'Pending', 
      bids: [
        { id: 1, bidder: 'John Doe', amount: 50 },
        { id: 2, bidder: 'Jane Smith', amount: 45 },
      ] 
    },
    { 
      id: 2, 
      topic: 'Job 2', 
      pages: 10, 
      deadline: '2024-04-05', 
      costPerPage: 8, 
      status: 'In Progress', 
      bids: [
        { id: 3, bidder: 'Alice Johnson', amount: 55 },
      ] 
    },
    { 
      id: 3, 
      topic: 'Job 3', 
      pages: 8, 
      deadline: '2024-04-10', 
      costPerPage: 12, 
      status: 'Completed', 
      bids: [] 
    },
  ];

  // Function to change job status
  const changeStatus = (id, newStatus) => {
    // Implement your logic to update job status here
    console.log(`Changing status of job ${id} to ${newStatus}`);
  };

  return (
    <>
      <h1 className='text-success'>Bids List</h1>
      <div className=" d-block  d-md-flex gap-4 justify-items-between align-items-center">
        <button className='btn my-3 btn-success' type='button' onClick={() => navigate('/Order-requirements-details')}>Create Job</button>
        <button className='btn btn-success' type='button' onClick={() => navigate('/Create-order')}>Download List</button>
      </div>
      <div className="mt-4">
        <table className="table   table-hover table-responsive">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Topic</th>
              <th scope="col">No. of Pages</th>
              <th scope="col">Deadline</th>
              <th scope="col">Cost Per Page</th>
              <th scope="col">Status</th>
              <th scope="col">No. of Bids</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobsWithBids.map(job => (
              <tr key={job.id}>
                <th scope="row">{job.id}</th>
                <td>{job.topic}</td>
                <td>{job.pages}</td>
                <td>{job.deadline}</td>
                <td>${job.costPerPage}</td>
                <td>{job.status}</td>
                <td>
                  {job.bids.length > 0 ? (
                    <ul>
                      {job.bids.map(bid => (
                        <li key={bid.id}>{bid.bidder}: ${bid.amount}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>No bids</span>
                  )}
                </td>
                <div className="d-flex gap-3 align-items-center justify-content-center">
                  <Tooltip placement='bottom' title='View List'>
                    <button className='btn btn-primary' onClick={() => handleModal(job)}>
                      <EyeOutlined />
                      <span className='px-1'>View List</span>
                    </button>
                  </Tooltip>
                  <Tooltip placement='bottom' title='Delete Job'>
                    <button className='btn btn-danger'>
                      <DeleteFilled/>
                      <span className='px-1'>Delete Job</span>

                    </button>
                  </Tooltip>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BidsList;
