import React from 'react';
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import RegisterImage from '../assets/RegisterImage.jpg';
import useSignup from '../hooks/useSignup.jsx';


const Register = () => {
  const { loading, error, registerUser } = useSignup();

  const handleRegister = (values) => {
    registerUser(values);
    console.log(values);
  };

  return (
    <Card className='reg-container '>
      <Flex gap="large" align='center'>
        {/* form */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className='title'> Create an Account</Typography.Title>
          <Typography.Text type='secondary' strong className='slogan'>Joing for exclusive access!</Typography.Text>
          <Form
            layout='vertical'
            onFinish={handleRegister}
            autoComplete='off'
          >
            <Form.Item label='Full Name' name="username" rules={
              [{
                required: true,
                message: 'Please input your Full name!',
              }]
            }>
              <Input size='large' placeholder='Enter your full name'></Input>
            </Form.Item>
            <Form.Item label='active' name="active" rules={
              [{
                required: true,
                message: 'Please input youractive!',
              }]
            }>
              <Input size='large' placeholder='Enter your active'></Input>
            </Form.Item>
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
            <Form.Item label='Role' name="role"
              rules={[
                {
                  required: true,
                  message: 'Please input your Role!',
                },
                
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
            <Form.Item label='Confirm Password' name="passwordConfirm"
              rules={[
                {
                  required: true,
                  message: 'Please input your Confirm Password!',
                },
              ]}>
              <Input.Password size='large' placeholder='Re-enter your Password' />
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
                {loading ? <Spin /> : 'Create Account'}
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to='/'>
                <Button size='large' className='btn'>
                  Sign In
                </Button>
              </Link>

            </Form.Item>
          </Form>
        </Flex>
        {/* image */}
        <Flex flex={1} className='d-none d-md-block'>
          <img src={RegisterImage} className='auth-image' />
        </Flex>
      </Flex>
    </Card>
  );
}

export default Register;