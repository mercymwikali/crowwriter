import React from 'react';
import { Avatar, Dropdown, Menu,Typography ,Flex} from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signout = () => {
    const { userData, logout } = useAuth();
const navigate=useNavigate();
    const handleMenuClick = async (e) => {
        if (e.key === 'signout') {
            // await logout(); // Call the logout function directly
navigate('/login');

        } else if (e.key === 'viewprofile') {
            // Handle view profile action
            console.log('User clicked View Profile');
        }
    };

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
                <Typography.Title level={4} style={{color:'#fff', padding:8}}>Kevin</Typography.Title>

            </Flex>

        </Dropdown>
    );
};

export default Signout;
