import { EditFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Space, Tabs, Typography, Table, Flex, Form, Input, Switch, Skeleton, Button, Tooltip, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../actions/profile';
import useAuth from '../hooks/useAuth';
import { MdEmail, MdPassword } from 'react-icons/md';
import { RiLeafLine } from 'react-icons/ri';
import EditProfile from '../components/EditProfile';

const Profile = () => {
    const dispatch = useDispatch();
    const { loading, success, error, user } = useSelector((state) => state.userProfile);

    const userInfo = useAuth();
    const userId = userInfo.UserInfo.id;
    console.log(userId);

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (userId) {
            dispatch(getProfile(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role,
                active: user.active,
                bio: user.profile?.bio || 'N/A'
            });
        }
    }, [user, form]);

    if (loading) return <Skeleton active  />;
    if (error) return <div>Error: {error}</div>;

    const profileData = user || {
        username: 'N/A',
        email: 'N/A',
        role: 'N/A',
        active: 'N/A',
        profile: {
            bio: 'N/A',
            wallet: 0
        }
    };

    const walletData = profileData.profile ? [
        { key: '1', title: 'Balance', value: `£${profileData.profile.wallet}` },
        { key: '2', title: 'Available Balance', value: '£0.00' },
        { key: '3', title: 'Withdrawal Limit', value: '£0.00' },
        { key: '4', title: 'Withdrawal Fee', value: '£0.00' },
        { key: '5', title: 'Withdrawal Status', value: 'Active' }
    ] : [];

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title', align: 'left' },
        { title: 'Value', dataIndex: 'value', key: 'value' }
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Typography.Title level={2}>Profile</Typography.Title>
            <div className='d-block d-md-flex  gap-3 ' >
                <Card className='mb-3 px-5  py-2'  align="center" style={{ borderRadius: '10px', height: '200px' }}>
                    <div >
                        <Avatar icon={<UserOutlined />} size={100} />
                       <div className="d-block">
                       <p>{profileData.email}</p>
                        <p className='text-muted'>{profileData.role}</p>
                       </div>
                    </div>
                </Card>
                <Card className=' w-100 w-md-50' >
                    <div className="d-flex align-items-center justify-content-end px-3">
                        <Button type='ghost' onClick={showModal}>
                            <Tooltip title="Edit Profile">
                                <EditFilled style={{ fontSize: '20px', color: 'green' }} />
                            </Tooltip>
                        </Button>
                    </div>
                    <Tabs defaultActiveKey="1" className='w-100 col-12 '>
                        <Tabs.TabPane tab="Profile" key="1">
                            <Form form={form} layout="vertical">
                                <Form.Item label="Username" name="username" className="w-100">
                                    <Input size="large" prefix={<UserOutlined />} placeholder="Enter your username" readOnly />
                                </Form.Item>

                                <Form.Item label="Email" name="email" className="w-100">
                                    <Input size="large" type="email" prefix={<MdEmail style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Enter your email" readOnly />
                                </Form.Item>

                                <Form.Item label="Role" name="role" className="w-100">
                                    <Input size="large" prefix={<RiLeafLine style={{ color: 'green', fontSize: '20px' }} />} placeholder="Enter your role" readOnly />
                                </Form.Item>

                                <Form.Item label="Active" name="active" valuePropName="checked" className="w-100">
                                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" disabled checked={profileData.active} style={{ backgroundColor: profileData.active ? 'green' : undefined }} />
                                </Form.Item>

                                <Form.Item label="Bio" name="bio" className="w-100">
                                    <Input.TextArea size="large" placeholder="Enter your bio" readOnly />
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Transactions" key="3">
                            <Typography.Title level={5}>E-Wallet</Typography.Title>
                            <Table dataSource={walletData} columns={columns} pagination={false} className='w-100' />
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </div>

            <Modal
                title="Edit Profile"
                visible={isModalVisible}
                onCancel={handleCancel}
                width={800}
                bodyStyle={{ padding: 0, height: '80vh', overflow: 'auto' }}
                footer={null}
            >
                <EditProfile user={user} />
            </Modal>
        </div>
    );
};

export default Profile;
