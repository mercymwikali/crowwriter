import { UserOutlined, WalletOutlined } from '@ant-design/icons'
import { Avatar, Card, Space, Tabs, Typography, Input } from 'antd'
import React from 'react'

const Profile = () => {
    return (
        <div>
            <Typography.Title level={2}>Profile</Typography.Title>
            <Card className='mb-3'>
                <Space direction="vertical">
                    <Avatar icon={<UserOutlined />} size={100} />
                    <Space direction="" size={20} align="center">
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Profile" key="1">
                                <Space direction="horizontal">
                                    <Typography.Text>Full Name:</Typography.Text>
                                    <Input placeholder="Mary Jane" color='primary' readOnly bordered={false} />
                                    <Typography.Text>Email:</Typography.Text>
                                    <Input placeholder="Enter your email" readOnly bordered={false} />
                                </Space>
                              
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Bio" key="2">
                            <Space direction="vertical">
                                    <Typography.Text>Bio:</Typography.Text>
                                    <Input.TextArea placeholder="Enter your bio" className='w-100' readOnly bordered={false} />
                                </Space>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="E-Wallet" key="3">
                                <Space direction="vertical">
                                    <Typography.Title level={5}>Balance</Typography.Title>
                                    <Typography.Text>Transaction History</Typography.Text>
                                </Space>
                            </Tabs.TabPane>
                        </Tabs>
                    </Space>
                </Space>
            </Card>
        </div>
    )
}

export default Profile
