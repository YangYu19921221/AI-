import React, { useState, useEffect, useCallback } from 'react';
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
            <span><BookOutlined /> {course.category}</span>
            <span><ClockCircleOutlined /> {course.completedChapters}/{course.totalChapters}章</span>
          </Space>
        </div>
        <div className="course-progress">
          <Progress percent={course.progress} size="small" />
        </div>
        <div className="course-footer">
          <div className="course-rating">
            <Rate disabled defaultValue={course.rating || 0} />
            <Text className="review-count">({course.studentsCount || 0}名学员)</Text>
          </div>
          <div className="course-tags">
            {course.tags && course.tags.map((tag, index) => (
              <Tag key={index} color="blue">{tag}</Tag>
            ))}
          </div>
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

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);

      const url = `/student/courses${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching courses from:', url);
      
      const response = await axios.get(url);
      console.log('API Response:', response);
      
      if (response && response.success) {
        const courseList = response.data?.list || [];
        console.log('Course list:', courseList);
        setCourses(courseList);
      } else {
        console.log('No courses found or API error:', response);
        setCourses([]);
        message.warning(response?.message || '暂无课程数据');
      }
    } catch (error) {
      console.error('获取课程列表失败:', error);
      setCourses([]);
      message.error('获取课程列表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      message.error('未登录，请先登录');
      navigate('/login');
      return;
    }
    fetchCourses();
  }, [filters, navigate, fetchCourses]);

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: '编程语言', label: '编程语言' },
    { value: '前端开发', label: '前端开发' },
    { value: '计算机科学', label: '计算机科学' }
  ];

  const statuses = [
    { value: 'all', label: '全部状态' },
    { value: 'not_started', label: '未开始' },
    { value: 'in_progress', label: '学习中' },
    { value: 'completed', label: '已完成' }
  ];

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
              {categories.map(cat => (
                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
              ))}
            </Select>
            <Select
              style={{ width: 120 }}
              placeholder="学习状态"
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              {statuses.map(status => (
                <Option key={status.value} value={status.value}>{status.label}</Option>
              ))}
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
        />
      )}
    </div>
  );
};

export default CourseList;
