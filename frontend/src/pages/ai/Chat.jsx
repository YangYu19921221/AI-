import React from 'react';
import { Layout, Typography } from 'antd';
import ChatWindow from '../../components/chat/ChatWindow';

const { Content } = Layout;
const { Title } = Typography;

const Chat = () => {
  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Title level={2}>AI智能辅导</Title>
        <ChatWindow />
      </Content>
    </Layout>
  );
};

export default Chat;
