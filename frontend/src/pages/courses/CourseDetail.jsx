import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout,
    Row,
    Col,
    Card,
    Button,
    Tag,
    List,
    Progress,
    Skeleton,
    message,
    Typography,
    Space,
    Divider,
    Avatar
} from 'antd';
import {
    BookOutlined,
    ClockCircleOutlined,
    UserOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [progress, setProgress] = useState(0);

    // 获取课程详情
    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/courses/${id}`);
            setCourse(response.data.data);
            
            // 检查是否已经选课
            const enrollmentResponse = await axios.get(`/api/courses/${id}/enrollment`);
            setEnrolled(enrollmentResponse.data.enrolled);
            if (enrollmentResponse.data.enrolled) {
                setProgress(enrollmentResponse.data.progress);
            }
        } catch (error) {
            message.error('获取课程详情失败');
            console.error('获取课程详情失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetail();
    }, [id]);

    // 选课
    const handleEnroll = async () => {
        try {
            await axios.post(`/api/courses/${id}/enroll`);
            message.success('选课成功！');
            setEnrolled(true);
        } catch (error) {
            message.error('选课失败');
            console.error('选课失败:', error);
        }
    };

    // 开始学习
    const startLesson = (lessonId) => {
        navigate(`/courses/${id}/lessons/${lessonId}`);
    };

    // 难度标签颜色映射
    const levelColors = {
        beginner: 'green',
        intermediate: 'blue',
        advanced: 'red'
    };

    const levelLabels = {
        beginner: '初级',
        intermediate: '中级',
        advanced: '高级'
    };

    if (loading) {
        return (
            <Layout className="tech-bg">
                <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                    <Card className="tech-card">
                        <Skeleton active />
                    </Card>
                </Content>
            </Layout>
        );
    }

    if (!course) {
        return (
            <Layout className="tech-bg">
                <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                    <Card className="tech-card">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4}>课程不存在</Title>
                            <Button type="primary" onClick={() => navigate('/courses')}>
                                返回课程列表
                            </Button>
                        </div>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout className="tech-bg">
            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <Row gutter={[24, 24]}>
                    {/* 课程信息 */}
                    <Col xs={24} lg={16}>
                        <Card className="tech-card course-detail-card">
                            <div className="course-header">
                                <img
                                    src={course.coverImage || 'https://via.placeholder.com/800x400'}
                                    alt={course.title}
                                    style={{ width: '100%', borderRadius: '8px' }}
                                />
                            </div>
                            <div className="course-content" style={{ marginTop: '24px' }}>
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div>
                                        <Title level={2}>{course.title}</Title>
                                        <Space size={[0, 8]} wrap>
                                            <Tag color={levelColors[course.level]}>
                                                {levelLabels[course.level]}
                                            </Tag>
                                            <Tag icon={<ClockCircleOutlined />}>
                                                {course.duration || '待定'} 小时
                                            </Tag>
                                            <Tag icon={<UserOutlined />}>
                                                {course.enrollments || 0} 人已报名
                                            </Tag>
                                        </Space>
                                    </div>

                                    <div>
                                        <Title level={4}>课程简介</Title>
                                        <Paragraph>{course.description}</Paragraph>
                                    </div>

                                    <div>
                                        <Title level={4}>教师信息</Title>
                                        <Space>
                                            <Avatar size="large" icon={<UserOutlined />} src={course.teacher?.avatar} />
                                            <div>
                                                <Text strong>{course.teacher?.username}</Text>
                                                <br />
                                                <Text type="secondary">{course.teacher?.title || '资深讲师'}</Text>
                                            </div>
                                        </Space>
                                    </div>
                                </Space>
                            </div>
                        </Card>
                    </Col>

                    {/* 课程进度和操作 */}
                    <Col xs={24} lg={8}>
                        <Card className="tech-card">
                            {enrolled ? (
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <Title level={4}>学习进度</Title>
                                    <Progress
                                        percent={progress}
                                        status="active"
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                    />
                                    <Button
                                        type="primary"
                                        block
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => startLesson(course.lessons[0]?.id)}
                                    >
                                        继续学习
                                    </Button>
                                </Space>
                            ) : (
                                <Button type="primary" block size="large" onClick={handleEnroll}>
                                    立即报名
                                </Button>
                            )}

                            <Divider />

                            <Title level={4}>课程目录</Title>
                            <List
                                itemLayout="horizontal"
                                dataSource={course.lessons || []}
                                renderItem={(lesson, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    icon={lesson.completed ? <CheckCircleOutlined /> : <BookOutlined />}
                                                    style={{
                                                        backgroundColor: lesson.completed ? '#87d068' : '#1890ff',
                                                    }}
                                                />
                                            }
                                            title={`${index + 1}. ${lesson.title}`}
                                            description={`${lesson.duration || 0} 分钟`}
                                        />
                                        {enrolled && (
                                            <Button
                                                type="link"
                                                onClick={() => startLesson(lesson.id)}
                                            >
                                                学习
                                            </Button>
                                        )}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default CourseDetail;
