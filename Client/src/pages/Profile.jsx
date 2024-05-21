import { UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Space, Typography } from 'antd'
import React from 'react'

const Profile = () => {
    return (
        <div>
            <Typography.Title level={2}>Profile</Typography.Title>
            <Card>
                <Space>
                    <Avatar icon={<UserOutlined />} size={100} />
                    <div className="div">
                        <Typography.Title level={5}>Username</Typography.Title>
                        <Typography.Text>Email</Typography.Text>
                    </div>
                </Space>
            </Card>
            <Typography.Title level={3} style={{ marginTop: '20px' }}>E-Wallet</Typography.Title>
            <Card style={{ width: '400px', marginTop: '20px', backgroundColor: 'grey', color: 'white' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Your E-Wallet</h1>
                    <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Available Balance: $5000</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ marginBottom: '5px' }}>Card Number</p>
                            <h3 style={{ marginBottom: '20px' }}>**** **** **** 1234</h3>
                            <p style={{ marginBottom: '5px' }}>Expiry Date</p>
                            <h3 style={{ marginBottom: '20px' }}>09/24</h3>
                        </div>
                        <div>
                            <p style={{ marginBottom: '5px' }}>Card Holder</p>
                            <h3 style={{ marginBottom: '20px' }}>John Doe</h3>
                            <p style={{ marginBottom: '5px' }}>CVV</p>
                            <h3 style={{ marginBottom: '20px' }}>123</h3>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Profile
