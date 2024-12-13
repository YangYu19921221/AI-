import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tabs, Progress, List, Button, Space, Tag, message, Spin, Result } from 'antd';
import {
  PlayCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import axios from '../../utils/axios';  
import './CourseDetail.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/courses/${courseId}`);

      if (response.data.success) {
        setCourse(response.data.data);
      } else {
        setError(response.data.message || '获取课程详情失败');
        message.error('获取课程详情失败');
      }
    } catch (error) {
      console.error('获取课程详情失败:', error);
      setError(error.message || '获取课程详情失败');
      message.error('获取课程详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/student/courses');
  };

  const handleStartLearning = (chapterId) => {
    // TODO: 实现开始学习功能
    message.info('即将开始学习...');
  };

  const handleDownloadMaterial = (material) => {
    // TODO: 实现资料下载功能
    message.info('即将下载资料...');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <Result
        status="error"
        title="获取课程失败"
        subTitle={error || '课程不存在'}
        extra={
          <Button type="primary" onClick={handleBack}>
            返回课程列表
          </Button>
        }
      />
    );
  }

  return (
    <div className="course-detail-container">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        返回课程列表
      </Button>
      
      <div className="course-header">
        <div className="course-info">
          <Title level={2}>{course.title}</Title>
          <Space size={16}>
            <Tag icon={<UserOutlined />} color="blue">
              {course.teacher?.name || '未知讲师'}
            </Tag>
            <Tag icon={<BookOutlined />} color="cyan">
              {course.category || '未分类'}
            </Tag>
            <Tag icon={<ClockCircleOutlined />} color="purple">
              {course.duration || '0'} 课时
            </Tag>
          </Space>
          <Text className="course-description">
            {course.description || '暂无课程描述'}
          </Text>
        </div>
        <div className="course-progress-card">
          <Card>
            <Title level={4}>学习进度</Title>
            <Progress
              type="circle"
              percent={course.progress || 0}
              format={percent => `${percent}%`}
            />
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="large"
              className="continue-btn"
              onClick={() => handleStartLearning()}
            >
              继续学习
            </Button>
          </Card>
        </div>
      </div>

      <Card className="course-content">
        <Tabs defaultActiveKey="chapters">
          <TabPane tab="课程章节" key="chapters">
            <List
              className="chapter-list"
              itemLayout="horizontal"
              dataSource={course.chapters || []}
              renderItem={(chapter, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div className="chapter-index">{String(index + 1).padStart(2, '0')}</div>
                    }
                    title={chapter.title}
                    description={
                      <Space direction="vertical" size={8}>
                        <Text type="secondary">{chapter.description}</Text>
                        <Space split="·">
                          <Text type="secondary">
                            <ClockCircleOutlined /> {chapter.duration || '0'} 分钟
                          </Text>
                          <Tag color={chapter.completed ? 'success' : 'default'}>
                            {chapter.completed ? '已完成' : '未完成'}
                          </Tag>
                        </Space>
                      </Space>
                    }
                  />
                  <Button
                    type="primary"
                    ghost
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleStartLearning(chapter.id)}
                  >
                    开始学习
                  </Button>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="课程资料" key="materials">
            <List
              className="material-list"
              itemLayout="horizontal"
              dataSource={course.materials || []}
              renderItem={material => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      ghost
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadMaterial(material)}
                      key="download"
                    >
                      下载
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={material.title}
                    description={material.description}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CourseDetail;
