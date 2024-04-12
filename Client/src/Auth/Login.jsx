import React from 'react'
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import RegisterImage from '../assets/RegisterImage.jpg';
import useLogin from '../hooks/useLogin';

export const Login = () => {
    const { loading, error, loginUser } = useLogin();

const navigate=useNavigate();
    const handleLogin =async (values) => {
      navigate('/manager-dashboard/Order-requirements-details');
    }
    return (
        <Card className='form-container mt-5'>
            <Flex gap="large" align='center'>
                {/* image */}
                <Flex flex={1} className='d-none d-md-block'>
                    <img src={RegisterImage} className='auth-image' />
                </Flex>
                {/* form */}
                <Flex vertical flex={1}>
                    <Typography.Title level={3} strong className='title'> Sign In</Typography.Title>
                    <Typography.Text type='secondary' strong className='slogan'>Our service to Humanity</Typography.Text>
                    <Form
                        layout='vertical'
                        onFinish={handleLogin}
                        autoComplete='off'
                    >
                        <Form.Item label='Email' name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!',
                                },
                                {
                                    type: 'email',
                                    message: 'The input is not valid Email'
                                }
                            ]}>
                            <Input size='large' placeholder='Enter your Email'></Input>
                        </Form.Item>
                        <Form.Item label='Password' name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}>
                            <Input.Password size='large' placeholder='Enter your Password' />
                        </Form.Item>

                        {
                            error && (
                                <Alert
                                    description={error}
                                    type='error'
                                    showIcon
                                    closable
                                    className='alert' />
                            )
                        }
                        <Form.Item>
                            <Button
                                type={`${loading ? '' : 'primary'}`}
                                htmlType='submit'
                                size='large'
                                className='btn'>
                                {loading ? <Spin /> : 'Sign In'}
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Link to='/register'>
                              Register Account.
                            </Link>

                        </Form.Item>
                    </Form>
                </Flex>
            </Flex>
        </Card>
    )
}
