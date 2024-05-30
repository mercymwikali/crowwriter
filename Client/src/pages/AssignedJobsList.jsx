import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignedOrderList } from '../actions/orderActions';
import { Skeleton, Typography, message, Button, Space, Table, Input, Select, Tag, Row, Col } from 'antd';
import { deleteAssignedOrder } from '../actions/assigningActions';

const { Search } = Input;
const { Option } = Select;

const AssignedJobsList = () => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('order');

    const assignedOrders = useSelector((state) => state.assignedOrdersList);
    const { loading, error, orders } = assignedOrders;

    useEffect(() => {
        dispatch(assignedOrderList());
    }, [dispatch]);

    const handleDelete = () => {
        dispatch(deleteAssignedOrder());
        message.success('Assigned orders deleted successfully');
    };

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const filteredOrders = orders ? orders.filter(order => {
        if (searchType === 'order') {
            return order.order.orderId.toLowerCase().includes(searchText) ||
                   order.order.topic.toLowerCase().includes(searchText) ||
                   order.order.status.toLowerCase().includes(searchText);
        } else if (searchType === 'writer') {
            return order.user.username.toLowerCase().includes(searchText) ||
                   order.user.email.toLowerCase().includes(searchText);
        }
        return false;
    }) : [];

    const renderStatusButton = (status) => {
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
        { title: 'OrderId', dataIndex: ['order', 'orderId'], key: 'orderId' },
        { title: 'Topic', dataIndex: ['order', 'topic'], key: 'topic' },
        { title: 'Full Amount(ksh)', dataIndex: ['order', 'fullAmount'], key: 'fullAmount' },
        { title: 'Username', dataIndex: ['user', 'username'], key: 'username' },
        { title: 'Email', dataIndex: ['user', 'email'], key: 'email' },
        { title: 'Status', dataIndex: ['order', 'status'], key: 'status', render: renderStatusButton },
    ];

    return (
        <>
            <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col xs={24} md={12}>
                    <Typography.Title level={3}>Hired Writers</Typography.Title>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                    <Button type="primary" danger onClick={handleDelete}>
                        Delete Assigned Orders
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={8}>
                    <Select defaultValue="order" onChange={setSearchType} style={{ width: '100%' }}>
                        <Option value="order">Order</Option>
                        <Option value="writer">Writer</Option>
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
                    <Col span={24}>
                        {message.error(error)}
                    </Col>
                </Row>
            ) : orders ? (
                <Table 
                    columns={columns} 
                    dataSource={filteredOrders} 
                    rowKey={(record) => record.id} 
                    pagination={{ pageSize: 10 }} 
                />
            ) : (
                <Row>
                    <Col span={24}>
                        <Typography.Text>No orders found</Typography.Text>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default AssignedJobsList;
