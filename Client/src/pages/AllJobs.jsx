import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Skeleton, message } from 'antd';
import Table from '../components/Table';
import EditJob from '../components/EditJob';

const AllJobs = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editJobDetails, setEditJobDetails] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'No. of Pages',
      dataIndex: 'pages',
      key: 'pages',
    },
    {
      title: 'Cost Per Page',
      dataIndex: 'costPerPage',
      key: 'costPerPage',
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      key: 'totalCost',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      // Simulating a delay for demonstration purposes
      setTimeout(async () => {
        // Make API call to fetch job orders
<<<<<<< HEAD
        const response = await fetch('http://localhost:3001/orders/get-orders',
          { method: 'GET' },
          { headers: { 'Content-Type': 'application/json' }},
          { body: JSON.stringify({}) },
          { credentials: 'include' }

        ); // Update the endpoint URL
=======
        const response = await fetch('https://crowwriter-api.vercel.app/orders/get-orders'); // Update the endpoint URL
>>>>>>> de942fab001e6f9e68adfa7b45fb46bcaa1f92d3
        if (!response.ok) {
          throw new Error('Failed to fetch job orders');
        }
        const data = await response.json();
        setRows(data.orders);
        setLoading(false); // Set loading to false after data is fetched
      }, 2000); // Simulated delay of 2 seconds
    } catch (error) {
      console.error('Error fetching job orders:', error.message);
      // Handle error
    }
  };
  const deleteJob = async (id) => {
    try {
      // Make API call to delete job
      const deleteResponse = await fetch(`https://crowwriter-api.vercel.app/orders/delete-order/${id}`, {
        method: 'DELETE',
      });
  
      if (!deleteResponse.ok) {
        throw new Error('Failed to delete job');
      }
  
      // If deletion is successful, remove the deleted job from the rows state
      setRows((prevRows) => prevRows.filter((job) => job.id !== id));
      message.success(`Job ${id} deleted successfully`);
      console.log(`Job ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting job:', error.message);
      // Handle error
    }
  };
  const editJob = (job) => {
    setModal(true);
    // Set the job details in the EditJob component
    setEditJobDetails(job);
  };
  

  const changeStatus = (id, newStatus) => {
    // Implement status change logic
    console.log(`Changing status of job ${id} to ${newStatus}`);
  };

  return (
    <>
      <h1 className='text-success'>Listed Jobs</h1>
      <div className="d-block d-md-flex gap-4 justify-content-between align-items-center">
        <Link className='btn my-3 btn-success' type='button' onClick={() => navigate('/Order-requirements-details')}>Create Job</Link>
        {/* <button className='btn btn-success' type='button' onClick={() => navigate('/Create-order')}>Download List</button> */}
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          columns={columns}
          rows={rows}
          deleteRow={deleteJob}
          editRow={editJob}
          changeStatus={changeStatus}
        />
      )}
{modal && <EditJob job={editJobDetails} setOpenModal={setModal} handleSubmit={fetchData} />}
    </>
  );
};

export default AllJobs;
