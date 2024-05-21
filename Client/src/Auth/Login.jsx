import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions';
import { LoadingOutlined } from '@ant-design/icons';
import jwtDecode from 'jwt-decode';
import RegisterImage from '../assets/RegisterImage.jpg';

const Login = () => {
    const userRef = useRef();
    const [email, setEmail] = useState('test@email.com');
    const [password, setPassword] = useState('test1453');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    let decoded = null;
    if (userInfo && typeof userInfo.accessToken === 'string') {
        decoded = jwtDecode(userInfo.accessToken);
    }

    useEffect(() => {
        if (decoded) {
            switch (decoded.UserInfo.roles) {
                case 'writer':
                    navigate('/dashboard');
                    break;
                case 'manager':
                    navigate('/manager');
                    break;
                case 'admin':
                    navigate('/admin');
                    break;
                default:
                    // Handle unknown roles here
                    break;
            }
        }
    }, [decoded, navigate]);

    const handleLogin = (e) => {
        dispatch(login(email, password));
    };

    return (
        <Card className='form-container mt-5'>
            <div style={{ display: 'flex', gap: 'large', alignItems: 'center' }}>
                {/* Image */}
                <div style={{ flex: 1, display: 'none', md: 'block' }}>
                    <img src={RegisterImage} className='auth-image' alt="Register" />
                </div>
                {/* Form */}
                <div style={{ flex: 1 }}>
                    <Typography.Title level={3} strong className='title'> Sign In</Typography.Title>
                    <Typography.Text type='secondary' strong className='slogan'>Our service to Humanity</Typography.Text>
                    {error && <Alert message={error} type="error" />}
                    <Form
                        layout='vertical'
                        onFinish={handleLogin}
                        autoComplete='off'
                    >
                        <Form.Item
                            label='Email'
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your Email!' },
                                { type: 'email', message: 'The input is not a valid Email' }
                            ]}
                        >
                            <Input
                                size='large'
                                ref={userRef}
                                placeholder='Enter your Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            label='Password'
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password
                                size='large'
                                placeholder='Enter your Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete='off'
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                size='large'
                                className='btn'
                                disabled={loading}
                            >
                                {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : 'Sign In'}
                            </Button>
                        </Form.Item>
                        <div className="d-flex justify-content-between">
                            <Form.Item>
                                <Link to='/register'>
                                    Register Account.
                                </Link>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </Card>
    );
};

export default Login;
