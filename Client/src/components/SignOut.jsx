import React from 'react';
import { Avatar, Dropdown, Menu, Typography, Spin, Alert } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Signout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Extracting username from the decoded token
    let decodedToken = null;
    if (userInfo && typeof userInfo.accessToken === 'string') decodedToken = jwtDecode(userInfo.accessToken);
    const username = decodedToken.UserInfo.username;

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
            <div className='d-flex align-items-center gap-3 justify-content-center cursor-pointer'>
                <Avatar size={50} icon={<UserOutlined />} />
                <h6 style={{ color: 'white' }}>{username}</h6>
            </div>
        </Dropdown>
    );
};

export default Signout;
