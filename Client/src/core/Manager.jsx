import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { CreditCardOutlined,  EditTwoTone, HourglassOutlined,  MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, VideoCameraOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { FaBriefcase, FaCheckCircle, FaClock, FaFileArchive, FaRegFolderOpen, FaUsers } from "react-icons/fa";
import { GiCancel, GiProgression } from "react-icons/gi";
import { RiFolderWarningLine } from "react-icons/ri";
import {  MdOutlineCancelPresentation } from "react-icons/md";
import { Bs0SquareFill, BsCashCoin, BsDashCircleFill } from "react-icons/bs";
import Signout from '../components/SignOut';


const { Header, Content, Footer, Sider } = Layout;

const Manager = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState(['/']);
    const navigate = useNavigate();

    const rootSubmenuKeys = [
        '/',
        '/Manage-Jobs',
        '/Payments',
        '/Manage Writers',
        '/Fines'

    ];

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
            setCollapsed(true)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    }

    
const handleMenuClick = (key) => {
    navigate(`/manager/${key}`);
  };
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <Sider
                breakpoint="md"
                collapsedWidth={collapsed ? 80 : 250}
                trigger={null}
                inlinecollapsed={collapsed}
                collapsible collapsed={collapsed}
                className='sidemenu'
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                {/* <h1 className='logo'>Wekc</h1> */}
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/Order-requirements-details']}
                    defaultOpenKeys={['/Order-requirements-details']}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    onClick={({ key }) => handleMenuClick(key)}
                    style={{
                        backgroundColor: 'transparent',
                        height: '100%',
                        color: '#fff',
                        paddingTop: '70px',
                        paddingBottom: '90px',
                        overflowY: 'scroll',
                        transition: '0.2s ease',
                    }}
                    items={[
                        {
                            key: '/',
                            icon: <EditTwoTone />,
                            label: 'Create New Order',
                        },
                        {
                            key: '/Manage-Jobs',
                            icon: <FaBriefcase />,
                            label: 'Manage Jobs',
                            children: [
                                {
                                    key: 'All-Jobs',
                                    icon: <GiProgression />,
                                    label: 'All Jobs',
                                },
                                {
                                    key: 'Bids-List',
                                    icon: <FaCheckCircle />,
                                    label: 'Bids List',
                                },
                                {
                                    key: 'Assigned-Jobs',
                                    icon: <HourglassOutlined />,
                                    label: 'Assigned Jobs',
                                },
                                {
                                    key: 'Submitted-Jobs',
                                    icon: <FaFileArchive />,
                                    label: 'Submitted Jobs',
                                },
                                {
                                    key: 'Cancelled-Jobs',
                                    icon: <MdOutlineCancelPresentation />,
                                    label: 'Cancelled Jobs',
                                },

                            ]
                        },
                        {
                            key: '/Payments',
                            icon: <CreditCardOutlined />,
                            label: 'Payments',
                            children: [
                                {
                                    key: 'Paid-Orders',
                                    icon: <BsCashCoin />,
                                    label: 'Paid Orders',
                                },
                                {
                                    key: 'Unpaid-Orders',
                                    icon: <BsDashCircleFill />,
                                    label: 'Unpaid Orders',
                                },
                               
                            ]
                        },
                        {
                            key: '/Fines',
                            icon: <RiFolderWarningLine />,
                            label: 'Fined Orders',
                            children: [
                                {

                                    key: 'New-Fine',
                                    icon: <FaClock />,
                                    label: 'New Fine',

                                },
                                {
                                    key: 'Fined-Orders',
                                    icon: <FaCheckCircle />,
                                    label: 'Fined Orders',
                                },

                            ]
                        },
                        {
                            key: '/Manage Writers',
                            icon: <FaUsers size={20} />,
                            label: 'Manage Writers',
                            children: [
                                {
                                    key: 'add-users',
                                    icon: <UserAddOutlined size={20} />,
                                    label: 'New Writer',
                                },
                                {
                                    key: 'writers-list',
                                    icon: <FaUsers size={20} />,
                                    label: 'All Writers',
                                },
                                {
                                    key: 'Pending-Writers',
                                    icon: <Bs0SquareFill />,
                                    label: 'Pending Writers',
                                },
                                // {
                                //     key: 'Rejected Writers',
                                //     icon: <GiCancel />,
                                //     label: 'Rejected Writers',
                                // },
                                
                            ]
                            
                        },
                        {
                            key: 'my-profile',
                            icon: <UserOutlined />,
                            label: 'My Profile',
                          }
                    ]}
                />      </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 18,
                        backgroundColor: '#002329',
                        zIndex: 1
                    }}
                    className='header'>
                    <div>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuUnfoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '22px',
                                width: 64,
                                height: 64,
                                color: '#fff'
                            }}
                        // className='d-sm-none d-md-block'
                        />
                    </div>

                    <Signout className='d-none d-sm-block cursor-pointer' />
                </Header>
                <Content
                    className='contentStyle'
                    style={{
                        marginLeft: collapsed ? 80 : 230,
                        transition: 'all 0.2s',
                        marginTop: '20px',
                        padding: 14,
                        background: colorBgContainer,

                    }}>

                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                {/* <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer> */}
            </Layout>
        </Layout>
    );
};
export default Manager;