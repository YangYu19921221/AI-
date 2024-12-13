import React from 'react';
import { Avatar, Typography, Card, Space } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const { Text } = Typography;

const Message = ({ content, role, timestamp }) => {
  const isAI = role === 'assistant';

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      marginBottom: '16px'
    }}>
      <Space align="start">
        {isAI && (
          <Avatar
            icon={<RobotOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
        )}
        <Card
          style={{
            maxWidth: '70%',
            backgroundColor: isAI ? '#f5f5f5' : '#e6f7ff',
            border: 'none'
          }}
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {new Date(timestamp).toLocaleTimeString()}
          </Text>
        </Card>
        {!isAI && (
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: '#87d068' }}
          />
        )}
      </Space>
    </div>
  );
};

export default Message;
