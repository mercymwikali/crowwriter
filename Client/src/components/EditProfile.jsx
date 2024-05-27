import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { MdEmail } from 'react-icons/md';
import { RiLeafLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../actions/userActions';

const EditProfile = ({ user }) => {
    const dispatch = useDispatch()

    const {loading, success, error} = useSelector(state => state.userUpdate)


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values:', values);
        // Dispatch action to update profile here
        // dispatch(updateProfile(values));
        // dispatch(updateUser(values));
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role,
                active: user.active,
                bio: user.profile?.bio || ''
            }}
            onFinish={onFinish}
        >
            <Form.Item label="Username" name="username">
                <Input size="large" prefix={<UserOutlined />} placeholder="Enter your username" readOnly />
            </Form.Item>

            <Form.Item label="Email" name="email">
                <Input size="large" prefix={<MdEmail style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Enter your email" readOnly />
            </Form.Item>

            <Form.Item label="Password" name="password">
                <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>

            <Form.Item label="Confirm Password" name="confirmPassword">
                <Input.Password size="large" placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item label="Role" name="role">
                <Input size="large" prefix={<RiLeafLine style={{ color: 'green', fontSize: '20px' }} />} placeholder="Enter your role" readOnly />
            </Form.Item>

            <Form.Item label="Active" name="active" valuePropName="checked">
                <Switch
                    checkedChildren="Active"
                    // unCheckedChildren="Inactive" 
                    style={{ backgroundColor: form.getFieldValue('active') ? 'green' : undefined }}
                    defaultChecked
                    readOnly
                />
            </Form.Item>

            <Form.Item label="Bio" name="bio">
                <Input.TextArea size="large" placeholder="Enter your bio" readOnly />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Save Changes</Button>
            </Form.Item>
        </Form>
    );
};

export default EditProfile;
