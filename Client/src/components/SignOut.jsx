import React from 'react';
import { Avatar, Dropdown, Menu, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook

const Signout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Use the useAuth hook to extract user information
    const userInfo = useAuth();
    const username = userInfo ? userInfo.UserInfo.username : null;

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
            switch (userInfo.UserInfo.roles) {
                case 'admin':
                    navigate('/admin/my-profile');
                    break;

                case 'manager':
                    navigate('/manager/my-profile');
                    break;

                case 'writer':
                    navigate('/dashboard/my-profile');
                    break;

                default:
                    break;
            }

        }
    };

    // Define menu items
    const menuItems = [
        { key: 'viewprofile', icon: <ProfileOutlined />, text: 'View Profile' },
        { key: '/signout', icon: <LogoutOutlined />, text: 'Sign Out', danger: true }
    ];

    const menu = (
        <Menu onClick={handleMenuClick}>
            {menuItems.map(item => (
                <Menu.Item key={item.key} icon={item.icon} danger={item.danger}>
                    {item.text}
                </Menu.Item>
            ))}
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
