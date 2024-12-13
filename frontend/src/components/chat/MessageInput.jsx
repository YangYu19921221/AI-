import React, { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const MessageInput = ({ onSend, loading }) => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('数学');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim(), subject);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
      <Space.Compact style={{ width: '100%', marginBottom: '10px' }}>
        <Select
          value={subject}
          onChange={setSubject}
          style={{ width: 120 }}
        >
          <Option value="数学">数学</Option>
          <Option value="物理">物理</Option>
          <Option value="化学">化学</Option>
          <Option value="生物">生物</Option>
          <Option value="语文">语文</Option>
          <Option value="英语">英语</Option>
        </Select>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          style={{ resize: 'none' }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          style={{ height: 'auto' }}
        >
          发送
        </Button>
      </Space.Compact>
    </div>
  );
};

export default MessageInput;
