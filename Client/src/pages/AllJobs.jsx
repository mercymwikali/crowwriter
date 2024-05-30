import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton, Tooltip, message, Button, Modal, Pagination, Input, Select, Space, Row, Col, Table, Typography, Tag } from 'antd';
import { DeleteOutlined, EditFilled, TagsOutlined } from '@ant-design/icons';
import { listOrders } from '../actions/orderActions';
import moment from 'moment';
import AssignWriter from '../components/AssignButton';
import EditJob from '../components/EditJob';

const { Search } = Input;
const { Option } = Select;

const Allorders = () => {
  const dispatch = useDispatch();

  const ordersList = useSelector(state => state.ordersList);
  const { loading, error, orders } = ordersList;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [writerId, setWriterId] = useState('');
  const [assignOrderModal, setAssignOrderModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('orderId');
  const pageSize = 25;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const deleteOrder = async (id) => {
    try {
      const deleteResponse = await fetch(`https://crowwriter-api.vercel.app/orders/delete-order/${id}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete order');
      }

      dispatch(listOrders());
      message.success(`Order ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting order:', error.message);
      message.error('Failed to delete order');
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditModalVisible(true);
  };

  const assignOrder = (order) => {
    setSelectedOrder(order);
    setAssignOrderModal(true);
  };

  const handleCancel = () => {
    setSelectedOrder(null);
    setEditModalVisible(false);
    setAssignOrderModal(false);
  };

  const handleEditSubmit = () => {
    dispatch(updateOrder(selectedOrder.id, selectedOrder));
    setEditModalVisible(false);
  };

  const handleAssignOrder = async () => {
    dispatch(assignOrder(selectedOrder.id, writerId));
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredOrders = orders ? orders.filter(order => {
    switch (searchType) {
      case 'orderId':
        return order.orderId.toLowerCase().includes(searchText);
      case 'topic':
        return order.topic.toLowerCase().includes(searchText);
      default:
        return false;
    }
  }) : [];

  const renderStatusTag = (status) => {
    let color;
    switch (status.toLowerCase()) {
      case 'assigned':
        color = 'blue';
        break;
      case 'completed':
        color = 'green';
        break;
      case 'pending':
        color = 'orange';
        break;
      case 'cancelled':
        color = 'red';
        break;
      default:
        color = 'default';
        break;
    }
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const columns = [
    { title: '#', dataIndex: 'index', key: 'index', render: (_, __, index) => index + 1 },
    { title: 'OrderId', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Topic', dataIndex: 'topic', key: 'topic' },
    { title: 'No of Pages', dataIndex: 'noOfPages', key: 'noOfPages' },
    { title: 'Full Amount', dataIndex: 'fullAmount', key: 'fullAmount' },
    { title: 'Due In', dataIndex: 'remainingTime', key: 'remainingTime' },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => moment(deadline).format('DD/MM/YYYY'),
    },

    { title: 'Status', dataIndex: 'status', key: 'status', render: renderStatusTag },
    {
      title: 'Actions', key: 'actions', render: (text, order) => (
        <Space size="middle">
          <Tooltip title="Update Order">
            <Button type="primary" icon={<EditFilled />} onClick={() => handleEdit(order)} />
          </Tooltip>
          <Tooltip title="Hire Writer">
            <Button type="primary" icon={<TagsOutlined style={{ color: 'blue', fontSize: '18px' }} />} onClick={() => assignOrder(order)} ghost />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="primary" icon={<DeleteOutlined />} onClick={() => deleteOrder(order.id)} danger />
          </Tooltip>
        </Space>
      )
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredOrders.length);

  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col xs={24} md={12}>
          <Typography.Title level={3}>My Orders</Typography.Title>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Link className='btn btn-success' to={'/manager/'} type='button'>Create New Order</Link>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Select defaultValue="orderId" onChange={setSearchType} style={{ width: '100%' }}>
            <Option value="orderId">Order ID</Option>
            <Option value="topic">Topic</Option>
          </Select>
        </Col>
        <Col xs={24} md={16}>
          <Search
            placeholder={`Search by ${searchType}`}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
      {loading ? (
        <Skeleton active />
      ) : error ? (
        <Row>
          <Col span={24}>{message.error(error)}</Col>
        </Row>
      ) : filteredOrders && filteredOrders.length === 0 ? (
        <Row>
          <Col span={24}><Typography.Text>No orders found</Typography.Text></Col>
        </Row>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredOrders.slice(startIndex, endIndex)}
          rowKey={(record) => record.id}
          pagination={false}
        />
      )}
      <Pagination
        current={currentPage}
        total={filteredOrders ? filteredOrders.length : 0}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
      />

      <Modal
        title="Edit order"
        visible={editModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        maskClosable
        width={800}
        onOk={handleEditSubmit}
        okText="Update"
        cancelText="Cancel"
        centered
        style={{ top: 20, maxHeight: '90vh', overflow: 'auto' }}
      >
        {selectedOrder && (
          <EditJob job={selectedOrder} setOpenModal={setEditModalVisible} handleSubmit={handleEditSubmit} />
        )}
      </Modal>
      <AssignWriter
        selectedorder={selectedOrder}
        onCancel={handleCancel}
        visible={assignOrderModal}
        handleAssignOrder={handleAssignOrder}
        setWriterId={setWriterId}
      />
    </>
  );
};

export default Allorders;
