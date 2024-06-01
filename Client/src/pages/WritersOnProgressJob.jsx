import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myJobs } from '../actions/writersActions';
import useAuth from '../hooks/useAuth';
import { Button, Skeleton, Tooltip, Typography, message } from 'antd';
import { IoSendSharp } from 'react-icons/io5';
import SubmitOrder from '../components/SubmitOrder';
import { CloudDownloadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { downloadOrderAttachment } from '../actions/orderActions';

const WritersOnProgressJob = () => {
  const dispatch = useDispatch();
  const writer = useAuth();
  const writerId = writer ? writer.UserInfo.id : null;

  const myJobsState = useSelector((state) => state.myJobs);
  const { loading, error, orders } = myJobsState;

  const downloadDocument = useSelector(state => state.downloadAttachment);
  const { loading: docloading, error: docerror, document } = downloadDocument;


  const [submitOrderModal, setSubmitOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDownload = async (order) => {
    try {
      if (order && order.order.documentId) {
        await dispatch(downloadOrderAttachment(order.order.documentId));
      }
    } catch (error) {
      message.error('Failed to download attachment');
    }
  }


  useEffect(() => {
    if (writerId) {
      dispatch(myJobs(writerId));
    }
  }, [dispatch, writerId, submitOrderModal, selectedOrder]);

  const handleSubmitOrder = (order) => {
    setSelectedOrder(order);
    setSubmitOrderModal(true);

  }

  const handleCancel = () => {
    setSubmitOrderModal(false);
    setSelectedOrder(null);
  }

  return (
    <>
      <Typography.Title>My Jobs</Typography.Title>
      {loading ? (
        <Skeleton active />
      ) : error ? (
        <>{message.error(error)}</>
      ) : orders ? (
        <table className="table table-hover table-responsive">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">OrderId</th>
              <th scope="col">Topic</th>
              <th scope="col">Full Amount(ksh)</th>
              <th scope='col'>Due Date</th>
              <th scope="col">Status</th>
              <th scope='col' className='text-center'>Attachment</th>
              <th scope="col" className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.order.orderId}</td>
                <td>{order.order.topic}</td>
                <td>{order.order.fullAmount}</td>
                <td>{new Date(order.order.deadline).toLocaleDateString()}</td>
                <td>{order.order.status}</td>
                <td className='text-center'>
                  <Tooltip title="Download Attachment File">
                    <Button
                      type="primary"
                      onClick={() => handleDownload(order)}
                    >
                      <CloudDownloadOutlined style={{ marginRight: '5px', fontSize: '20px' }} />
                    </Button>
                  </Tooltip>
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      type="default"
                      style={{ marginRight: '10px', border: '1px solid #1890ff', color: '#1890ff' }}
                      icon={<IoSendSharp />}
                      onClick={() => handleSubmitOrder(order)} // Pass the order to handleSubmitOrder
                    >
                      Submit Order
                    </Button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <SubmitOrder visible={submitOrderModal} onCancel={handleCancel} selectedOrder={selectedOrder} />
    </>
  );
};

export default WritersOnProgressJob;
