import React, { useEffect } from 'react';
import { Avatar, Dropdown, Menu, Typography, Spin, Alert } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {login, logout } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';

const Signout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails

    useEffect(() => {
        if (error) {
            // Handle error here, such as displaying error message
            console.error('Error:', error);
        }
    }, [error]);

    const handleMenuClick = async (e) => {
        if (e.key === '/signout') {
            try {
                // Dispatch the logout action
                await dispatch(logout());
                // Redirect to login page after successful logout
                navigate('/login');
            } catch (error) {
                // Handle logout error here, such as displaying error message
                console.error('Logout Error:', error);
            }
        } else if (e.key === 'viewprofile') {
            console.log('User clicked View Profile');
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="viewprofile" icon={<ProfileOutlined />}>
                View Profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="/signout" icon={<LogoutOutlined />} danger>
                Sign Out
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} placement="bottomRight">
            <div>
                <Avatar size={50} icon={<UserOutlined />} />
                <Typography.Text>{user?.username}</Typography.Text>
                {loading && <Spin />}
                {error && <Alert message={error} type="error" />}
            </div>
        </Dropdown>
    );
};

export default Signout;
