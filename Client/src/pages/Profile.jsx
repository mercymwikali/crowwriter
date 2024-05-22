import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Space, Tabs, Typography, Table, Flex, Form, Input } from 'antd';
import React from 'react';

const Profile = () => {
    // Dummy profile data
    const dummyProfileData = {
        id: '7e14ee40-0408-4a2c-8ed0-de1c20073cd0',
        username: 'James',
        email: 'james@email.com',
        role: 'writer',
        active: true,
        profile: {
            id: '1',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            wallet: 1000.00
        }
    };

    // E-Wallet data
    const walletData = [
        { key: '1', title: 'Balance', value: `£${dummyProfileData.profile.wallet}` },
        { key: '2', title: 'Available Balance', value: '£0.00' },
        { key: '3', title: 'Withdrawal Limit', value: '£0.00' },
        { key: '4', title: 'Withdrawal Fee', value: '£0.00' },
        { key: '5', title: 'Withdrawal Status', value: 'Active' }
    ];

    // Columns for the E-Wallet table
    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title', align: 'left' },
        { title: 'Value', dataIndex: 'value', key: 'value' }
    ];

    return (
        <div>
            <Typography.Title level={2}>Profile</Typography.Title>
           <Flex justify="space-between" gap={10}>
           <Card className='mb-3 w-25' >
                <Space direction="vertical" align="center">
                    <Avatar icon={<UserOutlined />} size={100} />
                    <Typography.Text>{dummyProfileData.email}</Typography.Text>
                    <Typography.Text type="secondary">{dummyProfileData.role}</Typography.Text>
                </Space>
            </Card>
            <Card className='col-8 w-75'>
                <Space direction="" size={20} align="center">
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Profile" key="1">
                            <Space direction="vertical" className='mb-3'>
                               <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]} initialValue={dummyProfileData.username}>
                                    <Input size="large" placeholder="Enter your username" readOnly />
                                </Form.Item>

                                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]} initialValue={dummyProfileData.email}>
                                    <Input size="large" placeholder="Enter your email" readOnly />
                                </Form.Item>

                                <Form.Item label="Role" name="role" className='col-12' rules={[{ required: true, message: 'Please select your role!' }]} initialValue={dummyProfileData.role}>
                                    <Input size="large" className='w-100' placeholder="Enter your role" readOnly />
                                </Form.Item>

                                <Form.Item label="Active" name="active" rules={[{ required: true, message: 'Please select your active status!' }]} initialValue={dummyProfileData.active}>
                                    <Input size="large" placeholder="Enter your active status" readOnly />
                                </Form.Item>

                                <Form.Item label="Bio" name="bio" rules={[{ required: true, message: 'Please input your bio!' }]} initialValue={dummyProfileData.profile.bio}>
                                    <Input.TextArea size="large" placeholder="Enter your bio" readOnly />
                                </Form.Item>
                            </Space>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Transactions" key="3">
                            <Typography.Title level={5}>E-Wallet</Typography.Title>
                            <Table dataSource={walletData} columns={columns} pagination={false} className='w-100' />
                        </Tabs.TabPane>
                    </Tabs>
                </Space>
            </Card>
            </Flex> 
        </div>

    );
};

export default Profile;
