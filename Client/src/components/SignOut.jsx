import React, { useState } from 'react';
import { Avatar, Dropdown, Menu, Typography, Flex, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useSendLogoutMutation } from '../features/auth.js/authApiSlice';

const Signout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sendLogout, { isSuccess, isError, error }] = useSendLogoutMutation();

    const handleMenuClick = (e) => {
        if (e.key === 'signout') {
            setLoading(true);
            setTimeout(() => {
                sendLogout();
            }, 2000); // Simulate a delay of 2 seconds
        } else if (e.key === 'viewprofile') {
            // Handle view profile action
            console.log('User clicked View Profile');
        }
    };

    // Redirect to login page after successful logout
    if (isSuccess) {
        setTimeout(() => {
            navigate('/login');
        }, 2000); // Redirect after 2 seconds
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="viewprofile" icon={<ProfileOutlined />}>
                View Profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="signout" icon={<LogoutOutlined />} danger>
                Sign Out
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} placement="bottomRight">
            <Flex>
                <Avatar size={50} icon={<UserOutlined />} />
                <Typography.Title level={4} style={{ color: '#fff', padding: 8 }}>Kevin</Typography.Title>
                {loading && <Spin />}
            </Flex>
        </Dropdown>
    );
};

export default Signout;
