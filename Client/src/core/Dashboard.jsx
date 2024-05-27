import React, { useState } from 'react';
import { CreditCardOutlined, DotChartOutlined, MenuFoldOutlined, NotificationFilled, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { FaBriefcase, FaCheckCircle, FaClock, FaRegFolderOpen } from "react-icons/fa";
import { IoNotificationsCircleOutline, IoSendSharp } from "react-icons/io5";
import { RiFolderWarningLine } from "react-icons/ri";
import { BsCashCoin, BsList } from "react-icons/bs";
import Signout from '../components/SignOut';
import { Outlet, useNavigate } from 'react-router-dom';
import { GiReceiveMoney } from 'react-icons/gi';
import NotificationBtn from '../components/Notifications'
const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(['/']);
  const navigate = useNavigate();

  const rootSubmenuKeys = [
    '/',
    '/My-Jobs',
    '/My-Wallet',
    '/My Profile',
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
    navigate(`/dashboard/${key}`);
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
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/jobs-pool']}
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
              icon: <FaBriefcase />,
              label: 'Jobs Pools',
            },
            {
              key: '/My-Jobs',
              icon: <DotChartOutlined />,
              label: 'My Jobs',
              children: [
                {
                  key: 'writer-bids-list',
                  icon: <BsList />,
                  label: 'Bid List',
                },
                {
                  key: 'jobs-onprogress',
                  icon: <FaRegFolderOpen />,
                  label: 'On Progress',
                },
                {
                  key: 'Submitted-jobs',
                  icon: <IoSendSharp />,
                  label: 'Submitted Jobs',
                },
                {
                  key: 'rejected',
                  icon: <RiFolderWarningLine />,
                  label: 'Rejected',
                }
              ]
            },
            {

              key: 'my-fines',
              icon: <NotificationFilled />,
              label: 'My Fines',
            },
            {
              key: '/My-Wallet',
              icon: <CreditCardOutlined />,
              label: 'My Wallet',
              children: [
                {
                  key: 'Invoice',
                  icon: <GiReceiveMoney style={{ fontSize: '20px' }} />,
                  label: 'Invoice',
                },
                {
                  key: 'paid-transactions',
                  icon: <BsCashCoin className='text-red' />,
                  label: 'Paid Transactions',
                },
                {
                  key: 'pending-payments',
                  icon: <FaClock className='text-red' />,
                  label: 'Pending Payments',
                },
              ]
            },
            {
              key: 'my-profile',
              icon: <UserOutlined />,
              label: 'My Profile',
            },
          ]}
        />
      </Sider>
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
              icon={collapsed ? <MenuFoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '22px',
                width: 64,
                height: 64,
                color: '#fff'
              }}
            />
          </div>
          <div className="d-flex">
            <NotificationBtn />
            <Signout className='d-none d-sm-block cursor-pointer' />
          </div>
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
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Crowwriters.com © {new Date().getFullYear()} Created by MayfairDev
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
