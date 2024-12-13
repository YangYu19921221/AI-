import React from 'react';
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Progress,
    Avatar,
    Space,
    Button,
    List,
    Tag,
    theme
} from 'antd';
import {
    BookOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    TrophyOutlined,
    RightOutlined,
    UserOutlined
} from '@ant-design/icons';
import './Dashboard.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const StudentDashboard = () => {
    const { token } = theme.useToken();

    // 模拟数据
    const recentCourses = [
        { id: 1, name: '高等数学', progress: 60, lastStudied: '2023-12-12', teacher: '张老师' },
        { id: 2, name: '线性代数', progress: 30, lastStudied: '2023-12-11', teacher: '李老师' },
        { id: 3, name: '概率论', progress: 45, lastStudied: '2023-12-10', teacher: '王老师' },
    ];

    const upcomingTasks = [
        { id: 1, title: '高等数学作业', dueDate: '2023-12-15', type: 'assignment' },
        { id: 2, title: '线性代数测验', dueDate: '2023-12-16', type: 'quiz' },
        { id: 3, title: '概率论课程', dueDate: '2023-12-17', type: 'class' },
    ];

    const achievements = [
        { id: 1, title: '学习达人', description: '连续学习7天', icon: '🏆' },
        { id: 2, title: '知识探索者', description: '完成5门课程', icon: '🎯' },
        { id: 3, title: '优秀学员', description: '获得3个A+', icon: '⭐' },
    ];

    return (
        <Layout className="dashboard-layout">
            <Content className="dashboard-content">
                {/* 顶部欢迎区域 */}
                <div className="welcome-section">
                    <Row gutter={[24, 24]} align="middle">
                        <Col flex="none">
                            <Avatar size={64} icon={<UserOutlined />} />
                        </Col>
                        <Col flex="auto">
                            <Title level={4} style={{ margin: 0 }}>欢迎回来，张同学</Title>
                            <Text type="secondary">今天是学习的好日子！</Text>
                        </Col>
                        <Col flex="none">
                            <Space>
                                <Button type="primary" icon={<BookOutlined />}>
                                    继续学习
                                </Button>
                                <Button icon={<CalendarOutlined />}>
                                    查看日程
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* 学习进度区域 */}
                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="stat-card progress-card">
                            <div className="stat-header">
                                <BookOutlined className="stat-icon" />
                                <Text>课程进度</Text>
                            </div>
                            <Title level={3}>5/12</Title>
                            <Progress percent={42} strokeColor={token.colorPrimary} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="stat-card time-card">
                            <div className="stat-header">
                                <ClockCircleOutlined className="stat-icon" />
                                <Text>学习时长</Text>
                            </div>
                            <Title level={3}>24h</Title>
                            <Progress percent={75} strokeColor="#52c41a" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="stat-card task-card">
                            <div className="stat-header">
                                <CalendarOutlined className="stat-icon" />
                                <Text>待完成任务</Text>
                            </div>
                            <Title level={3}>3</Title>
                            <Progress percent={60} strokeColor="#faad14" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="stat-card achievement-card">
                            <div className="stat-header">
                                <TrophyOutlined className="stat-icon" />
                                <Text>获得成就</Text>
                            </div>
                            <Title level={3}>12</Title>
                            <Progress percent={90} strokeColor="#eb2f96" />
                        </Card>
                    </Col>
                </Row>

                {/* 最近课程和待办任务 */}
                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} md={16}>
                        <Card 
                            title="最近学习" 
                            extra={<Button type="link" icon={<RightOutlined />}>查看全部</Button>}
                            className="list-card"
                        >
                            <List
                                dataSource={recentCourses}
                                renderItem={item => (
                                    <List.Item className="course-item">
                                        <div className="course-info">
                                            <Title level={5}>{item.name}</Title>
                                            <Space>
                                                <Text type="secondary">
                                                    <UserOutlined /> {item.teacher}
                                                </Text>
                                                <Text type="secondary">
                                                    <ClockCircleOutlined /> {item.lastStudied}
                                                </Text>
                                            </Space>
                                        </div>
                                        <Progress 
                                            percent={item.progress} 
                                            size="small" 
                                            style={{ width: 120 }}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card 
                            title="待办任务" 
                            extra={<Button type="link" icon={<RightOutlined />}>更多</Button>}
                            className="list-card"
                        >
                            <List
                                dataSource={upcomingTasks}
                                renderItem={item => (
                                    <List.Item className="task-item">
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text strong>{item.title}</Text>
                                                <Tag color={
                                                    item.type === 'assignment' ? 'blue' : 
                                                    item.type === 'quiz' ? 'red' : 
                                                    'green'
                                                }>
                                                    {item.type}
                                                </Tag>
                                            </div>
                                            <Text type="secondary">
                                                <CalendarOutlined /> 截止日期：{item.dueDate}
                                            </Text>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* 成就展示 */}
                <Card 
                    title="我的成就" 
                    className="achievements-card"
                    style={{ marginTop: 24 }}
                >
                    <Row gutter={[24, 24]}>
                        {achievements.map(achievement => (
                            <Col xs={24} sm={12} md={8} key={achievement.id}>
                                <Card className="achievement-item">
                                    <Space align="start">
                                        <div className="achievement-icon">
                                            {achievement.icon}
                                        </div>
                                        <div>
                                            <Text strong>{achievement.title}</Text>
                                            <br />
                                            <Text type="secondary">{achievement.description}</Text>
                                        </div>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Content>
        </Layout>
    );
};

export default StudentDashboard;
