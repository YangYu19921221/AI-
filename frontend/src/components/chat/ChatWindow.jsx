import React, { useState, useRef, useEffect } from 'react';
import { Card, Empty, Spin } from 'antd';
import Message from './Message';
import MessageInput from './MessageInput';
import { useAI } from '../../hooks/useAI';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { sendMessage, loading } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content, subject) => {
    // 添加用户消息
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // 发送到AI并获取响应
      const response = await sendMessage(content, subject);
      
      // 添加AI响应
      const aiMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      // 可以在这里添加错误提示
    }
  };

  return (
    <Card
      style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 0
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px'
        }}
      >
        {messages.length === 0 ? (
          <Empty description="开始你的提问吧" />
        ) : (
          messages.map((message, index) => (
            <Message
              key={index}
              {...message}
            />
          ))
        )}
        <div ref={messagesEndRef} />
        {loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spin tip="AI正在思考..." />
          </div>
        )}
      </div>
      <MessageInput onSend={handleSendMessage} loading={loading} />
    </Card>
  );
};

export default ChatWindow;
