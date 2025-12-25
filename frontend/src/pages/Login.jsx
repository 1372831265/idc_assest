import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Tabs, Divider, Space, Modal, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const { login, register, checkAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkIsFirstUser();
  }, []);

  const checkIsFirstUser = async () => {
    try {
      const response = await checkAdmin();
      if (response.success) {
        setIsFirstUser(!response.data.hasAdmin);
        if (!response.data.hasAdmin) {
          setRegisterMode(true);
        }
      }
    } catch (error) {
      console.error('检查用户状态失败:', error);
    }
  };

  const onFinishLogin = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.username, values.password);
      if (result.success) {
        message.success('登录成功');
        navigate('/');
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error) {
      message.error(error || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const onFinishRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        username: values.username,
        password: values.password,
        email: values.email,
        phone: values.phone,
        realName: values.realName
      });

      if (result.success) {
        message.success(result.isFirstUser ? '注册成功，已为您创建管理员账户' : '注册成功');
        navigate('/');
      } else {
        message.error(result.message || '注册失败');
      }
    } catch (error) {
      message.error(error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: isFirstUser ? 450 : 400,
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#666'
  };

  const formStyle = {
    marginTop: '24px'
  };

  const submitButtonStyle = {
    width: '100%',
    height: '48px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px'
  };

  const footerStyle = {
    textAlign: 'center',
    marginTop: '24px'
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            <RobotOutlined />
          </div>
          <Title level={2} style={titleStyle}>
            {isFirstUser ? '创建管理员账户' : 'IDC设备管理系统'}
          </Title>
          <Text style={subtitleStyle}>
            {isFirstUser ? '首次使用，请创建系统管理员账户' : '请登录您的账户'}
          </Text>
        </div>

        {isFirstUser && (
          <Alert
            message="欢迎使用IDC设备管理系统"
            description="您是第一个用户，系统将自动为您分配管理员权限。"
            type="success"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          name={registerMode ? 'register' : 'login'}
          size="large"
          onFinish={registerMode ? onFinishRegister : onFinishLogin}
          style={formStyle}
        >
          {registerMode ? (
            <>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, max: 20, message: '用户名长度必须在3-20个字符之间' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                />
              </Form.Item>

              <Form.Item
                name="realName"
                rules={[{ required: true, message: '请输入真实姓名' }]}
              >
                <Input 
                  prefix={<SafetyCertificateOutlined />} 
                  placeholder="真实姓名" 
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="邮箱" 
                />
              </Form.Item>

              <Form.Item
                name="phone"
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="手机号（可选）" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码长度不能少于6个字符' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="密码" 
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="确认密码" 
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="密码" 
                />
              </Form.Item>
            </>
          )}

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={submitButtonStyle}
            >
              {registerMode ? '立即注册' : '登 录'}
            </Button>
          </Form.Item>
        </Form>

        {!isFirstUser && (
          <div style={footerStyle}>
            <Space split={<Divider type="vertical" />}>
              <Button 
                type="link" 
                size="small"
                onClick={() => setRegisterMode(!registerMode)}
              >
                {registerMode ? '已有账户？去登录' : '注册新账户'}
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
