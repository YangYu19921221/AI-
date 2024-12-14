import React, { useState, useEffect } from 'react';
import { 
  Input,
  Select,
  Typography,
  Space,
  message,
  Spin,
  Empty,
  Badge,
  Tag,
  Button,
  Progress,
  Rate
} from 'antd';
import { 
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import './CourseList.css';

const { Title, Text } = Typography;
const { Option } = Select;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  
  const getStatusBadge = (progress) => {
    if (progress === 100) return <Badge status="success" text="已完成" />;
    if (progress > 0) return <Badge status="processing" text="学习中" />;
    return <Badge status="default" text="未开始" />;
  };

  const handleClick = () => {
    navigate(`/student/courses/${course.id}`);
  };

  return (
    <div className="course-card" onClick={handleClick}>
      <div className="course-card-cover">
        <img 
          src={course.coverImage || 'https://via.placeholder.com/300x160?text=课程封面'} 
          alt={course.title}
        />
        <div className="course-card-status">
          {getStatusBadge(course.progress || 0)}
        </div>
      </div>
      <div className="course-card-content">
        <Title level={4} className="course-title">{course.title}</Title>
        <Text className="course-description">{course.description}</Text>
        <div className="course-meta">
          <Space>
            <span><UserOutlined /> {course.teacher?.fullName || '未知教师'}</span>
            <span><ClockCircleOutlined /> {course.duration ? `${Math.floor(course.duration / 60)}小时` : '时长未定'}</span>
            <span><BookOutlined /> {course.category}</span>
          </Space>
        </div>
        <div className="course-footer">
          <div className="course-rating">
            <Rate disabled defaultValue={parseFloat(course.average_rating)} />
            <Text className="review-count">({course.total_reviews}条评价)</Text>
          </div>
          <Button type="link" className="enter-course">
            进入课程 <RightOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    console.log('当前用户信息:', {
      token: token ? '存在' : '不存在',
      userInfo: userInfo ? JSON.parse(userInfo) : null
    });
    
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // 检查认证状态
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('未登录，请先登录');
        navigate('/login');
        return;
      }

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);

      console.log('发送请求:', `/api/student/my/courses?${params.toString()}`);
      console.log('认证Token:', token);

      const response = await axios.get(`/api/student/my/courses?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('服务器响应:', response.data);
      
      try {
        if (response.data && response.data.success) {
          const courseList = response.data.data?.list || [];
          setCourses(courseList);
        } else {
          setCourses([]);
          message.warning(response.data?.message || '暂无课程数据');
        }
      } catch (error) {
        console.error('处理课程数据时出错:', error);
        setCourses([]);
        message.error('获取课程数据失败');
      }
    } catch (error) {
      console.error('获取课程列表失败:', error);
      if (error.response) {
        console.error('错误响应:', error.response.data);
        message.error(error.response.data.message || '获取课程列表失败');
      } else {
        message.error('获取课程列表失败，请检查网络连接');
      }
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="page-header">
        <div className="header-content">
          <Title level={2}>我的课程</Title>
          <Text type="secondary">共 {courses.length} 门课程</Text>
        </div>
        <div className="header-actions">
          <Space size="middle">
            <Input.Search
              className="search-input"
              placeholder="搜索课程..."
              allowClear
              onSearch={value => setFilters(prev => ({ ...prev, search: value }))}
            />
            <Select
              style={{ width: 120 }}
              placeholder="课程分类"
              value={filters.category}
              onChange={value => setFilters(prev => ({ ...prev, category: value }))}
            >
              <Option value="all">全部分类</Option>
              <Option value="programming">编程</Option>
              <Option value="math">数学</Option>
              <Option value="physics">物理</Option>
            </Select>
            <Select
              style={{ width: 120 }}
              placeholder="学习状态"
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Option value="all">全部状态</Option>
              <Option value="not-started">未开始</Option>
              <Option value="in-progress">学习中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Space>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="course-grid">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无课程"
          className="empty-container"
        >
          <Button type="primary">浏览课程</Button>
        </Empty>
      )}
    </div>
  );
};

export default CourseList;
