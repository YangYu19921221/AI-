import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Progress, 
  Tag, 
  Button, 
  Modal, 
  Tabs,
  List,
  Typography,
  Space,
  message,
  Spin
} from 'antd';
import { 
  PlayCircleOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  DownloadOutlined,
  BookOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CourseCard = ({ course, onViewDetails }) => (
  <Card
    hoverable
    style={{ marginBottom: 16 }}
    onClick={() => onViewDetails(course)}
  >
    <Row gutter={16} align="middle">
      <Col span={4}>
        <img 
          src={course.coverImage || 'https://via.placeholder.com/150'} 
          alt={course.title}
          style={{ width: '100%', borderRadius: 8 }}
        />
      </Col>
      <Col span={14}>
        <Title level={4}>{course.title}</Title>
        <Space direction="vertical" size="small">
          <Text type="secondary">教师：{course.teacherName}</Text>
          <Text type="secondary">上次学习：{course.lastStudyTime || '尚未开始学习'}</Text>
          <Space size="middle">
            <Tag color="blue">{course.category}</Tag>
            <Tag color="green">{course.level}</Tag>
          </Space>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Progress 
            type="circle" 
            percent={course.progress || 0} 
            width={80}
            format={percent => `${percent}%`}
          />
          <Text type="secondary">学习进度</Text>
        </Space>
      </Col>
    </Row>
  </Card>
);

const CourseDetailModal = ({ visible, course, onClose }) => {
  const [activeTab, setActiveTab] = useState('1');

  if (!course) return null;

  return (
    <Modal
      title={course.title}
      visible={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="课程详情" key="1">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={5}>课程简介</Title>
              <Text>{course.description}</Text>
            </div>
            <div>
              <Title level={5}>课程目标</Title>
              <List
                dataSource={course.objectives || []}
                renderItem={item => (
                  <List.Item>
                    <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />{item}</Text>
                  </List.Item>
                )}
              />
            </div>
          </Space>
        </TabPane>
        
        <TabPane tab="课程内容" key="2">
          <List
            dataSource={course.chapters || []}
            renderItem={chapter => (
              <List.Item>
                <List.Item.Meta
                  avatar={<BookOutlined />}
                  title={chapter.title}
                  description={chapter.description}
                />
                <Space>
                  <Button type="primary" icon={<PlayCircleOutlined />}>
                    开始学习
                  </Button>
                  {chapter.resources && (
                    <Button icon={<DownloadOutlined />}>
                      资料下载
                    </Button>
                  )}
                </Space>
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane tab="作业" key="3">
          <List
            dataSource={course.assignments || []}
            renderItem={assignment => (
              <List.Item
                actions={[
                  <Button 
                    type={assignment.submitted ? 'default' : 'primary'}
                    icon={assignment.submitted ? <CheckCircleOutlined /> : <FileTextOutlined />}
                  >
                    {assignment.submitted ? '已提交' : '去完成'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={assignment.title}
                  description={
                    <Space direction="vertical">
                      <Text>截止日期：{assignment.deadline}</Text>
                      <Text type="secondary">{assignment.description}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        message.error('获取课程列表失败');
      }
    } catch (error) {
      console.error('获取课程列表失败:', error);
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>我的课程</Title>
      <div style={{ marginTop: 24 }}>
        {courses.length > 0 ? (
          courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Text type="secondary">暂无课程</Text>
          </div>
        )}
      </div>
      
      <CourseDetailModal
        visible={modalVisible}
        course={selectedCourse}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Courses;
