import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Tabs,
  List,
  Button,
  Space,
  Tag,
  message,
  Spin
} from 'antd';
import {
  PlayCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from '../../../utils/axios';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(null);

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/student/courses/${id}`);
      setCourse(response.data);
      if (response.data.chapters && response.data.chapters.length > 0) {
        setActiveChapter(response.data.chapters[0]);
      }
    } catch (error) {
      message.error('获取课程详情失败');
      console.error('Error fetching course detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (chapterId) => {
    try {
      await axios.post('/api/student/progress', {
        courseId: id,
        chapterId,
        progress: 100
      });
      message.success('进度已更新');
      fetchCourseDetail(); // 重新获取课程信息以更新进度
    } catch (error) {
      message.error('更新进度失败');
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return <div>课程不存在</div>;
  }

  return (
    <div className="course-detail">
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={2}>{course.title}</Title>
                <Space>
                  <Tag color="blue">{course.category}</Tag>
                  <Tag color="green">{course.level}</Tag>
                </Space>
              </div>
              <Paragraph>{course.description}</Paragraph>
            </Space>
          </Col>
          <Col span={8}>
            <Card>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Progress
                    percent={course.progress}
                    status="active"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </div>
                <div>
                  <ClockCircleOutlined /> 最后学习时间：
                  {course.lastStudyTime
                    ? new Date(course.lastStudyTime).toLocaleDateString()
                    : '尚未开始学习'}
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <List
              dataSource={course.chapters}
              renderItem={chapter => (
                <List.Item
                  onClick={() => setActiveChapter(chapter)}
                  className={`chapter-item ${activeChapter?.id === chapter.id ? 'active' : ''}`}
                  style={{ 
                    cursor: 'pointer',
                    padding: '12px',
                    backgroundColor: activeChapter?.id === chapter.id ? '#e6f7ff' : 'transparent',
                    borderRadius: '4px'
                  }}
                >
                  <Space>
                    {chapter.completed ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <PlayCircleOutlined />
                    )}
                    <span>{chapter.title}</span>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
          <Col span={18}>
            {activeChapter && (
              <div className="chapter-content">
                <Title level={3}>{activeChapter.title}</Title>
                <div className="video-container" style={{ marginBottom: 24 }}>
                  {/* 这里可以添加视频播放器组件 */}
                  <div style={{ 
                    background: '#f0f2f5', 
                    height: '400px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PlayCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                  </div>
                </div>
                <Tabs defaultActiveKey="content">
                  <TabPane tab="章节内容" key="content">
                    <div style={{ padding: '20px' }}>
                      {activeChapter.content}
                    </div>
                  </TabPane>
                  <TabPane tab="课后作业" key="homework">
                    <div style={{ padding: '20px' }}>
                      {activeChapter.homework || '本章节暂无作业'}
                    </div>
                  </TabPane>
                </Tabs>
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => updateProgress(activeChapter.id)}
                    disabled={activeChapter.completed}
                  >
                    {activeChapter.completed ? '已完成' : '完成学习'}
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CourseDetail;
