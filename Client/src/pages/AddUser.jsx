import React, { useState } from 'react';
import { Card, Form, Typography, Input, Select, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddUser = () => {
    const dispatch = useDispatch();
    const userCreate = useSelector((state) => state.userCreate);
    const { loading, success, error } = userCreate;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        active: true, // Default value for active
    });

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleAddUser = () => {
        dispatch(
            createUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                active: formData.active,
            })
        );

        // Reset form fields after successful user creation
        setFormData({
            username: '',
            email: '',
            password: '',
            role: '',
            active: true, // Default value for active
        });
    };

    // Display loading message while submitting
    if (loading) {
        message.loading({ content: 'Creating user...', key: 'loading' });

    } else {
        // Close loading message if not loading
        message.destroy('loading');
    }

    // Display success message if user creation was successful
    if (success) {
        message.success({ content: 'User created successfully', key: 'success' });
    }

    // Display error message if there was an error during user creation
    if (error) {
        message.error({ content: error, key: 'error' });
    }

    return (
        <>
            <Typography.Title level={2} className='text-center text-success'>Add User</Typography.Title>

            <Card>
                <Form>
                    <div className='mb-2'>
                        <label htmlFor="username" className='py-2'>Username:</label>
                        <Input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="email" className='py-2'>Email:</label>
                        <Input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="password" className='py-2'>Password:</label>
                        <Input
                            type="password"
                            id="password"
                            value={formData.password}
                            autoComplete='off'
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="role" className='py-2'>Role:</label>
                        <Input
                            type="text"
                            id="role"
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="active" className='py-2'>Active:</label>
                        <Select
                            id="active"
                            className=' col-12'
                            value={formData.active.toString()}
                            onChange={(value) => handleChange('active', value === 'true')}
                        >
                            <Option value="true">Active</Option>
                            <Option value="false">Inactive</Option>
                        </Select>
                    </div>
                    <Button type="primary" className='w-full mt-4' onClick={handleAddUser}>Add User</Button>
                </Form>
            </Card>
        </>
    );
};

export default AddUser;
