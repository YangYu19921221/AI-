import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // 从localStorage获取用户信息
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setUserInfo(storedUserInfo);
    form.setFieldsValue(storedUserInfo);
  }, []);

  const handleSubmit = async (values) => {
    try {
      // 这里可以添加更新用户信息的API调用
      // const response = await axios.put('/api/user/profile', values);
      
      // 暂时只更新localStorage
      const updatedUserInfo = { ...userInfo, ...values };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
      setIsEditing(false);
      message.success('个人信息更新成功！');
    } catch (error) {
      message.error('更新失败，请稍后重试！');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="个人信息"
        extra={
          !isEditing ? (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              编辑资料
            </Button>
          ) : null
        }
      >
        {!isEditing ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={64} icon={<UserOutlined />} />
              <h2 style={{ marginTop: '16px' }}>{userInfo.username}</h2>
            </div>
            <Descriptions bordered>
              <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{userInfo.email}</Descriptions.Item>
              <Descriptions.Item label="角色">学生</Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={userInfo}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                保存
              </Button>
              <Button onClick={() => setIsEditing(false)}>取消</Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Profile;
